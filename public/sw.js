self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: "/icon.svg",
        badge: "/icon.svg",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: "gold-rate-update",
        data: {
          url: data.url || "/",
        },
      };

      event.waitUntil(self.registration.showNotification(data.title, options));
    } catch (e) {
      console.error("Failed to parse push data", e);
    }
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes(event.notification.data.url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
