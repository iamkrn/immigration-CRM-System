import { useEffect } from "react";
import { messaging, getToken, onMessage } from "../config/firebase";
import API from "../services/API";

// VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const UseFCM = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Only initialize if user is logged in
    if (!user?._id) return;

    const initFCM = async () => {
      try {
        // Step 1: Request permission
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.warn("FCM: Notification permission denied");
          return;
        }

        // Step 2: Get FCM token (requires service worker to be registered)
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          ),
        });

        if (!token) {
          console.warn("FCM: No registration token available");
          return;
        }

        // Step 3: Save token to backend
        // We check localStorage to avoid saving same token repeatedly
        const savedToken = localStorage.getItem("fcmToken");
        if (savedToken !== token) {
          await API.post("/notifications/save-token", { fcmToken: token });
          localStorage.setItem("fcmToken", token);
          console.log("FCM: Token saved to backend");
        }

        // Step 4: Listen for FOREGROUND messages (app is open)
        // Background messages are handled by the service worker
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("FCM foreground message:", payload);
          // We dispatch a custom event that our useNotifications hook listens to
          // This avoids showing a browser notification when app is open (UX choice)
          window.dispatchEvent(
            new CustomEvent("fcm_foreground_notification", { detail: payload })
          );
        });

        // Cleanup on unmount
        return unsubscribe;

      } catch (error) {
        console.error("FCM initialization error:", error);
      }
    };

    initFCM();
  }, []); // Run once on app load
};

export default UseFCM;