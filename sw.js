self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const taskId = event.notification.data.taskId;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.postMessage({
              type: "OPEN_TASK",
              taskId,
            });

            return client.focus();
          }
        }

        return clients.openWindow("/");
      }),
  );
});
