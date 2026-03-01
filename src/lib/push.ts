// Utility for subscribing to push notifications

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

import API_BASE_URL from './api';

export async function subscribeToPush(hotelId: string) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported in this browser.');
        return false;
    }

    try {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted.');
            return false;
        }

        // Register service worker if not already registered
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // Fetch VAPID public key from backend
        const VAPID_URL = `${API_BASE_URL}/push/vapidPublicKey`;
        const vapidResponse = await fetch(VAPID_URL);

        if (!vapidResponse.ok) {
            console.error('Failed to get VAPID public key');
            return false;
        }

        const { publicKey } = await vapidResponse.json();
        const applicationServerKey = urlBase64ToUint8Array(publicKey);

        // Get push subscription
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey
            });
        }

        // Send subscription & hotelId to backend
        const SUBSCRIBE_URL = `${API_BASE_URL}/push/subscribe`;
        const response = await fetch(SUBSCRIBE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hotelId,
                subscription
            })
        });

        if (!response.ok) {
            console.error('Failed to save subscription on backend', await response.text());
            return false;
        }

        console.log('Successfully subscribed to pushes for hotel', hotelId);
        return true;
    } catch (error) {
        console.error('Error subscribing to push:', error);
        return false;
    }
}

export async function unsubscribeFromPush(hotelId: string) {
    if (!('serviceWorker' in navigator)) return false;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            const UNSUBSCRIBE_URL = `${API_BASE_URL}/push/unsubscribe`;
            await fetch(UNSUBSCRIBE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hotelId,
                    endpoint: subscription.endpoint
                })
            });
            // We do NOT unsubscribe from pushManager.unsubscribe() completely 
            // since the user might be subscribed to other hotels. 
            // We just remove the hotel reference from the backend.
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return false;
    }
}
