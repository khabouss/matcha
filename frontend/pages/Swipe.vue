<template>
  <div class="swipe-page">
    <div class="swipe-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading profiles...</p>
      </div>

      <!-- No Profiles State -->
      <div v-else-if="profiles.length === 0" class="no-profiles">
        <h2>No More Profiles</h2>
        <p>Check back later for new matches!</p>
        <button @click="refreshProfiles" class="refresh-btn">
          <i class="fas fa-sync"></i> Refresh
        </button>
      </div>

      <!-- Swipe Cards -->
      <div v-else class="swipe-stack">
        <SwipeCard
          v-for="(profile, index) in visibleProfiles"
          :key="profile.id"
          :profile="profile"
          :style="getCardStyle(index)"
          @swipe="handleSwipe"
          @match="handleMatch"
        />
      </div>

      <!-- Filter Button -->
      <button class="filter-btn" @click="showFilterPopup = true">
        <i class="fas fa-sliders-h"></i>
      </button>

      <!-- Filter Popup -->
      <FilterPopup
        v-if="showFilterPopup"
        @close="showFilterPopup = false"
        @apply-filters="applyFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNotificationStore } from '@/store/notifications';

const loading = ref(true);
const profiles = ref([]);
const currentIndex = ref(0);
const showFilterPopup = ref(false);
const notificationStore = useNotificationStore();

// Get visible profiles (current and next)
const visibleProfiles = computed(() => {
  return profiles.value.slice(currentIndex.value, currentIndex.value + 2);
});

// Fetch profiles
async function fetchProfiles() {
  try {
    loading.value = true;
    const response = await $fetch('http://localhost:3001/profile/swipe-list', {
      headers: {
        'Authorization': `Bearer ${useCookie('access_token').value}`
      }
    });

    if (response.status === 'success') {
      // Add UI properties to each profile
      profiles.value = response.data.swipeData.map((profile: any) => ({
        ...profile,
        offsetX: 0,
        rotate: 0,
        opacity: 1,
        isLiked: false,
        isDisliked: false
      }));
      
      // Reset current index when fetching new profiles
      if (currentIndex.value >= profiles.value.length) {
        currentIndex.value = 0;
      }
    }
  } catch (error) {
    console.error('Error fetching profiles:', error);
    notificationStore.addNotification({
      id: Date.now(),
      message: 'Error loading profiles. Please try again.',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
}

// Handle swipe actions
async function handleSwipe(action: 'like' | 'dislike' | 'continue', profile: any) {
  if (action === 'continue') return;
  
  // Update profile state
  const currentProfile = profiles.value[currentIndex.value];
  if (currentProfile) {
    currentProfile.isLiked = action === 'like';
    currentProfile.isDisliked = action === 'dislike';
  }
  
  // Move to next profile
  currentIndex.value++;
  
  // If we're running low on profiles, fetch more
  if (currentIndex.value >= profiles.value.length - 2) {
    await fetchProfiles();
  }
}

// Handle matches
function handleMatch(profile: any) {
  // Show match notification
  notificationStore.addNotification({
    id: Date.now(),
    message: `You matched with ${profile.first_name}!`,
    type: 'success',
    link: `/chat/${profile.id}`
  });
  
  // Update profile state
  const currentProfile = profiles.value[currentIndex.value];
  if (currentProfile) {
    currentProfile.isMatch = true;
  }
}

// Refresh profiles
async function refreshProfiles() {
  currentIndex.value = 0;
  await fetchProfiles();
}

// Apply filters
function applyFilters(filters: any) {
  // TODO: Implement filter logic
  console.log('Applying filters:', filters);
  refreshProfiles();
}

// Get card style for stack effect
function getCardStyle(index: number) {
  return {
    transform: `translateY(${index * -20}px) scale(${1 - index * 0.05})`,
    zIndex: 10 - index
  };
}

// Initial load
onMounted(() => {
  fetchProfiles();
});
</script>

<style scoped>
.swipe-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swipe-container {
  width: 100%;
  max-width: 400px;
  height: 80vh;
  position: relative;
}

.swipe-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.no-profiles {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
}

.no-profiles h2 {
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.no-profiles p {
  color: #666;
  margin: 0 0 20px 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #2563eb;
}

.filter-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
}

.filter-btn:hover {
  transform: scale(1.1);
  background: #f3f4f6;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 