'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { clearAllData } from '@/lib/storage';
import { ArrowLeft, Settings, Trash2, Bell, Info, Shield } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    clearAllData();
    router.push('/onboarding');
  };

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
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Configurações</h1>
              <p className="text-sm text-gray-600">Gerir a tua conta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Notificações */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Notificações
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>💡 Notificações Push</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Para receberes notificações nos horários configurados, instala esta app no teu dispositivo:
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
                  <li>• <strong>iOS:</strong> Safari → Partilhar → Adicionar ao Ecrã Principal</li>
                  <li>• <strong>Android:</strong> Chrome → Menu → Instalar App</li>
                </ul>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/profile')}
              >
                Ver Horários Configurados
              </Button>
            </div>
          </Card>

          {/* Sobre */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              Sobre a App
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>3 Momentos</strong> é o teu coach pessoal que te acompanha ao longo do dia com três check-ins diários.
              </p>
              <p>
                Através de perguntas simples e conselhos personalizados, ajudamos-te a:
              </p>
              <ul className="ml-4 space-y-1">
                <li>• Tomar melhores decisões</li>
                <li>• Reduzir ansiedade</li>
                <li>• Organizar o teu dia</li>
                <li>• Encontrar ideias para o tempo livre</li>
              </ul>
            </div>
          </Card>

          {/* Privacidade */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Privacidade
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Os teus dados são armazenados <strong>localmente no teu dispositivo</strong>. Nada é enviado para servidores externos.
              </p>
              <p>
                Tens controlo total sobre as tuas informações e podes apagá-las a qualquer momento.
              </p>
            </div>
          </Card>

          {/* Zona de Perigo */}
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Zona de Perigo
            </h2>
            
            {!showConfirm ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Apagar todos os dados irá remover permanentemente:
                </p>
                <ul className="text-sm text-gray-700 ml-4 space-y-1">
                  <li>• O teu perfil e preferências</li>
                  <li>• Histórico de interações</li>
                  <li>• Todas as configurações</li>
                </ul>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowConfirm(true)}
                >
                  Apagar Todos os Dados
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ Tens a certeza? Esta ação não pode ser desfeita!
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleReset}
                  >
                    Sim, Apagar Tudo
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Versão */}
          <div className="text-center text-sm text-gray-500">
            <p>3 Momentos v1.0.0</p>
            <p className="mt-1">Feito com ❤️ para te ajudar a viver melhor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
