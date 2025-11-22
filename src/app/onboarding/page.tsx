'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { saveUserProfile } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const ZODIAC_SIGNS = [
  'Áries', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];

const FOOD_PREFERENCES = [
  'Massa', 'Fast Food', 'Saudável', 'Sushi', 'Grelhados', 
  'Vegetariano', 'Doces', 'Comida Caseira'
];

const MOVIE_GENRES = [
  'Romance', 'Ação', 'Comédia', 'Drama', 'Terror', 
  'Ficção Científica', 'Documentário', 'Animação'
];

const MUSIC_STYLES = [
  'Sertanejo', 'Kizomba', 'Pop', 'Gospel', 'Latino', 
  'Rock', 'Hip Hop', 'Eletrónica', 'Jazz', 'Clássica'
];

const MAIN_GOALS = [
  'Melhorar decisões do dia a dia',
  'Reduzir ansiedade',
  'Organizar melhor o dia',
  'Ter ideias do que fazer no tempo livre'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    foodPreferences: [],
    movieGenres: [],
    musicStyles: [],
    mainGoal: [],
    wantsSunoPrompts: false,
    morningTime: '08:00',
    afternoonTime: '15:00',
    nightTime: '21:00',
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Salvar perfil e redirecionar
      saveUserProfile(formData as UserProfile);
      router.push('/');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.age > 0;
      case 2:
        return formData.country && formData.timezone && formData.zodiacSign;
      case 3:
        return (
          formData.foodPreferences!.length > 0 &&
          formData.movieGenres!.length > 0 &&
          formData.musicStyles!.length > 0
        );
      case 4:
        return formData.mainGoal!.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-black bg-clip-text text-transparent mb-2">
              Bem-vindo aos 3 Momentos
            </h1>
            <p className="text-gray-600">
              Vamos conhecer-te melhor para personalizar a tua experiência
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Passo {step} de {totalSteps}
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Informações Básicas
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Como te chamas?</Label>
                    <Input
                      id="name"
                      placeholder="O teu nome"
                      value={formData.name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Qual é a tua idade?</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Idade"
                      value={formData.age || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Género (opcional)</Label>
                    <Input
                      id="gender"
                      placeholder="Ex: Masculino, Feminino, Outro"
                      value={formData.gender || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Localização e Signo
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      placeholder="Ex: Portugal, Brasil"
                      value={formData.country || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Input
                      id="timezone"
                      placeholder="Ex: Europe/Lisbon, America/Sao_Paulo"
                      value={formData.timezone || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, timezone: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Signo</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {ZODIAC_SIGNS.map((sign) => (
                        <Button
                          key={sign}
                          type="button"
                          variant={
                            formData.zodiacSign === sign ? 'default' : 'outline'
                          }
                          onClick={() =>
                            setFormData({ ...formData, zodiacSign: sign })
                          }
                          className="w-full"
                        >
                          {sign}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Os Teus Gostos
                </h2>
                
                <div>
                  <Label>Tipos de comida favoritos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {FOOD_PREFERENCES.map((food) => (
                      <div key={food} className="flex items-center space-x-2">
                        <Checkbox
                          id={`food-${food}`}
                          checked={formData.foodPreferences!.includes(food)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              foodPreferences: toggleArrayItem(
                                formData.foodPreferences!,
                                food
                              ),
                            })
                          }
                        />
                        <label
                          htmlFor={`food-${food}`}
                          className="text-sm cursor-pointer"
                        >
                          {food}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Géneros de filmes/séries</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {MOVIE_GENRES.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`movie-${genre}`}
                          checked={formData.movieGenres!.includes(genre)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              movieGenres: toggleArrayItem(
                                formData.movieGenres!,
                                genre
                              ),
                            })
                          }
                        />
                        <label
                          htmlFor={`movie-${genre}`}
                          className="text-sm cursor-pointer"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Estilos de música</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {MUSIC_STYLES.map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox
                          id={`music-${style}`}
                          checked={formData.musicStyles!.includes(style)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              musicStyles: toggleArrayItem(
                                formData.musicStyles!,
                                style
                              ),
                            })
                          }
                        />
                        <label
                          htmlFor={`music-${style}`}
                          className="text-sm cursor-pointer"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Os Teus Objetivos
                </h2>
                
                <div>
                  <Label>O que queres alcançar com a app?</Label>
                  <div className="space-y-3 mt-3">
                    {MAIN_GOALS.map((goal) => (
                      <div
                        key={goal}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={formData.mainGoal!.includes(goal)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              mainGoal: toggleArrayItem(
                                formData.mainGoal!,
                                goal
                              ),
                            })
                          }
                        />
                        <label
                          htmlFor={`goal-${goal}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {goal}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="suno"
                      checked={formData.wantsSunoPrompts}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          wantsSunoPrompts: checked as boolean,
                        })
                      }
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="suno"
                        className="text-sm font-medium cursor-pointer block mb-1"
                      >
                        🎵 Quero receber prompts para criar músicas no Suno
                      </label>
                      <p className="text-xs text-gray-600">
                        Vais receber sugestões criativas de prompts para gerares
                        músicas personalizadas baseadas no teu estado emocional
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Horários dos Teus 3 Momentos
                </h2>
                <p className="text-gray-600">
                  Escolhe os horários em que queres receber as notificações
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Label htmlFor="morning" className="flex items-center gap-2">
                      <span className="text-2xl">🌅</span>
                      <span>Mensagem da Manhã</span>
                    </Label>
                    <Input
                      id="morning"
                      type="time"
                      value={formData.morningTime}
                      onChange={(e) =>
                        setFormData({ ...formData, morningTime: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <Label htmlFor="afternoon" className="flex items-center gap-2">
                      <span className="text-2xl">🌇</span>
                      <span>Mensagem da Tarde</span>
                    </Label>
                    <Input
                      id="afternoon"
                      type="time"
                      value={formData.afternoonTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          afternoonTime: e.target.value,
                        })
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Label htmlFor="night" className="flex items-center gap-2">
                      <span className="text-2xl">🌙</span>
                      <span>Mensagem da Noite</span>
                    </Label>
                    <Input
                      id="night"
                      type="time"
                      value={formData.nightTime}
                      onChange={(e) =>
                        setFormData({ ...formData, nightTime: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Nota:</strong> As notificações push funcionarão
                    quando instalares esta app no teu dispositivo. Por agora,
                    podes aceder aos momentos manualmente a qualquer hora!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {step === totalSteps ? 'Começar' : 'Continuar'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
