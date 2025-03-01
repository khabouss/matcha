import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),
  actions: {
    addNotification(message) {
      this.notifications.push({
        id: Date.now(),
        message,
      });
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id);
    },
    getLink(id) {
      return this.notifications.find((n) => n.id === id).url;
    },
  },
});
