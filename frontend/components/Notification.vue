<template>
  <div v-if="notifications.length" class="notification-container">
    <div v-for="notification in notifications" :key="notification.id" class="notification">
      <span @click="notificationClick(notification.id)">{{ notification.message }}</span>
      <button @click="remove(notification.id)">X</button>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/store/notifications';

const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.notifications);

// Remove notification by ID
const remove = (id) => {
  notificationStore.removeNotification(id);
};

const notificationClick = (id) => {
  window.location.href = notificationStore.getLink(id);
  remove(id);
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: fit-content;
}

.notification {
  background-color: white;
  color: #333;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 15px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.notification button {
  background: none;
  border: none;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
}

.notification button:hover {
  color: #f00;
}
</style>