/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAi5V6bswE873Wsz1iSH8XwNoIYi_mEpv0",
  authDomain: "college-review-crm.firebaseapp.com",
  projectId: "college-review-crm",
  storageBucket: "college-review-crm.firebasestorage.app",
  messagingSenderId: "685472359680",
  appId: "1:685472359680:web:cd70f0cf0d0cd0ebdc3fe5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    badge: "/badge.png",
    data: payload.data,
    requireInteraction: true,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.link || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      })
  );
});