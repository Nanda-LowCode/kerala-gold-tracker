"use client";

import { useState, useEffect } from "react";

// The VAPID Public Key generated via web-push
// Note: We expect the user to have added this to their .env.local
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the browser supports service workers and push messages
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function registerServiceWorker() {
    return await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
  }

  async function checkSubscription() {
    try {
      const registration = await registerServiceWorker();
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error("Checking push subscription failed", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function subscribe() {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permission not granted for Notification");
      }

      if (!vapidPublicKey) {
        throw new Error("VAPID Public Key not found in environment variables");
      }

      const registration = await registerServiceWorker();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send the subscription to our backend
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      if (!res.ok) {
        throw new Error("Failed to save subscription on server");
      }

      setIsSubscribed(true);
    } catch (err) {
      console.error("Failed to subscribe user", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribe() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Remove from our backend first
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        // Unsubscribe from browser
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("Failed to unsubscribe user", err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
