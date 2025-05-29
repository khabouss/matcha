<template>
  <NuxtLayout>
    <div class="swipe-container">
      <div class="swipe-header">
        <h1>Discover</h1>
        <div class="location-indicator" v-if="location.lat && location.lon">
          <i class="fas fa-map-marker-alt"></i>
          <span>Near you</span>
        </div>
      </div>

      <div class="cards-container">
        <div
          v-for="(profile, index) in profiles"
          :key="index"
          class="profile-card"
          :class="{ 'is-top': index === currentIndex.value }"
          :style="{
            zIndex: profiles.length - index,
            transform: `translateX(${profile.offsetX}px) rotate(${profile.rotate}deg)`,
            opacity: profile.opacity,
          }"
          @mousedown="startSwipe($event, profile, index)"
          @touchstart="startSwipe($event, profile, index)"
        >
          <profile-card :profile="profile" />
        </div>

        <div v-if="profiles.length === 0" class="no-profiles">
          <i class="fas fa-heart-broken"></i>
          <h2>No more profiles</h2>
          <p>Check back later for new matches</p>
        </div>
      </div>

      <div class="swipe-actions">
        <button class="action-btn dislike" @click="dislike">
          <i class="fas fa-times"></i>
        </button>
        <button class="action-btn superlike">
          <i class="fas fa-star"></i>
        </button>
        <button class="action-btn like" @click="like">
          <i class="fas fa-heart"></i>
        </button>
      </div>
    </div>

    <div>
      <nav class="nav-bar">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/swipe" class="nav-link">Swipe</NuxtLink>
        <NuxtLink to="/profile" class="nav-link">Profile</NuxtLink>
        <NuxtLink to="/matches" class="nav-link">Matches</NuxtLink>
      </nav>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useNotificationStore } from '~/stores/notification';

const profiles = ref([]);
const currentIndex = ref(0);
const location = reactive({
  lat: null,
  lon: null
});
const notification = useNotificationStore();

const swipeData = reactive({
  startX: 0,
  currentX: 0,
  dragging: false,
});

// Function to get user location
const getUserLocation = async () => {
  try {
    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "granted" || permission.state === "prompt") {
      console.log("Requesting location...");
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location obtained successfully");
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.log("Geolocation error:", error.message);
            // Return default coordinates (or null) when location access fails
            resolve({
              lat: null,
              lon: null,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      });
    } else {
      console.log("Location permission denied");
      return { lat: null, lon: null };
    }
  } catch (error) {
    console.log("Permission check error:", error);
    return { lat: null, lon: null };
  }
};

// Fetch profiles and send location
const fetchProfiles = async () => {
  const location = await getUserLocation();
  console.log("Location for profile fetch:", location);

  try {
    // If location is not available, fetch profiles without location parameters
    const params = location.lat && location.lon 
      ? { latitude: location.lat, longitude: location.lon }
      : {};

    const { data, error } = await useCFetch(
      "http://localhost:3001/profile/swipe-list",
      {
        method: "GET",
        params: params
      }
    );

    if (error.value) {
      console.error("Error fetching profiles:", error.value);
      return;
    }

    if (data.value?.status === "success") {
      const swipeData = data.value?.data?.swipeData || [];
      console.log("Profiles fetched successfully:", swipeData.length);
      
      // Initialize each profile with the required UI properties
      profiles.value = swipeData.map(profile => ({
        ...profile,
        offsetX: 0,
        rotate: 0,
        opacity: 1
      }));
    } else {
      console.error("Failed to fetch profiles:", data.value);
    }
  } catch (err) {
    console.error("Error in fetchProfiles:", err);
  }
};

// Fetch profiles on load
fetchProfiles();

