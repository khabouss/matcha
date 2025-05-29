<template>
  <div class="verify-container">
    <!-- Notification -->
    <div v-if="notification" 
         :class="['notification', notification.type]"
         @click="notification = null">
      {{ notification.message }}
      <button class="close-button">&times;</button>
    </div>

    <!-- Left side - Image -->
    <div class="image-section">
      <div class="overlay"></div>
      <div class="content">
        <h1>Welcome to Matcha</h1>
        <p>We're excited to have you join our community</p>
      </div>
    </div>

    <!-- Right side - Verification -->
    <div class="verification-section">
      <div class="verification-container">
        <div class="logo">
          <h2>Matcha <i class="fas fa-heart"></i></h2>
        </div>

        <div class="verification-content">
          <!-- Loading State -->
          <div v-if="loading" class="state-container loading">
            <div class="loading-animation">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
            </div>
            <h3>Verifying your account</h3>
            <p>Please wait while we verify your email address...</p>
          </div>

          <!-- Success State -->
          <div v-else-if="verified" class="state-container success">
            <div class="success-animation">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3>Account Verified!</h3>
            <p>Your account has been successfully verified. You can now sign in and start your journey.</p>
            <NuxtLink to="/signin" class="action-button">
              Continue to Sign In
              <i class="fas fa-arrow-right"></i>
            </NuxtLink>
          </div>

          <!-- Error State -->
          <div v-else class="state-container error">
            <div class="error-animation">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3>Verification Failed</h3>
            <p>{{ errorMessage || 'We couldn\'t verify your account. The link may be invalid or expired.' }}</p>
            <div class="action-buttons">
              <button 
                @click="resendVerification" 
                class="action-button secondary"
                :disabled="resending"
              >
                <i class="fas fa-paper-plane"></i>
                {{ resending ? 'Sending...' : 'Resend Verification' }}
              </button>
              <NuxtLink to="/signin" class="action-button">
                Back to Sign In
                <i class="fas fa-arrow-right"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'
import { useNotificationStore } from '~/stores/notification'

interface VerificationResponse {
  status: 'success' | 'error'
  error_message?: string
}

const loading = ref(true)
const verified = ref(false)
const errorMessage = ref('')
const resending = ref(false)
const router = useRouter()
const notification = useNotificationStore()

onMounted(async () => {
  const token = router.currentRoute.value.query.token
  
  if (!token) {
    loading.value = false
    errorMessage.value = 'Verification token is missing'
    return
  }

  try {
    const response = await $fetch<VerificationResponse>('http://localhost:3001/auth/verify-account', {
      method: 'POST',
      body: { token }
    })
    
    if (response.status === 'success') {
      verified.value = true
      notification.success('Account verified successfully!')
    } else {
      errorMessage.value = response.error_message || 'Verification failed'
    }
  } catch (error: any) {
    errorMessage.value = error.data?.error_message || 'An error occurred during verification'
  } finally {
    loading.value = false
  }
})

const resendVerification = async () => {
  if (resending.value) return
  
  resending.value = true
  try {
    const email = localStorage.getItem('pendingVerificationEmail')
    if (!email) {
      notification.error('No pending verification found. Please sign up again.')
      return
    }

    const response = await $fetch<VerificationResponse>('http://localhost:3001/auth/resend-verification', {
      method: 'POST',
      body: { email }
    })

    if (response.status === 'success') {
      notification.success('Verification email sent! Please check your inbox.')
    } else {
      notification.error(response.error_message || 'Failed to resend verification email')
    }
  } catch (error: any) {
    notification.error(error.data?.error_message || 'Failed to resend verification email')
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
.verify-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

/* Image Section */
.image-section {
  flex: 1;
  position: relative;
  background-image: url('/images/auth-bg.jpg');
  background-size: cover;
  background-position: center;
  display: none;
}

@media (min-width: 1024px) {
  .image-section {
    display: block;
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
}

.content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.content p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 400px;
}

/* Verification Section */
.verification-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.verification-container {
  width: 100%;
  max-width: 480px;
  padding: 2rem;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h2 {
  font-size: 2rem;
  color: #333;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.logo i {
  color: #ff4d6d;
}

.verification-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.state-container {
  text-align: center;
  padding: 2rem 1rem;
}

/* Loading Animation */
.loading-animation {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.circle {
  width: 12px;
  height: 12px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: bounce 0.5s ease-in-out infinite;
}

.circle:nth-child(2) {
  animation-delay: 0.1s;
}

.circle:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Success Animation */
.success-animation {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1.5rem;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Error Animation */
.error-animation {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.state-container h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.state-container p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.action-button.secondary {
  background-color: #f3f4f6;
  color: #4b5563;
}

.action-button.secondary:hover {
  background-color: #e5e7eb;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

/* State-specific styles */
.success .action-button {
  background-color: #10b981;
}

.success .action-button:hover {
  background-color: #059669;
}

.error .action-button {
  background-color: #ef4444;
}

.error .action-button:hover {
  background-color: #dc2626;
}

/* Notification styles */
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.notification.success {
  background-color: #10b981;
}

.notification.error {
  background-color: #ef4444;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>