<template>
  <div class="sign-in-container">
    <!-- Left side - Image -->
    <div class="image-section">
      <div class="overlay"></div>
      <div class="content">
        <h1>Welcome to Matcha</h1>
        <p>Sign in to continue your journey to find love</p>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="form-section">
      <div class="form-container">
        <div class="logo">
          <h2>Matcha <i class="fas fa-heart"></i></h2>
        </div>

        <div class="welcome-text">
          <h3>Welcome Back!</h3>
          <p>Sign in to continue your journey</p>
        </div>

        <form class="sign-in-form" @submit.prevent="handleSignin">
          <div class="form-group" :class="{ 'has-error': usernameError }">
            <div class="input-wrapper">
              <input 
                v-model="username" 
                type="text" 
                id="username"
                required
                @focus="usernameError = ''"
              />
              <label for="username">Username</label>
              <i class="fas fa-user"></i>
            </div>
            <span class="error-message" v-if="usernameError">{{ usernameError }}</span>
          </div>

          <div class="form-group" :class="{ 'has-error': passwordError }">
            <div class="input-wrapper">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                id="password"
                required
                @focus="passwordError = ''"
              />
              <label for="password">Password</label>
              <i class="fas fa-lock"></i>
              <button 
                type="button" 
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Remember me</span>
            </label>
            <NuxtLink to="/reset-password" class="forgot-password">Forgot Password?</NuxtLink>
          </div>

          <button 
            type="submit" 
            class="sign-in-button"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Sign In</span>
            <div v-else class="spinner"></div>
          </button>

          <div class="divider">
            <span>or continue with</span>
          </div>

          <div class="social-buttons">
            <button type="button" class="social-button google">
              <i class="fab fa-google"></i>
              <span>Google</span>
            </button>
            <button type="button" class="social-button facebook">
              <i class="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </button>
          </div>

          <div class="sign-up-link">
            <p>Don't have an account? <NuxtLink to="/signup">Sign up</NuxtLink></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCFetch } from "~/composables/useCFetch";

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const usernameError = ref("");
const passwordError = ref("");

type SignInResponse = {
  status: string;
  data: {
    message: string;
    accesstoken: string;
    refreshToken: string;
    data: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      isVerfied: boolean;
      hasProfile: boolean | undefined;
    };
  };
};

async function handleSignin() {
  // Reset errors
  usernameError.value = "";
  passwordError.value = "";
  
  // Basic validation
  if (!username.value) {
    usernameError.value = "Username is required";
    return;
  }
  if (username.value.length < 5) {
    usernameError.value = "Username must be at least 5 characters long";
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
    usernameError.value = "Username can only contain letters, numbers, and underscores";
    return;
  }
  if (!password.value) {
    passwordError.value = "Password is required";
    return;
  }
  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
    return;
  }

  try {
    isLoading.value = true;
    const { data, error } = await useCFetch(
      "http://localhost:3001/auth/sign-in",
      {
        body: {
          username: username.value,
          password: password.value,
        },
        method: "POST",
      }
    );

    const response = data.value as SignInResponse;

    if (error.value) {
      const errorMessage = error.value.data?.error || error.value.data?.message || 'An error occurred';
      
      if (errorMessage.includes('Invalid username or password')) {
        passwordError.value = 'Invalid username or password. Please try again.';
      } else if (errorMessage.includes('Username not found')) {
        usernameError.value = 'This username is not registered. Please sign up first.';
      } else if (error.value.statusCode === 400) {
        if (errorMessage.includes('username')) {
          usernameError.value = errorMessage;
        } else if (errorMessage.includes('password')) {
          passwordError.value = errorMessage;
        } else {
          usernameError.value = errorMessage;
        }
      } else if (error.value.statusCode === 401) {
        passwordError.value = 'Invalid username or password';
      } else {
        usernameError.value = 'An error occurred. Please try again.';
      }
      console.error(error.value);
      return;
    }

    if (response.status === "success") {
      // Store tokens
      const accessToken = useCookie("access_token");
      const refreshToken = useCookie("refresh_token");
      
      accessToken.value = response.data.accesstoken;
      refreshToken.value = response.data.refreshToken;

      // Store remember me preference
      if (rememberMe.value) {
        localStorage.setItem("rememberMe", "true");
      }

      // Redirect based on profile completion
      window.location.href = response.data.data.hasProfile !== undefined 
        ? "/" 
        : "/completeprofile";
    }
  } catch (e) {
    console.error(e);
    usernameError.value = 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.sign-in-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

/* Image Section */
.image-section {
  flex: 1;
  background-image: url('/matching-couples.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
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
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.5)
  );
}

.image-section .content {
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
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
}

.image-section h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.image-section p {
  font-size: 1.25rem;
  max-width: 80%;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
}

/* Form Section */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h2 {
  font-size: 2rem;
  color: #1a1a1a;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.logo i {
  color: #ff4b6e;
}

.welcome-text {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-text h3 {
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.welcome-text p {
  color: #666;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 1rem 1rem 1rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.input-wrapper input:focus {
  border-color: #3b82f6;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper label {
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: 0;
  left: 1rem;
  font-size: 0.875rem;
  padding: 0 0.25rem;
  background-color: #ffffff;
  color: #3b82f6;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

.form-group.has-error .input-wrapper input {
  border-color: #ef4444;
}

.form-group.has-error .input-wrapper i {
  color: #ef4444;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 2px solid #e2e8f0;
  cursor: pointer;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Sign In Button */
.sign-in-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #ff4b6e, #ff6b8b);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sign-in-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 75, 110, 0.2);
}

.sign-in-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: calc(50% - 1rem);
  height: 1px;
  background-color: #e2e8f0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: white;
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* Social Buttons */
.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  background-color: white;
  color: #1a1a1a;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-button:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.social-button i {
  font-size: 1.25rem;
}

.social-button.google {
  color: #ea4335;
}

.social-button.facebook {
  color: #1877f2;
}

/* Sign Up Link */
.sign-up-link {
  text-align: center;
  color: #64748b;
}

.sign-up-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.sign-up-link a:hover {
  text-decoration: underline;
}
</style>
