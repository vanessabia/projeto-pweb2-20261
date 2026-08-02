self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "SHOW_SPENDING_LIMIT_NOTIFICATION") {
    return;
  }

  const title =
    event.data.title ?? "Alerta de limite de gastos";

  const options = {
    body:
      event.data.body ??
      "Uma categoria está próxima do limite mensal.",
    icon: "/vite.svg",
    badge: "/vite.svg",
    tag: "spending-limit-alert",
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});