<template>
  <div 
    class="swipe-card" 
    :class="{ 
      'is-liked': isLiked, 
      'is-disliked': isDisliked,
      'is-dragging': touchStartX !== 0 
    }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="swipe-card-content" :style="cardStyle">
      <!-- Profile Image -->
      <div class="profile-image">
        <img :src="currentImage" :alt="profile.first_name" />
        <div class="image-counter">{{ currentImageIndex + 1 }}/{{ profile.images.length }}</div>
      </div>

      <!-- Profile Info -->
      <div class="profile-info">
        <h2>{{ profile.first_name }}, {{ calculateAge(profile.birthdate) }}</h2>
        <p class="location">
          <i class="fas fa-map-marker-alt"></i>
          {{ profile.neighborhood || 'Nearby' }}
        </p>
        <p class="bio">{{ profile.biography }}</p>
        
        <!-- Interests -->
        <div class="interests">
          <span v-for="interest in profile.interests" 
                :key="interest" 
                class="interest-tag">
            {{ interest }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          class="action-btn dislike" 
          @click="handleDislike"
          :disabled="isLiked || isDisliked"
        >
          <i class="fas fa-times"></i>
        </button>
        <button 
          class="action-btn like" 
          @click="handleLike"
          :disabled="isLiked || isDisliked"
          :class="{ 'is-active': isLiked }"
        >
          <i class="fas fa-heart"></i>
        </button>
      </div>

      <!-- Match Popup -->
      <div v-if="showMatchPopup" class="match-popup">
        <div class="match-content">
          <h2>It's a Match! 🎉</h2>
          <p>You and {{ profile.first_name }} have liked each other</p>
          <div class="match-actions">
            <button @click="startChat" class="chat-btn">Start Chatting</button>
            <button @click="continueSwiping" class="continue-btn">Keep Swiping</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotificationStore } from '@/store/notifications';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['swipe', 'match']);

const currentImageIndex = ref(0);
const isLiked = ref(false);
const isDisliked = ref(false);
const showMatchPopup = ref(false);
const notificationStore = useNotificationStore();

const currentImage = computed(() => props.profile.images[currentImageIndex.value]);

const cardStyle = computed(() => ({
  transform: `translateX(${props.profile.offsetX || 0}px) rotate(${props.profile.rotate || 0}deg)`,
  opacity: props.profile.opacity || 1,
  backgroundImage: `url(${currentImage.value})`
}));

function calculateAge(birthdate: string) {
  if (!birthdate) return '';
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
  return `${age} years`;
}

async function handleLike() {
  try {
    // Show loading state
    isLiked.value = true;
    
    // Send like request to backend
    const response = await $fetch(`http://localhost:3001/like/like/${props.profile.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useCookie('access_token').value}`
      }
    });

    if (response.status === 'success') {
      // If it's a match, show the match popup
      if (response.data.isMatch) {
        showMatchPopup.value = true;
        emit('match', props.profile);
        
        // Show match notification
        notificationStore.addNotification({
          id: Date.now(),
          message: `It's a match! You and ${props.profile.first_name} have liked each other!`,
          type: 'success',
          link: `/chat/${props.profile.id}`
        });
      } else {
        // Show regular like notification
        notificationStore.addNotification({
          id: Date.now(),
          message: `You liked ${props.profile.first_name}'s profile`,
          type: 'info'
        });
      }
      
      // Emit swipe event to parent component
      emit('swipe', 'like', props.profile);
    }
  } catch (error: any) {
    // Reset like state on error
    isLiked.value = false;
    
    // Show error notification
    notificationStore.addNotification({
      id: Date.now(),
      message: error.message || 'Error liking profile. Please try again.',
      type: 'error'
    });
    
    console.error('Error liking profile:', error);
  }
}

function handleDislike() {
  isDisliked.value = true;
  emit('swipe', 'dislike', props.profile);
}

function startChat() {
  window.location.href = `/chat/${props.profile.id}`;
}

function continueSwiping() {
  showMatchPopup.value = false;
  emit('swipe', 'continue');
}

// Handle image navigation
function nextImage() {
  if (currentImageIndex.value < props.profile.images.length - 1) {
    currentImageIndex.value++;
  }
}

function previousImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}

// Add touch/swipe handlers with improved animation
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function handleTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event: TouchEvent) {
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
  
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  
  // Only handle horizontal swipes
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    const rotate = deltaX * 0.1; // Adjust rotation based on swipe distance
    const opacity = Math.max(0.5, 1 - Math.abs(deltaX) / window.innerWidth);
    
    // Update profile state
    props.profile.offsetX = deltaX;
    props.profile.rotate = rotate;
    props.profile.opacity = opacity;
  }
}

function handleTouchEnd(event: TouchEvent) {
  const deltaX = touchEndX - touchStartX;
  const minSwipeDistance = window.innerWidth * 0.3; // 30% of screen width

  if (Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // Swipe right - like
      handleLike();
    } else {
      // Swipe left - dislike
      handleDislike();
    }
  } else {
    // Reset card position
    props.profile.offsetX = 0;
    props.profile.rotate = 0;
    props.profile.opacity = 1;
  }
}
</script>

<style scoped>
.swipe-card {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
}

.swipe-card-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-image {
  position: relative;
  height: 60%;
  overflow: hidden;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-counter {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.profile-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-info h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  margin: 0;
}

.location i {
  color: #3b82f6;
}

.bio {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.interests {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.interest-tag {
  background: #f3f4f6;
  color: #4b5563;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  background: white;
}

.action-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn.like {
  background: white;
  color: #3b82f6;
}

.action-btn.like.is-active {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.action-btn.like:hover:not(:disabled) {
  background: #dbeafe;
  transform: scale(1.1);
}

.action-btn.dislike {
  background: white;
  color: #ef4444;
}

.action-btn.dislike:hover:not(:disabled) {
  background: #fee2e2;
  transform: scale(1.1);
}

.match-popup {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.match-content {
  background: white;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.match-content h2 {
  color: #3b82f6;
  margin: 0 0 16px 0;
}

.match-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.chat-btn, .continue-btn {
  flex: 1;
  padding: 12px;
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

.continue-btn {
  background: #f3f4f6;
  color: #4b5563;
}

.chat-btn:hover {
  background: #2563eb;
}

.continue-btn:hover {
  background: #e5e7eb;
}

.swipe-card.is-dragging {
  transition: none;
}

.swipe-card.is-liked {
  animation: likeAnimation 0.5s ease;
}

.swipe-card.is-disliked {
  animation: dislikeAnimation 0.5s ease;
}

@keyframes likeAnimation {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

@keyframes dislikeAnimation {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
</style> 