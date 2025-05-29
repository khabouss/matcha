import { defineStore } from 'pinia'

interface Notification {
  message: string
  type: 'success' | 'error'
  id: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    nextId: 1
  }),

  actions: {
    show(message: string, type: 'success' | 'error' = 'success') {
      const id = this.nextId++
      const notification: Notification = { message, type, id }
      this.notifications.push(notification)

      // Auto remove after 3 seconds
      setTimeout(() => {
        this.remove(id)
      }, 3000)
    },

    remove(id: number) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    success(message: string) {
      this.show(message, 'success')
    },

    error(message: string) {
      this.show(message, 'error')
    }
  }
}) 