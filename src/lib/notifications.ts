// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
        console.log('Falha ao registrar Service Worker:', error);
      });
  });
}

// Função para solicitar permissão de notificações
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Função para agendar notificação local (simulação)
export const scheduleLocalNotification = (title: string, body: string, time: string) => {
  if (Notification.permission !== 'granted') {
    console.log('Permissão de notificação não concedida');
    return;
  }

  // Calcular tempo até a notificação
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const scheduledTime = new Date(now);
  scheduledTime.setHours(hours, minutes, 0, 0);

  // Se o horário já passou hoje, agendar para amanhã
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    });
  }, timeUntilNotification);

  console.log(`Notificação agendada para ${scheduledTime.toLocaleString()}`);
};
