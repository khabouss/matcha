require('dotenv').config();
const { link } = require('fs');
const webPush = require('web-push');

// Use the keys from the environment variables
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
};

// Set VAPID details
webPush.setVapidDetails(
    'mailto:amine.ajdahim.7@gmail.com', // Replace with your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Example of sending a push notification
const pushSubscription = {
    endpoint:
        'https://fcm.googleapis.com/fcm/send/cTucwQbdTW0:APA91bF4qHTvB8uGLQUuYTyGED38PORuj-UPEvZB9fRcOJksEelUnZ699LGTuKpO77PCfh09EmQQrXbjOPcPhvFwQIlJE1KiFxaKOq3IoPZsW1lYiG6D3X0TG5IDrtiw3-XyJ1Ee9WN9',
    expirationTime: null,
    keys: {
        p256dh: 'BHhAiPxpzckaaKfKSphoOMnUYRTlE7ZpzLqejZ-o5YkUti88tay3xosi4ARtfhsCdvvguaXClzLL5O-w7lvZ4Yk',
        auth: 'cAiK_Jh-ckQAkRE3lScOug',
    },
};

const payload = JSON.stringify({
    title: 'tetete',
    body: 'sssss',
    link: 'https://www.youtube.com/',
    icon: 'https://live.staticflickr.com/65535/17123251389_80282733ce_z.jpg',
    data: {
        url: 'https://www.google.com/',
    },
});

// Send notification
webPush
    .sendNotification(pushSubscription, payload)
    .then((response) => console.log('Notification sent!', response))
    .catch((err) => console.error('Error sending notification', err));
