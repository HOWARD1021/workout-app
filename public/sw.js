// Service Worker for Workout App — background timer notifications

let timerTimeout = null;

self.addEventListener("message", (event) => {
  const { type, endTime } = event.data || {};

  if (type === "START_TIMER") {
    // Clear any existing timer
    if (timerTimeout) clearTimeout(timerTimeout);

    const delay = endTime - Date.now();
    if (delay <= 0) return;

    timerTimeout = setTimeout(() => {
      timerTimeout = null;
      self.registration.showNotification("休息結束！💪", {
        body: "回來繼續訓練！",
        icon: "/images/duck-mascot.png",
        badge: "/images/duck-mascot.png",
        tag: "rest-timer",
        renotify: true,
        vibrate: [200, 100, 200, 100, 300],
        silent: false,
        requireInteraction: true,
      });
    }, delay);
  }

  if (type === "STOP_TIMER") {
    if (timerTimeout) {
      clearTimeout(timerTimeout);
      timerTimeout = null;
    }
  }
});

// Click notification → focus or open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow("/");
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
