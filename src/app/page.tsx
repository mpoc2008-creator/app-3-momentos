'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete, getUserProfile } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sunrise, Sun, Moon, User, Settings } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkOnboarding = () => {
      if (!isOnboardingComplete()) {
        router.push('/onboarding');
      } else {
        const profile = getUserProfile();
        if (profile) {
          setUserName(profile.name);
        }
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-pulse text-indigo-600 text-xl">A carregar...</div>
      </div>
    );
  }

  const moments = [
    {
      id: 'morning',
      title: 'Manhã',
      icon: Sunrise,
      gradient: 'from-orange-400 to-pink-500',
      description: 'Como te sentes hoje?',
      path: '/morning',
    },
    {
      id: 'afternoon',
      title: 'Tarde',
      icon: Sun,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Como está a correr o dia?',
      path: '/afternoon',
    },
    {
      id: 'night',
      title: 'Noite',
      icon: Moon,
      gradient: 'from-indigo-500 to-purple-600',
      description: 'Reflexão do dia',
      path: '/night',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              3 Momentos
            </h1>
            <p className="text-sm text-gray-600">Olá, {userName}! 👋</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/profile')}
              className="rounded-full"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/settings')}
              className="rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Os Teus 3 Momentos de Hoje
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Três pausas ao longo do dia para te conectares contigo mesmo,
            receberes apoio e tomares melhores decisões.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {moments.map((moment) => {
            const Icon = moment.icon;
            return (
              <Card
                key={moment.id}
                className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                onClick={() => router.push(moment.path)}
              >
                <div className="p-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${moment.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {moment.title}
                  </h3>
                  <p className="text-gray-600">{moment.description}</p>
                </div>
                <div
                  className={`h-2 bg-gradient-to-r ${moment.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                />
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💡 Como funciona?
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Manhã:</strong> Partilha como te sentes e recebe um
                  conselho para começar o dia
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Tarde:</strong> Avalia o dia e recebe sugestões
                  práticas (jantar, filme, música)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Noite:</strong> Reflete sobre o dia e prepara-te para
                  um bom descanso
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
