self.addEventListener('push', function (event) {
    let data = { title: 'New notification!', body: 'Check out the update.', url: '/' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/favicon.ico', // Update icon if needed
        badge: '/favicon.ico', // Update badge if needed
        data: {
            url: data.url || '/'
        },
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options).then(() => {
            return clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
                for (let i = 0; i < clientList.length; i++) {
                    clientList[i].postMessage({ type: 'PUSH_RECEIVED' });
                }
            });
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    client.postMessage({ type: 'RELOAD_APP' });
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
