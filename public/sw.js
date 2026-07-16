self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'Casita Hub', body: 'Nueva actualización en la casa' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      data = { title: 'Casita Hub', body: event.data.text() };
    }
  }
  
  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Buscar si alguna pestaña ya tiene la app abierta y enfocarla
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Si no, abrir una nueva pestaña
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
