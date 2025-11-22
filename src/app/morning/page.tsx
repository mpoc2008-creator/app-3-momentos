'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getUserProfile, saveDailyInteraction, getTodayInteraction } from '@/lib/storage';
import { getMorningAdvice } from '@/lib/ai-responses';
import { MoodType, PriorityType, MorningResponse } from '@/lib/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

const MOODS = [
  { id: 'tired' as MoodType, emoji: '😴', label: 'Cansado' },
  { id: 'ok' as MoodType, emoji: '😊', label: 'Ok' },
  { id: 'motivated' as MoodType, emoji: '🚀', label: 'Motivado' },
  { id: 'down' as MoodType, emoji: '😔', label: 'Em baixo' },
];

const PRIORITIES = [
  { id: 'work' as PriorityType, emoji: '💼', label: 'Trabalho' },
  { id: 'family' as PriorityType, emoji: '👨‍👩‍👧‍👦', label: 'Família' },
  { id: 'money' as PriorityType, emoji: '💰', label: 'Dinheiro' },
  { id: 'health' as PriorityType, emoji: '🏃', label: 'Saúde' },
  { id: 'relationship' as PriorityType, emoji: '❤️', label: 'Relacionamento' },
];

export default function MorningPage() {
  const router = useRouter();
  const [step, setStep] = useState<'mood' | 'priority' | 'result'>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityType | null>(null);
  const [advice, setAdvice] = useState<any>(null);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setStep('priority');
  };

  const handlePrioritySelect = (priority: PriorityType) => {
    setSelectedPriority(priority);
    
    const profile = getUserProfile();
    if (!profile) {
      router.push('/onboarding');
      return;
    }

    // Gerar conselho
    const response = getMorningAdvice(selectedMood!, priority, profile);
    setAdvice(response);

    // Salvar interação
    const today = new Date().toISOString().split('T')[0];
    const morningResponse: MorningResponse = {
      mood: selectedMood!,
      priority,
      timestamp: new Date(),
    };

    saveDailyInteraction({
      userId: profile.id || 'user',
      date: today,
      morning: morningResponse,
    });

    setStep('result');
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&h=1080&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-pink-500/30 to-purple-500/40 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-orange-200 sticky top-0 z-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-full hover:bg-orange-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              {/* Avatar da App - Manhã */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg ring-2 ring-white">
                <span className="text-2xl">☀️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Bom Dia!</h1>
                <p className="text-sm text-gray-600">Como te sentes esta manhã?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {step === 'mood' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-orange-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">☀️</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Como te sentes agora?
                    </h2>
                    <p className="text-gray-600">
                      Escolhe o emoji que melhor representa o teu estado atual
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {MOODS.map((mood) => (
                    <Button
                      key={mood.id}
                      variant="outline"
                      className="h-auto py-6 flex flex-col items-center gap-3 hover:bg-orange-50 hover:border-orange-400 hover:shadow-lg transition-all border-2"
                      onClick={() => handleMoodSelect(mood.id)}
                    >
                      <span className="text-5xl">{mood.emoji}</span>
                      <span className="text-lg font-medium">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === 'priority' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-orange-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-3xl">☀️</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      O que é mais importante hoje?
                    </h2>
                    <p className="text-gray-600">
                      Escolhe a tua prioridade principal para este dia
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {PRIORITIES.map((priority) => (
                    <Button
                      key={priority.id}
                      variant="outline"
                      className="h-auto py-6 flex flex-col items-center gap-3 hover:bg-orange-50 hover:border-orange-400 hover:shadow-lg transition-all border-2"
                      onClick={() => handlePrioritySelect(priority.id)}
                    >
                      <span className="text-4xl">{priority.emoji}</span>
                      <span className="text-base font-medium">{priority.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {step === 'result' && advice && (
            <div className="space-y-6">
              <Card className="p-6 bg-white/95 backdrop-blur-md shadow-2xl border-orange-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">☀️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      O Teu Conselho de Hoje
                    </h2>
                    <p className="text-sm text-gray-600">Preparei isto especialmente para ti</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl border-2 border-orange-200">
                    <p className="text-gray-800 leading-relaxed text-lg">{advice.advice}</p>
                  </div>

                  {advice.action && (
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                      <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Ação para hoje:
                      </p>
                      <p className="text-gray-800 text-base">{advice.action}</p>
                    </div>
                  )}

                  {advice.sunoPrompt && (
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
                      <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        🎵 Prompt para o Suno:
                      </p>
                      <p className="text-gray-800 italic text-base">{advice.sunoPrompt}</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white/90 hover:bg-white border-2"
                  onClick={() => {
                    setStep('mood');
                    setSelectedMood(null);
                    setSelectedPriority(null);
                    setAdvice(null);
                  }}
                >
                  Refazer
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-lg"
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
