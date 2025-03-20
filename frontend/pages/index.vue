<template>
  <NuxtLayout>
    <div class="swipe-container">
      <div
        class="profile-card"
        v-for="(profile, index) in profiles"
        :key="index"
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
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive } from "vue";

const profiles = ref([]);
const currentIndex = ref(0);
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

    if (permission.state === "granted") {
      console.log("Permission granted ✅");
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            reject({ lat: null, lon: null });
          }
        );
      });
    } else if (permission.state === "prompt") {
      console.log("Requesting permission ⚠️");
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            reject({ lat: null, lon: null });
          }
        );
      });
    } else {
      console.log("Permission denied ❌");
      return { lat: null, lon: null };
    }
  } catch (error) {
    console.error("Permission check error:", error);
    return { lat: null, lon: null };
  }
};

// Fetch profiles and send location
const fetchProfiles = async () => {
  const location = await getUserLocation();
  console.log("location ==========>: ", location);

  const { data, error } = await useCFetch(
    "http://localhost:3001/profile/swipe-list",
    {
      method: "GET",
      params: { latitude: location.lat, longitude: location.lon },
    }
  );
  console.log("error ==========>: ", error);

  if (data.value?.status === "success") {
    profiles.value = data?.value?.data?.swipeData;
  }
};

// Fetch profiles on load
fetchProfiles();

const startSwipe = (event, profile, index) => {
  swipeData.startX =
    event.type === "mousedown" ? event.clientX : event.touches[0].clientX;
  swipeData.dragging = true;

  const moveHandler = (moveEvent) => {
    swipeData.currentX =
      moveEvent.type === "mousemove"
        ? moveEvent.clientX
        : moveEvent.touches[0].clientX;
    const deltaX = swipeData.currentX - swipeData.startX;
    profiles.value[index].offsetX = deltaX;
    profiles.value[index].rotate = deltaX / 10;
    profiles.value[index].opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 400);
  };

  const endSwipe = () => {
    swipeData.dragging = false;
    const deltaX = swipeData.currentX - swipeData.startX;
    if (deltaX > 150) {
      like();
    } else if (deltaX < -150) {
      dislike();
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

const like = () => {
  animateSwipe("like");
};

const dislike = () => {
  animateSwipe("dislike");
};

const animateSwipe = (direction) => {
  const index = currentIndex.value;
  const profile = profiles.value[index];
  profile.offsetX = direction === "like" ? 400 : -400;
  profile.rotate = direction === "like" ? 30 : -30;
  profile.opacity = 0;
  setTimeout(() => {
    profiles.value.splice(index, 1);
  }, 300);
};

const resetCard = (index) => {
  profiles.value[index].offsetX = 0;
  profiles.value[index].rotate = 0;
  profiles.value[index].opacity = 1;
};
</script>

<style scoped>
/* Container */
.swipe-container {
  position: relative;
  height: calc(90vh - 140px);
  /* Adjusted height based on navbar and bottom nav */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Profile Card */
.profile-card {
  position: absolute;
  width: 90%;
  height: calc(80vh - 120px);
  max-width: 400px;
  aspect-ratio: 3/4;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.2);
  overflow-x: hidden;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.profile-card::-webkit-scrollbar {
  display: none;
}

.profile-card {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* Swipe Buttons inside the container */
.swipe-buttons {
  position: absolute;
  bottom: 40px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 250px;
  z-index: 10;
}

.swipe-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.swipe-btn i {
  color: white;
}

/* Dislike Button Style */
.dislike-btn {
  background-color: #dc3545;
}

.dislike-btn:hover {
  transform: scale(1.1);
  background-color: #c82333;
}

/* Like Button Style */
.like-btn {
  background-color: #28a745;
}

.like-btn:hover {
  transform: scale(1.1);
  background-color: #218838;
}

/* Responsive Design */
@media (min-width: 600px) {
  .swipe-btn {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
}
</style>
