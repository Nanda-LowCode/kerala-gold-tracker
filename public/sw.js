self.addEventListener("push", function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: "/icon.svg", // Fallback to our existing icon or standard app icon
        badge: "/icon.svg", // Minimal monochromatic icon for notification bar
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: "gold-rate-update", // Replaces previous notifications instead of stacking
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
  
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url.includes(event.notification.data.url) && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
