'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { getUserProfile, saveDailyInteraction } from '@/lib/storage';
import { getAfternoonSuggestion } from '@/lib/ai-responses';
import { ConcernType, AfternoonResponse } from '@/lib/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

const CONCERNS = [
  { id: 'dinner' as ConcernType, emoji: '🍽️', label: 'Jantar', description: 'Preciso de ideias para o jantar' },
  { id: 'movie' as ConcernType, emoji: '🎬', label: 'Filme/Série', description: 'Quero ver algo interessante' },
  { id: 'create' as ConcernType, emoji: '🎵', label: 'Criar', description: 'Quero criar algo (música/arte)' },
  { id: 'advice' as ConcernType, emoji: '💭', label: 'Conselho', description: 'Só preciso de um conselho' },
];

export default function AfternoonPage() {
  const router = useRouter();
  const [step, setStep] = useState<'rating' | 'concern' | 'result'>('rating');
  const [dayRating, setDayRating] = useState<number>(5);
  const [selectedConcern, setSelectedConcern] = useState<ConcernType | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleRatingComplete = () => {
    setStep('concern');
  };

  const handleConcernSelect = (concern: ConcernType) => {
    setSelectedConcern(concern);
    
    const profile = getUserProfile();
    if (!profile) {
      router.push('/onboarding');
      return;
    }

    // Gerar sugestão
    const response = getAfternoonSuggestion(concern, dayRating, profile);
    setSuggestion(response);

    // Salvar interação
    const today = new Date().toISOString().split('T')[0];
    const afternoonResponse: AfternoonResponse = {
      dayRating,
      concern,
      timestamp: new Date(),
    };

    saveDailyInteraction({
      userId: profile.id || 'user',
      date: today,
      afternoon: afternoonResponse,
    });

    setStep('result');
  };

  const getRatingEmoji = (rating: number) => {
    if (rating <= 3) return '😔';
    if (rating <= 5) return '😐';
    if (rating <= 7) return '🙂';
    return '😊';
  };

  const getRatingLabel = (rating: number) => {
    if (rating <= 3) return 'Difícil';
    if (rating <= 5) return 'Normal';
    if (rating <= 7) return 'Bom';
    return 'Ótimo';
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/40 via-orange-500/30 to-yellow-500/40 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-amber-200 sticky top-0 z-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-full hover:bg-amber-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              {/* Avatar da App - Tarde */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg ring-2 ring-white">
                <span className="text-2xl">🌤️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Boa Tarde!</h1>
                <p className="text-sm text-gray-600">Como está a correr o dia?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {step === 'rating' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-amber-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">🌤️</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Como está a correr o dia?
                    </h2>
                    <p className="text-gray-600">
                      Avalia de 0 a 10 como está a ser o teu dia até agora
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="text-7xl mb-4">{getRatingEmoji(dayRating)}</div>
                    <div className="text-5xl font-bold text-gray-800 mb-2">
                      {dayRating}
                    </div>
                    <div className="text-xl text-gray-600 font-medium">
                      {getRatingLabel(dayRating)}
                    </div>
                  </div>

                  <div className="px-4">
                    <Slider
                      value={[dayRating]}
                      onValueChange={(value) => setDayRating(value[0])}
                      min={0}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
                      <span>0 - Péssimo</span>
                      <span>10 - Perfeito</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-8 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg h-12 text-base"
                  onClick={handleRatingComplete}
                >
                  Continuar
                </Button>
              </Card>
            </div>
          )}

          {step === 'concern' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-amber-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">🌤️</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      O que te preocupa mais agora?
                    </h2>
                    <p className="text-gray-600">
                      Escolhe em que posso ajudar-te neste momento
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {CONCERNS.map((concern) => (
                    <Button
                      key={concern.id}
                      variant="outline"
                      className="h-auto p-5 flex items-center gap-4 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all text-left border-2"
                      onClick={() => handleConcernSelect(concern.id)}
                    >
                      <span className="text-4xl">{concern.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{concern.label}</div>
                        <div className="text-sm text-gray-600">{concern.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === 'result' && suggestion && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-amber-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🌤️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      A Tua Sugestão
                    </h2>
                    <p className="text-sm text-gray-600">Aqui está o que preparei para ti</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {suggestion.advice && (
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                      <p className="text-gray-800 leading-relaxed text-lg">{suggestion.advice}</p>
                    </div>
                  )}

                  {suggestion.suggestion && (
                    <div className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
                      <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Sugestão:
                      </p>
                      <p className="text-gray-800 text-base">{suggestion.suggestion}</p>
                    </div>
                  )}

                  {suggestion.action && (
                    <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                      <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        ✨ Ação recomendada:
                      </p>
                      <p className="text-gray-800 text-base">{suggestion.action}</p>
                    </div>
                  )}

                  {suggestion.sunoPrompt && (
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
                      <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        🎵 Prompt para o Suno:
                      </p>
                      <p className="text-gray-800 italic text-base">{suggestion.sunoPrompt}</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white/90 hover:bg-white border-2"
                  onClick={() => {
                    setStep('rating');
                    setSelectedConcern(null);
                    setSuggestion(null);
                  }}
                >
                  Refazer
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg"
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
