<template>
  <TransitionGroup 
    name="notification" 
    tag="div" 
    class="notification-container"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="['notification', notification.type]"
      @click="remove(notification.id)"
    >
      {{ notification.message }}
      <button class="close-button" @click.stop="remove(notification.id)">&times;</button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'

const store = useNotificationStore()
const { notifications } = storeToRefs(store)
const { remove } = store
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification {
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  min-width: 300px;
  max-width: 400px;
}

.notification.success {
  background-color: #10b981;
}

.notification.error {
  background-color: #ef4444;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>