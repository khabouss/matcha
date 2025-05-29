<!-- pages/chats/[id].vue -->
<template>
  <NuxtLayout>
    <div class="chat-container">
      <!-- Chat Header -->
      <header class="chat-header">
        <div class="header-left">
          <button class="back-button" @click="router.back()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="user-info">
            <div class="avatar-wrapper">
              <img :src="chat.profileImage" :alt="chat.name" class="avatar" />
              <span class="status-indicator" :class="{ online: chat.isOnline }"></span>
            </div>
            <div class="user-details">
              <h1>{{ chat.name }}</h1>
              <p class="status-text">{{ chat.isOnline ? 'Online' : 'Last seen recently' }}</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-button" @click="toggleUserInfo">
            <i class="fas fa-info-circle"></i>
          </button>
          <button class="action-button" @click="toggleOptions">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </header>

      <!-- Messages Container -->
      <div class="messages-container" ref="messagesContainer">
        <!-- Date Separator -->
        <div class="date-separator">
          <span>Today</span>
        </div>

        <!-- Messages -->
        <div class="messages">
          <div v-for="message in chat.messages" 
               :key="message.id"
               class="message-wrapper"
               :class="{ 'message-sent': message.isSentByMe }">
            <div class="message" :class="{ 'message-sent': message.isSentByMe }">
              <div class="message-content">
                <p>{{ message.text }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-status" v-if="message.isSentByMe">
                <i class="fas" :class="message.read ? 'fa-check-double' : 'fa-check'"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="chat.isTyping" class="typing-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>typing...</p>
        </div>
      </div>

      <!-- Message Input -->
      <div class="message-input">
        <button class="input-action-button">
          <i class="fas fa-plus"></i>
        </button>
        <div class="input-wrapper">
          <input 
            type="text" 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            @focus="handleInputFocus"
          />
          <button class="emoji-button">
            <i class="far fa-smile"></i>
          </button>
        </div>
        <button 
          class="send-button" 
          :class="{ 'active': newMessage.trim() }"
          @click="sendMessage"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>

      <!-- User Info Sidebar -->
      <div class="user-info-sidebar" :class="{ 'active': showUserInfo }">
        <div class="sidebar-header">
          <h2>User Information</h2>
          <button class="close-button" @click="toggleUserInfo">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="sidebar-content">
          <div class="user-profile">
            <img :src="chat.profileImage" :alt="chat.name" class="profile-image" />
            <h3>{{ chat.name }}</h3>
            <p class="user-status">{{ chat.isOnline ? 'Online' : 'Offline' }}</p>
          </div>
          <div class="user-details-section">
            <h4>About</h4>
            <p>{{ chat.bio || 'No bio available' }}</p>
          </div>
          <div class="user-actions">
            <button class="action-button danger">
              <i class="fas fa-ban"></i>
              Block User
            </button>
            <button class="action-button danger">
              <i class="fas fa-flag"></i>
              Report User
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const chatId = route.params.id
const messagesContainer = ref(null)
const showUserInfo = ref(false)
const newMessage = ref('')

const chat = reactive({
  id: chatId,
  name: 'Alice',
  profileImage: 'https://picsum.photos/400/600?random=1',
  isOnline: true,
  isTyping: false,
  bio: 'Love traveling and photography. Always up for new adventures!',
  messages: [
    { 
      id: 1, 
      text: 'Hi! How are you doing today?', 
      isSentByMe: false,
      time: '10:30 AM',
      read: true
    },
    { 
      id: 2, 
      text: 'Hey! I\'m doing great, thanks for asking. How about you?', 
      isSentByMe: true,
      time: '10:31 AM',
      read: true
    },
    { 
      id: 3, 
      text: 'I\'m good too! Just finished a great book. Have you read anything interesting lately?', 
      isSentByMe: false,
      time: '10:32 AM',
      read: true
    },
  ],
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    chat.messages.push({
      id: Date.now(),
      text: newMessage.value,
      isSentByMe: true,
      time,
      read: false
    })
    
    newMessage.value = ''
    scrollToBottom()
    
    // Simulate typing indicator
    chat.isTyping = true
    setTimeout(() => {
      chat.isTyping = false
      // Simulate reply
      setTimeout(() => {
        chat.messages.push({
          id: Date.now() + 1,
          text: 'Thanks for your message! I\'ll get back to you soon.',
          isSentByMe: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true
        })
        scrollToBottom()
      }, 1000)
    }, 2000)
  }
}

const handleInputFocus = () => {
  scrollToBottom()
}

const toggleUserInfo = () => {
  showUserInfo.value = !showUserInfo.value
}

const toggleOptions = () => {
  // Implement options menu
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  height: 100vh;
  background: #f8fafc;
  position: relative;
}

/* Chat Header */
.chat-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  display: none;
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
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
  background: #94a3b8;
}

