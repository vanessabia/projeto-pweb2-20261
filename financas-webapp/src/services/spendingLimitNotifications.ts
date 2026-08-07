interface SpendingLimitNotificationData {
  title: string;
  body: string;
}

export function notificationsAreSupported(): boolean {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsAreSupported()) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    return false;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export async function showSpendingLimitNotification(
  data: SpendingLimitNotificationData
): Promise<boolean> {
  if (!notificationsAreSupported()) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;

  const serviceWorker =
    registration.active ??
    registration.waiting ??
    registration.installing;

  if (!serviceWorker) {
    return false;
  }

  serviceWorker.postMessage({
    type: "SHOW_SPENDING_LIMIT_NOTIFICATION",
    title: data.title,
    body: data.body,
  });

  return true;
}