const startSwipe = (event, profile, index) => {
  if (index !== currentIndex.value) return;
  
  swipeData.startX =
    event.type === "mousedown" ? event.clientX : event.touches[0].clientX;
  swipeData.dragging = true;

  const moveHandler = (moveEvent) => {
    if (!swipeData.dragging) return;
    
    swipeData.currentX =
      moveEvent.type === "mousemove"
        ? moveEvent.clientX
        : moveEvent.touches[0].clientX;
    const deltaX = swipeData.currentX - swipeData.startX;
    
    // Limit the drag distance
    const maxDrag = window.innerWidth * 0.8;
    const limitedDelta = Math.max(Math.min(deltaX, maxDrag), -maxDrag);
    
    profiles.value[index].offsetX = limitedDelta;
    profiles.value[index].rotate = limitedDelta / 15;
    profiles.value[index].opacity = Math.max(0.5, 1 - Math.abs(limitedDelta) / maxDrag);
  };

  const endSwipe = () => {
    if (!swipeData.dragging) return;
    
    swipeData.dragging = false;
    const deltaX = swipeData.currentX - swipeData.startX;
    
    if (Math.abs(deltaX) > window.innerWidth * 0.3) {
      deltaX > 0 ? like() : dislike();
    } else {
      resetCard(index);
    }
    
    window.removeEventListener("mousemove", moveHandler);
    window.removeEventListener("mouseup", endSwipe);
    window.removeEventListener("touchmove", moveHandler);
    window.removeEventListener("touchend", endSwipe);
  };

  window.addEventListener("mousemove", moveHandler);
  window.addEventListener("mouseup", endSwipe);
  window.addEventListener("touchmove", moveHandler);
  window.addEventListener("touchend", endSwipe);
};

const like = async () => {
  const currentProfile = profiles.value[currentIndex.value];
  if (!currentProfile) return;

  try {
    // Send like request to backend
    const response = await $fetch(`http://localhost:3001/like/like/${currentProfile.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useCookie('access_token').value}`
      }
    });

    if (response.status === 'success') {
      // If it's a match, show match notification
      if (response.data.isMatch) {
        notification.success(`It's a match! You and ${currentProfile.first_name} have liked each other!`);
      } else {
        // Show regular like notification
        notification.success(`You liked ${currentProfile.first_name}'s profile`);
      }

      // Animate the swipe
      animateSwipe('like');
    }
  } catch (error) {
    // Show error notification
    notification.error(error.message || 'Error liking profile. Please try again.');
    
    console.error('Error liking profile:', error);
    
    // Reset card position on error
    resetCard(currentIndex.value);
  }
};

const dislike = () => {
  animateSwipe('dislike');
};

const animateSwipe = (direction) => {
  const index = currentIndex.value;
  const profile = profiles.value[index];
  if (!profile) return;

  const distance = window.innerWidth;
  
  profile.offsetX = direction === 'like' ? distance : -distance;
  profile.rotate = direction === 'like' ? 30 : -30;
  profile.opacity = 0;
  
  setTimeout(() => {
    profiles.value.splice(index, 1);
    currentIndex.value = Math.min(currentIndex.value, profiles.value.length - 1);
    
    // If we're running low on profiles, fetch more
    if (currentIndex.value >= profiles.value.length - 2) {
      fetchProfiles();
    }
  }, 300);
};

const resetCard = (index) => {
  profiles.value[index].offsetX = 0;
  profiles.value[index].rotate = 0;
  profiles.value[index].opacity = 1;
};
</script>

<style scoped>
.swipe-container {
  position: relative;
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%);
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.swipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.swipe-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.location-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.location-indicator i {
  color: #3b82f6;
}

.location-indicator span {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.cards-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.profile-card {
  position: absolute;
  width: 90%;
  max-width: 400px;
  aspect-ratio: 3/4;
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
  cursor: grab;
  will-change: transform, opacity;
}

.profile-card:active {
  cursor: grabbing;
}

.profile-card.is-top {
  transform: scale(1.02) !important;
}

.no-profiles {
  text-align: center;
  color: #64748b;
}

.no-profiles i {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #e2e8f0;
}

.no-profiles h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.no-profiles p {
  font-size: 1rem;
  color: #94a3b8;
}

.swipe-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  padding: 16px;
}

.action-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.dislike {
  color: #ef4444;
}

.action-btn.dislike:hover {
  background: #ef4444;
  color: white;
}

.action-btn.superlike {
  color: #3b82f6;
  font-size: 1.3rem;
}

.action-btn.superlike:hover {
  background: #3b82f6;
  color: white;
}

.action-btn.like {
  color: #4ade80;
}

.action-btn.like:hover {
  background: #4ade80;
  color: white;
}

@media (max-width: 768px) {
  .swipe-container {
    padding: 16px;
    height: calc(100vh - 120px);
  }

  .swipe-header h1 {
    font-size: 1.5rem;
  }

  .profile-card {
    width: 95%;
  }

  .action-btn {
    width: 56px;
    height: 56px;
    font-size: 1.3rem;
  }
}

@media (min-width: 1024px) {
  .profile-card {
    max-width: 450px;
  }
}
</style>
