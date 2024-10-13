<!-- pages/chats/index.vue -->
<template>
    <div class="chat-list">
      <h2 class="title">Chats</h2>
      <ul>
        <li v-for="chat in chats" :key="chat.id" @click="goToChat(chat.id)" class="chat-item">
          <div class="avatar-container">
            <img :src="chat.profileImage" alt="Profile Picture" class="avatar"/>
            <span v-if="chat.isOnline" class="online-indicator"></span>
          </div>
          <div class="chat-info">
            <p class="chat-name">{{ chat.name }}</p>
            <p class="chat-message">{{ chat.lastMessage }}</p>
          </div>
          <div class="chat-time">{{ chat.time }}</div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const chats = ref([
    { id: '1', name: 'Alice', lastMessage: 'How are you?', profileImage: 'https://picsum.photos/400/600?random=1', isOnline: true, time: '2m ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=2', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=3', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=4', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=5', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=6', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=7', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=8', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=9', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=10', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=11', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=12', isOnline: false, time: '1h ago' },
    { id: '2', name: 'Bob', lastMessage: 'See you later!', profileImage: 'https://picsum.photos/400/600?random=13', isOnline: false, time: '1h ago' },
    // Add more mock chats here
  ])
  
  const goToChat = (chatId:string) => {
    router.push(`/chats/${chatId}`)
  }
  </script>
  
  <style scoped>
  .chat-list {
    padding: 20px;
    background-color: #f9f9f9;
    overflow-x: hidden;
    height: 100%;
  }
  
  .title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .chat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background-color: white;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
  }
  
  .chat-item:hover {
    transform: scale(1.03);
  }
  
  .avatar-container {
    position: relative;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  .online-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background-color: #4caf50;
    border-radius: 50%;
    border: 2px solid white;
  }
  
  .chat-info {
    flex-grow: 1;
    margin-left: 15px;
  }
  
  .chat-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }
  
  .chat-message {
    font-size: 0.9rem;
    color: #777;
  }
  
  .chat-time {
    font-size: 0.9rem;
    color: #aaa;
  }
  </style>
  