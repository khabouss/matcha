<template>
  <div class="matches-page">
    <h1>Your Matches</h1>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading matches...</p>
    </div>

    <!-- No Matches State -->
    <div v-else-if="matches.length === 0" class="no-matches">
      <h2>No Matches Yet</h2>
      <p>Start swiping to find your matches!</p>
      <NuxtLink to="/swipe" class="swipe-btn">
        <i class="fas fa-heart"></i> Start Swiping
      </NuxtLink>
    </div>

    <!-- Matches Grid -->
    <div v-else class="matches-grid">
      <div v-for="match in matches" 
           :key="match.id" 
           class="match-card"
           @click="startChat(match)">
        <div class="match-image">
          <img :src="match.images[0]" :alt="match.first_name" />
        </div>
        <div class="match-info">
          <h3>{{ match.first_name }}, {{ calculateAge(match.birthdate) }}</h3>
          <p class="location">
            <i class="fas fa-map-marker-alt"></i>
            {{ match.neighborhood || 'Nearby' }}
          </p>
          <div class="match-actions">
            <button class="chat-btn" @click.stop="startChat(match)">
              <i class="fas fa-comment"></i> Chat
            </button>
            <button class="unmatch-btn" @click.stop="handleUnmatch(match)">
              <i class="fas fa-heart-broken"></i> Unmatch
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotificationStore } from '@/store/notifications';

const loading = ref(true);
const matches = ref([]);
const notificationStore = useNotificationStore();

// Fetch matches
async function fetchMatches() {
  try {
    loading.value = true;
    const response = await $fetch('http://localhost:3001/like/matches', {
      headers: {
        'Authorization': `Bearer ${useCookie('access_token').value}`
      }
    });

    if (response.status === 'success') {
      matches.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching matches:', error);
    notificationStore.addNotification({
      id: Date.now(),
      message: 'Error loading matches. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
}

function calculateAge(birthdate: string) {
  if (!birthdate) return '';
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
  return `${age} years`;
}

function startChat(match: any) {
  window.location.href = `/chat/${match.id}`;
}

async function handleUnmatch(match: any) {
  if (!confirm(`Are you sure you want to unmatch with ${match.first_name}?`)) {
    return;
  }

  try {
    // TODO: Implement unmatch endpoint
    const response = await $fetch(`http://localhost:3001/like/unmatch/${match.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useCookie('access_token').value}`
      }
    });

    if (response.status === 'success') {
      matches.value = matches.value.filter(m => m.id !== match.id);
      notificationStore.addNotification({
        id: Date.now(),
        message: `Unmatched with ${match.first_name}`,
        type: 'success'
      });
    }
  } catch (error) {
    console.error('Error unmatching:', error);
    notificationStore.addNotification({
      id: Date.now(),
      message: 'Error unmatching. Please try again.',
      type: 'error'
    });
  }
}

onMounted(() => {
  fetchMatches();
});
</script>

<style scoped>
.matches-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 32px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.no-matches {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-matches h2 {
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.no-matches p {
  color: #666;
  margin: 0 0 24px 0;
}

.swipe-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.swipe-btn:hover {
  background: #2563eb;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.match-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.match-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.match-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.match-info {
  padding: 20px;
}

.match-info h3 {
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  margin: 0 0 16px 0;
}

.location i {
  color: #3b82f6;
}

.match-actions {
  display: flex;
  gap: 12px;
}

.chat-btn, .unmatch-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-btn {
  background: #3b82f6;
  color: white;
}

.chat-btn:hover {
  background: #2563eb;
}

.unmatch-btn {
  background: #fee2e2;
  color: #ef4444;
}

.unmatch-btn:hover {
  background: #fecaca;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .matches-grid {
    grid-template-columns: 1fr;
  }
}
</style> 