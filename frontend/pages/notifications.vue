<template>
    <NuxtLayout>
        <div class="notifications-page">
            <h1>Notifications</h1>
            <div v-if="notifications.length" class="notification-list">
                <div v-for="notification in notifications" :key="notification.id" class="notification-item">
                    <span style="width: 100%; cursor: pointer;" @click="notifiactionClick(notification.id)">{{ notification.message }}</span>
                    <button @click="remove(notification.id)">Dismiss</button>
                </div>
            </div>
            <div v-else>
                <p>No notifications to show.</p>
            </div>
            <button v-if="notifications.length" @click="clearAll" class="clear-button">
                Clear All Notifications
            </button>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { useNotificationStore } from '@/store/notifications';

const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);

const remove = (id) => {
    notificationStore.removeNotification(id);
};

const notifiactionClick = (id) => {
    window.location.href = notificationStore.getLink(id);
    remove(id);
};

const clearAll = () => {
    notificationStore.notifications = [];
};
</script>

<style scoped>
.notifications-page {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.notification-list {
    margin-bottom: 20px;
}

.notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 15px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.notification-item button {
    background: none;
    border: none;
    color: #f00;
    cursor: pointer;
    font-size: 1rem;
}

.notification-item button:hover {
    text-decoration: underline;
}

.clear-button {
    display: block;
    margin: 20px auto;
    padding: 10px 15px;
    background-color: #f00;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.clear-button:hover {
    background-color: #d00;
}
</style>