.status-indicator.online {
  background: #22c55e;
}

.user-details h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.status-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: #f1f5f9;
  color: #1e293b;
}

/* Messages Container */
.messages-container {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 140px 24px;
  overflow-y: auto;
  background: #f8fafc;
  height: calc(100vh - 73px);
}

.date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}

.date-separator span {
  background: #e2e8f0;
  color: #64748b;
  font-size: 0.875rem;
  padding: 4px 12px;
  border-radius: 12px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-wrapper.message-sent {
  align-self: flex-end;
}

.message {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-sent .message-content {
  background: #3b82f6;
  color: white;
}

.message-content p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.message-time {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 4px;
  display: block;
}

.message-sent .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-status {
  color: #94a3b8;
  font-size: 0.875rem;
}

.message-sent .message-status {
  color: #3b82f6;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
  margin-top: 8px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.typing-indicator p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

/* Message Input */
.message-input {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 0 12px;
  transition: all 0.2s ease;
  min-height: 44px;
}

.input-wrapper:focus-within {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input[type="text"] {
  flex: 1;
  background: none;
  border: none;
  padding: 8px 0;
  font-size: 0.95rem;
  color: #1e293b;
  min-height: 24px;
}

input[type="text"]::placeholder {
  color: #94a3b8;
}

input[type="text"]:focus {
  outline: none;
}

.input-action-button,
.emoji-button {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.input-action-button:hover,
.emoji-button:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.send-button {
  background: #f1f5f9;
  border: none;
  color: #94a3b8;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button.active {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.send-button.active:hover {
  background: #2563eb;
  transform: scale(1.1);
}

/* User Info Sidebar */
.user-info-sidebar {
  grid-column: 2;
  background: white;
  border-left: 1px solid #e2e8f0;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.user-info-sidebar.active {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.sidebar-content {
  padding: 24px;
}

.user-profile {
  text-align: center;
  margin-bottom: 32px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 3px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-profile h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px;
}

.user-status {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.user-details-section {
  margin-bottom: 32px;
}

.user-details-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
}

.user-details-section p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button.danger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.danger:hover {
  background: #fecaca;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .chat-container {
    grid-template-columns: 1fr;
  }

  .user-info-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 320px;
    z-index: 20;
  }

  .back-button {
    display: block;
  }

  .message-input {
    width: calc(100% - 320px);
  }
}

@media (max-width: 640px) {
  .chat-header {
    padding: 12px 16px;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .user-details h1 {
    font-size: 1.125rem;
  }

  .messages-container {
    padding: 16px 16px 130px 16px;
    height: calc(100vh - 65px);
  }

  .message-wrapper {
    max-width: 85%;
  }

  .message-input {
    width: 100%;
    padding: 8px 12px;
    gap: 6px;
    bottom: 56px;
  }

  .input-wrapper {
    min-height: 40px;
    padding: 0 10px;
  }

  input[type="text"] {
    font-size: 0.9rem;
    padding: 6px 0;
  }

  .input-action-button,
  .emoji-button,
  .send-button {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .user-info-sidebar {
    width: 100%;
  }
}
</style>