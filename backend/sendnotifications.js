require("dotenv").config();
const { link } = require("fs");
const webPush = require("web-push");

// Use the keys from the environment variables
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

// Set VAPID details
webPush.setVapidDetails(
  "mailto:amine.ajdahim.7@gmail.com", // Replace with your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Example of sending a push notification
const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eJYIJu6pT-g:APA91bEw3eTCCtte83V0HKW-GEKOQosARzxqUhvzaDTLh05839ett-_Snjp4ZqTR_tV_kRZG3msViNzu6t_-lnTk6d_c7HskamQdMxgLOGqEuBV9czjqPF2vyWNJ1IuQoUH6xSUMqLJ-",
  expirationTime: null,
  keys: {
    p256dh:
      "BBN0fZfdB-FCjsHhcZL1OyD2IrY7uux9ocqK5vDTyRSD5CYjepi7J3mSHztHgMJYUFCaY0p22sOoOjxvSo5HlsE",
    auth: "pJIPrgP36jG-xAaGRu5nnA",
  },
};

const payload = JSON.stringify({
  title: "You have a new match!",
  body: "See who liked you on Tinder. Tap here to find out more.",
  icon: "https://pbs.twimg.com/profile_images/1407789460335382531/hWIzi8ny_400x400.jpg", // Example image URL for Tinder-like notification
  data: {
    url: "https://www.tinder.com", // Redirect to Tinder or similar page
  },
});

// Send notification
webPush
  .sendNotification(pushSubscription, payload)
  .then((response) => console.log("Notification sent!", response))
  .catch((err) => console.error("Error sending notification", err));
