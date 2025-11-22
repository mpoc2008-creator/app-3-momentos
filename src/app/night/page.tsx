'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getUserProfile, saveDailyInteraction } from '@/lib/storage';
import { getNightReflection } from '@/lib/ai-responses';
import { DayRatingType, NightResponse } from '@/lib/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

const DAY_COMPARISONS = [
  { id: 'better' as DayRatingType, emoji: '✨', label: 'Melhor', description: 'Foi melhor que esperava' },
  { id: 'same' as DayRatingType, emoji: '😊', label: 'Igual', description: 'Foi como esperava' },
  { id: 'worse' as DayRatingType, emoji: '😔', label: 'Pior', description: 'Foi pior que esperava' },
];

export default function NightPage() {
  const router = useRouter();
  const [step, setStep] = useState<'comparison' | 'selfcare' | 'positive' | 'result'>('comparison');
  const [dayComparison, setDayComparison] = useState<DayRatingType | null>(null);
  const [didSomethingGood, setDidSomethingGood] = useState<boolean | null>(null);
  const [positiveThings, setPositiveThings] = useState<string>('');
  const [reflection, setReflection] = useState<any>(null);

  const handleComparisonSelect = (comparison: DayRatingType) => {
    setDayComparison(comparison);
    setStep('selfcare');
  };

  const handleSelfCareSelect = (answer: boolean) => {
    setDidSomethingGood(answer);
    setStep('positive');
  };

  const handleComplete = () => {
    const profile = getUserProfile();
    if (!profile) {
      router.push('/onboarding');
      return;
    }

    // Gerar reflexão
    const response = getNightReflection(dayComparison!, didSomethingGood!, profile);
    setReflection(response);

    // Salvar interação
    const today = new Date().toISOString().split('T')[0];
    const nightResponse: NightResponse = {
      dayComparison: dayComparison!,
      didSomethingGood: didSomethingGood!,
      positiveThings: positiveThings ? positiveThings.split('\n').filter(t => t.trim()) : undefined,
      timestamp: new Date(),
    };

    saveDailyInteraction({
      userId: profile.id || 'user',
      date: today,
      night: nightResponse,
    });

    setStep('result');
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-blue-900/60 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-indigo-950/80 backdrop-blur-md border-b border-indigo-700/50 sticky top-0 z-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-full text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              {/* Avatar da App - Noite */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-white/30">
                <span className="text-2xl">🌙</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Boa Noite!</h1>
                <p className="text-sm text-white/80">Vamos refletir sobre o dia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {step === 'comparison' && (
            <div className="space-y-6">
              <Card className="p-6 bg-indigo-950/80 backdrop-blur-md shadow-2xl border-indigo-700/50 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      Como foi o dia de hoje?
                    </h2>
                    <p className="text-white/80">
                      Comparado com o que esperavas, o dia foi...
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {DAY_COMPARISONS.map((comparison) => (
                    <Button
                      key={comparison.id}
                      variant="outline"
                      className="h-auto p-5 flex items-center gap-4 bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 transition-all text-left text-white border-2"
                      onClick={() => handleComparisonSelect(comparison.id)}
                    >
                      <span className="text-4xl">{comparison.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{comparison.label}</div>
                        <div className="text-sm text-white/70">{comparison.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === 'selfcare' && (
            <div className="space-y-6">
              <Card className="p-6 bg-indigo-950/80 backdrop-blur-md shadow-2xl border-indigo-700/50 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      Cuidaste de ti hoje?
                    </h2>
                    <p className="text-white/80">
                      Conseguiste fazer pelo menos uma coisa boa por ti?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-8 flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 transition-all text-white border-2"
                    onClick={() => handleSelfCareSelect(true)}
                  >
                    <span className="text-5xl">✅</span>
                    <span className="text-lg font-medium">Sim</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-8 flex flex-col items-center gap-3 bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 transition-all text-white border-2"
                    onClick={() => handleSelfCareSelect(false)}
                  >
                    <span className="text-5xl">❌</span>
                    <span className="text-lg font-medium">Não</span>
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {step === 'positive' && (
            <div className="space-y-6">
              <Card className="p-6 bg-indigo-950/80 backdrop-blur-md shadow-2xl border-indigo-700/50 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      3 Coisas Positivas
                    </h2>
                    <p className="text-white/80">
                      Antes de dormir, escreve 3 coisas boas que aconteceram hoje (opcional)
                    </p>
                  </div>
                </div>

                <Textarea
                  placeholder="1. &#10;2. &#10;3. "
                  value={positiveThings}
                  onChange={(e) => setPositiveThings(e.target.value)}
                  className="min-h-[150px] bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:bg-white/15"
                  rows={6}
                />

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/10 hover:bg-white/20 border-white/30 text-white"
                    onClick={handleComplete}
                  >
                    Pular
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                    onClick={handleComplete}
                  >
                    Continuar
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {step === 'result' && reflection && (
            <div className="space-y-6">
              <Card className="p-6 bg-indigo-950/80 backdrop-blur-md shadow-2xl border-indigo-700/50 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🌙</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Reflexão da Noite
                    </h2>
                    <p className="text-sm text-white/80">Pensamentos para ti</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-white/15 rounded-xl border-2 border-white/20">
                    <p className="text-white leading-relaxed text-lg">{reflection.advice}</p>
                  </div>

                  {reflection.action && (
                    <div className="p-5 bg-indigo-500/30 rounded-xl border-2 border-indigo-400/30">
                      <p className="text-sm font-semibold text-indigo-200 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Para amanhã:
                      </p>
                      <p className="text-white text-base">{reflection.action}</p>
                    </div>
                  )}

                  {reflection.sunoPrompt && (
                    <div className="p-5 bg-purple-500/30 rounded-xl border-2 border-purple-300/30">
                      <p className="text-sm font-semibold text-purple-200 mb-2 flex items-center gap-2">
                        🎵 Música para relaxar:
                      </p>
                      <p className="text-white italic text-base">{reflection.sunoPrompt}</p>
                    </div>
                  )}

                  {positiveThings && (
                    <div className="p-5 bg-white/15 rounded-xl border-2 border-white/20">
                      <p className="text-sm font-semibold text-indigo-200 mb-3 flex items-center gap-2">
                        ✨ As tuas 3 coisas positivas:
                      </p>
                      <div className="text-white whitespace-pre-line text-base leading-relaxed">
                        {positiveThings}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-5 bg-indigo-950/60 backdrop-blur-md border-indigo-700/50 text-center">
                <p className="text-white/90 text-base leading-relaxed">
                  🌙 Descansa bem. Amanhã é um novo dia cheio de possibilidades.
                </p>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white/10 hover:bg-white/20 border-white/30 text-white"
                  onClick={() => {
                    setStep('comparison');
                    setDayComparison(null);
                    setDidSomethingGood(null);
                    setPositiveThings('');
                    setReflection(null);
                  }}
                >
                  Refazer
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
                  onClick={() => router.push('/')}
                >
                  Voltar ao Início
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
