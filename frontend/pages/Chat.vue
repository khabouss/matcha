<!-- pages/chats/index.vue -->
<template>
  <NuxtLayout>
    <div class="modern-chat">
      <!-- Sidebar -->
      <aside class="chat-sidebar">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="header-content">
            <h1>Messages</h1>
            <div class="active-users">
              <span class="active-dot"></span>
              <span class="active-text">{{ activeChats.length }} Active</span>
            </div>
          </div>
          <div class="search-container">
            <div class="search-bar">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search conversations..."
                @input="handleSearch"
              />
              <button 
                v-if="searchQuery" 
                class="clear-search" 
                @click="clearSearch"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat List -->
        <div class="chat-list">
          <!-- Active Chats -->
          <div v-if="activeChats.length > 0" class="chat-section">
            <div class="section-header">
              <h2>Active Now</h2>
              <div class="section-indicator"></div>
            </div>
            <div class="chat-items">
              <div 
                v-for="chat in activeChats" 
                :key="chat.id"
                class="chat-item"
                :class="{ 'has-unread': chat.unread }"
                @click="goToChat(chat.id)"
              >
                <div class="chat-avatar">
                  <img :src="chat.profileImage" :alt="chat.name" />
                  <span class="status-indicator online"></span>
                </div>
                <div class="chat-content">
                  <div class="chat-header">
                    <h3>{{ chat.name }}</h3>
                    <span class="chat-time">{{ chat.time }}</span>
                  </div>
                  <div class="chat-message">
                    <p :class="{ 'typing': chat.typing }">
                      {{ chat.typing ? 'typing...' : chat.lastMessage }}
                    </p>
                    <div v-if="chat.unread" class="unread-indicator">
                      <span>{{ chat.unread }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Messages -->
          <div class="chat-section">
            <div class="section-header">
              <h2>All Messages</h2>
              <div class="section-indicator"></div>
            </div>
            <div class="chat-items">
              <div 
                v-for="chat in inactiveChats" 
                :key="chat.id"
                class="chat-item"
                :class="{ 'has-unread': chat.unread }"
                @click="goToChat(chat.id)"
              >
                <div class="chat-avatar">
                  <img :src="chat.profileImage" :alt="chat.name" />
                  <span class="status-indicator offline"></span>
                </div>
                <div class="chat-content">
                  <div class="chat-header">
                    <h3>{{ chat.name }}</h3>
                    <span class="chat-time">{{ chat.time }}</span>
                  </div>
                  <div class="chat-message">
                    <p>{{ chat.lastMessage }}</p>
                    <div v-if="chat.unread" class="unread-indicator">
                      <span>{{ chat.unread }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Welcome Screen -->
      <div class="welcome-screen">
        <div class="welcome-content">
          <div class="welcome-icon">
            <i class="fas fa-comments"></i>
          </div>
          <h2>Welcome to Messages</h2>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const chats = ref([
  { 
    id: '1', 
    name: 'Alice', 
    lastMessage: 'How are you?', 
    profileImage: 'https://picsum.photos/400/600?random=1', 
    isOnline: true, 
    time: '2m ago',
    unread: 2,
    typing: true
  },
  { 
    id: '2', 
    name: 'Bob', 
    lastMessage: 'See you later!', 
    profileImage: 'https://picsum.photos/400/600?random=2', 
    isOnline: true, 
    time: '1h ago',
    unread: 0,
    typing: false
  },
  { 
    id: '3', 
    name: 'Charlie', 
    lastMessage: 'Thanks for the help!', 
    profileImage: 'https://picsum.photos/400/600?random=3', 
    isOnline: false, 
    time: '2h ago',
    unread: 1,
    typing: false
  },
  { 
    id: '4', 
    name: 'Diana', 
    lastMessage: 'Let\'s meet tomorrow', 
    profileImage: 'https://picsum.photos/400/600?random=4', 
    isOnline: false, 
    time: '3h ago',
    unread: 0,
    typing: false
  },
  { 
    id: '5', 
    name: 'Eve', 
    lastMessage: 'Did you see the new movie?', 
    profileImage: 'https://picsum.photos/400/600?random=5', 
    isOnline: false, 
    time: '5h ago',
    unread: 0,
    typing: false
  }
])

const activeChats = computed(() => {
  return chats.value.filter(chat => 
    chat.isOnline && 
    (!searchQuery.value || chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

const inactiveChats = computed(() => {
  return chats.value.filter(chat => 
    !chat.isOnline && 
    (!searchQuery.value || chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

const handleSearch = () => {
  // Additional search logic can be added here
}

const clearSearch = () => {
  searchQuery.value = ''
}

const goToChat = (chatId: string) => {
  router.push(`/chats/${chatId}`)
}
</script>

<style scoped>
.modern-chat {
  display: grid;
  grid-template-columns: 380px 1fr;
  height: 100vh;
  background: #f8fafc;
}

/* Sidebar Styles */
.chat-sidebar {
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.active-users {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 20px;
}

.active-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

.active-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.search-container {
  position: relative;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar input {
  width: 100%;
  padding: 12px 40px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-bar i {
  position: absolute;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.search-bar .fa-search {
  left: 14px;
}

.clear-search {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-search:hover {
  color: #64748b;
}

/* Chat List Styles */
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 0 8px;
}

.section-header h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.section-indicator {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.chat-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-item:hover {
  background: #f8fafc;
}

.chat-item.has-unread {
  background: #f1f5f9;
}

.chat-avatar {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #22c55e;
}

.status-indicator.offline {
  background: #94a3b8;
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chat-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.chat-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.chat-message p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-message p.typing {
  color: #3b82f6;
  font-style: italic;
}

.unread-indicator {
  flex-shrink: 0;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #3b82f6;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Welcome Screen */
.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 24px;
}

.welcome-content {
  text-align: center;
  max-width: 400px;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  background: #e0f2fe;
  color: #0ea5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.welcome-icon i {
  font-size: 2rem;
}

.welcome-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
}

.welcome-content p {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .modern-chat {
    grid-template-columns: 320px 1fr;
  }
}

@media (max-width: 768px) {
  .modern-chat {
    grid-template-columns: 1fr;
  }

  .welcome-screen {
    display: none;
  }

  .chat-sidebar {
    border-right: none;
  }

  .sidebar-header {
    padding: 16px;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .chat-list {
    padding: 12px;
  }
}
</style>