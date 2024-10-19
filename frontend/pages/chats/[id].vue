<!-- pages/chats/[id].vue -->
<template>
  <NuxtLayout>
    <div class="chat-page">
      <header class="chat-header">
        <img :src="chat.profileImage" alt="Profile Picture" class="avatar" />
        <h2 class="chat-name">{{ chat.name }}</h2>
      </header>

      <div class="messages">
        <div v-for="message in chat.messages" :key="message.id"
          :class="message.isSentByMe ? 'message-sent' : 'message-received'" class="message">
          <p>{{ message.text }}</p>
        </div>
      </div>

      <div class="input-box">
        <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
        <button @click="sendMessage">
          <svg viewBox="0 0 24 24" width="26px" height="26px" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M12.0004 18.5816V12.5M12.7976 18.754L15.8103 19.7625C17.4511 20.3118 18.2714 20.5864 18.7773 20.3893C19.2166 20.2182 19.5499 19.8505 19.6771 19.3965C19.8236 18.8737 19.4699 18.0843 18.7624 16.5053L14.2198 6.36709C13.5279 4.82299 13.182 4.05094 12.7001 3.81172C12.2814 3.60388 11.7898 3.60309 11.3705 3.80958C10.8878 4.04726 10.5394 4.8182 9.84259 6.36006L5.25633 16.5082C4.54325 18.086 4.18671 18.875 4.33169 19.3983C4.4576 19.8528 4.78992 20.2216 5.22888 20.394C5.73435 20.5926 6.55603 20.3198 8.19939 19.7744L11.2797 18.752C11.5614 18.6585 11.7023 18.6117 11.8464 18.5933C11.9742 18.5769 12.1036 18.5771 12.2314 18.5938C12.3754 18.6126 12.5162 18.6597 12.7976 18.754Z"
                stroke="#ecc609" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const chatId = route.params.id

const chat = reactive({
  id: chatId,
  name: 'Alice', // Replace with dynamic fetching logic
  profileImage: 'https://picsum.photos/400/600?random=1',
  messages: [
    { id: 1, text: 'Hi!', isSentByMe: false },
    { id: 2, text: 'Hello!', isSentByMe: true },
    // Add more mock messages
  ],
})

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    chat.messages.push({ id: Date.now(), text: newMessage.value, isSentByMe: true })
    newMessage.value = ''
  }
}
</script>

<style scoped>
.chat-page {
  padding: 20px;
  background-color: #f0f0f0;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

.chat-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.chat-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.messages {
  flex-grow: 1;
  margin-bottom: 20px;
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
}

.message-sent {
  background-color: #d4f4ff;
  align-self: flex-end;
}

.message-received {
  background-color: #f9f9f9;
  align-self: flex-start;
}

.input-box {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

input[type='text'] {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
}

button {
  color: white;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  margin-left: 10px;
  cursor: pointer;
}
</style>