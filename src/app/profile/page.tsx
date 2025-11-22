'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getUserProfile } from '@/lib/storage';
import { ArrowLeft, User, Calendar, MapPin, Star, Heart, Music, Film, Utensils, Target, Clock } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const profile = getUserProfile();

  if (!profile) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">O Teu Perfil</h1>
              <p className="text-sm text-gray-600">Informações pessoais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Informações Básicas
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold text-gray-800">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Idade</p>
                <p className="font-semibold text-gray-800">{profile.age} anos</p>
              </div>
              {profile.gender && (
                <div>
                  <p className="text-sm text-gray-600">Género</p>
                  <p className="font-semibold text-gray-800">{profile.gender}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Star className="w-4 h-4" /> Signo
                </p>
                <p className="font-semibold text-gray-800">{profile.zodiacSign}</p>
              </div>
            </div>
          </Card>

          {/* Localização */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Localização
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">País</p>
                <p className="font-semibold text-gray-800">{profile.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fuso Horário</p>
                <p className="font-semibold text-gray-800">{profile.timezone}</p>
              </div>
            </div>
          </Card>

          {/* Horários */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Horários dos Momentos
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">🌅 Manhã</p>
                <p className="font-semibold text-gray-800">{profile.morningTime}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">🌇 Tarde</p>
                <p className="font-semibold text-gray-800">{profile.afternoonTime}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">🌙 Noite</p>
                <p className="font-semibold text-gray-800">{profile.nightTime}</p>
              </div>
            </div>
          </Card>

          {/* Preferências */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-indigo-600" />
              Preferências
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <Utensils className="w-4 h-4" /> Comidas Favoritas
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.foodPreferences.map((food) => (
                    <span
                      key={food}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <Film className="w-4 h-4" /> Géneros de Filmes
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.movieGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <Music className="w-4 h-4" /> Estilos de Música
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.musicStyles.map((style) => (
                    <span
                      key={style}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Objetivos */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Objetivos
            </h2>
            <div className="space-y-2">
              {profile.mainGoal.map((goal) => (
                <div
                  key={goal}
                  className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg"
                >
                  <span className="text-indigo-600">✓</span>
                  <span className="text-gray-800">{goal}</span>
                </div>
              ))}
            </div>

            {profile.wantsSunoPrompts && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  🎵 Recebes prompts para criar músicas no Suno
                </p>
              </div>
            )}
          </Card>

          {/* Botão Editar */}
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            onClick={() => router.push('/settings')}
          >
            Editar Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
