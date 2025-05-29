<template>
  <div class="sign-up-container">
    <!-- Left side - Image -->
    <div class="image-section">
      <div class="overlay"></div>
      <div class="content">
        <h1>Join Matcha</h1>
        <p>Create your account and start your journey to find love</p>
      </div>
    </div>

    <!-- Right side - Form -->
    <div class="form-section">
      <div class="form-container">
        <div class="logo">
          <h2>Matcha <i class="fas fa-heart"></i></h2>
        </div>

        <div class="welcome-text">
          <h3>Create Account</h3>
          <p>Fill in your details to get started</p>
        </div>

        <form class="sign-up-form" @submit.prevent="handleSignup">
          <div class="form-group" :class="{ 'has-error': userNameError }">
            <div class="input-wrapper">
              <input 
                v-model="userName" 
                type="text" 
                id="username"
                required
                @focus="userNameError = ''"
              />
              <label for="username">Username</label>
              <i class="fas fa-user"></i>
            </div>
            <span class="error-message" v-if="userNameError">{{ userNameError }}</span>
          </div>

          <div class="form-row">
            <div class="form-group" :class="{ 'has-error': firstNameError }">
              <div class="input-wrapper">
                <input 
                  v-model="firstName" 
                  type="text" 
                  id="firstName"
                  required
                  @focus="firstNameError = ''"
                />
                <label for="firstName">First Name</label>
                <i class="fas fa-user-circle"></i>
              </div>
              <span class="error-message" v-if="firstNameError">{{ firstNameError }}</span>
            </div>

            <div class="form-group" :class="{ 'has-error': lastNameError }">
              <div class="input-wrapper">
                <input 
                  v-model="lastName" 
                  type="text" 
                  id="lastName"
                  required
                  @focus="lastNameError = ''"
                />
                <label for="lastName">Last Name</label>
                <i class="fas fa-user-circle"></i>
              </div>
              <span class="error-message" v-if="lastNameError">{{ lastNameError }}</span>
            </div>
          </div>

          <div class="form-group" :class="{ 'has-error': emailError }">
            <div class="input-wrapper">
              <input 
                v-model="email" 
                type="email" 
                id="email"
                required
                @focus="emailError = ''"
              />
              <label for="email">Email</label>
              <i class="fas fa-envelope"></i>
            </div>
            <span class="error-message" v-if="emailError">{{ emailError }}</span>
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

          <div class="form-group" :class="{ 'has-error': confirmPasswordError }">
            <div class="input-wrapper">
              <input 
                v-model="confirmPassword" 
                :type="showPassword ? 'text' : 'password'" 
                id="confirmPassword"
                required
                @focus="confirmPasswordError = ''"
              />
              <label for="confirmPassword">Confirm Password</label>
              <i class="fas fa-lock"></i>
            </div>
            <span class="error-message" v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
          </div>

          <div class="terms-checkbox">
            <label class="checkbox-wrapper">
              <input 
                type="checkbox" 
                v-model="acceptTerms"
                required
              />
              <span class="checkmark"></span>
              <span class="label-text">
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            class="sign-up-button"
            :disabled="isLoading || !acceptTerms"
          >
            <span v-if="!isLoading">Create Account</span>
            <div v-else class="spinner"></div>
          </button>

          <div class="divider">
            <span>or sign up with</span>
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

          <div class="sign-in-link">
            <p>Already have an account? <NuxtLink to="/signin">Sign in</NuxtLink></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useCFetch } from "~/composables/useCFetch";

const userName = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);

// Error states
const userNameError = ref('');
const firstNameError = ref('');
const lastNameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

type SignUpResponse = {
  status: string;
  data?: {
    message: string;
  };
};

async function handleSignup() {
  // Reset errors
  userNameError.value = '';
  firstNameError.value = '';
  lastNameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';

  // Validation
  if (!userName.value) {
    userNameError.value = 'Username is required';
    return;
  }
  if (userName.value.length < 5) {
    userNameError.value = 'Username must be at least 5 characters long';
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(userName.value)) {
    userNameError.value = 'Username can only contain letters, numbers, and underscores';
    return;
  }
  if (!firstName.value) {
    firstNameError.value = 'First name is required';
    return;
  }
  if (!lastName.value) {
    lastNameError.value = 'Last name is required';
    return;
  }
  if (!email.value) {
    emailError.value = 'Email is required';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
    return;
  }
  if (!password.value) {
    passwordError.value = 'Password is required';
    return;
  }
  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long';
    return;
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
    passwordError.value = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    return;
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
    return;
  }
  if (!acceptTerms.value) {
    return;
  }

  try {
    isLoading.value = true;
    const { data, error } = await useCFetch(
      "http://localhost:3001/auth/sign-up",
      {
        body: {
          userName: userName.value,
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
        },
        method: "POST",
      }
    );

    const response = data.value as SignUpResponse;

    if (error.value) {
      const errorMessage = error.value.data?.error || error.value.data?.message || 'An error occurred';
      
      if (errorMessage.includes('Email already exists')) {
        emailError.value = 'This email is already registered. Please use a different email or sign in.';
      } else if (errorMessage.includes('Username already exists')) {
        userNameError.value = 'This username is already taken. Please choose a different one.';
      } else if (error.value.statusCode === 400) {
        if (errorMessage.includes('username')) {
          userNameError.value = errorMessage;
        } else if (errorMessage.includes('email')) {
          emailError.value = errorMessage;
        } else if (errorMessage.includes('password')) {
          passwordError.value = errorMessage;
        } else {
          emailError.value = errorMessage;
        }
      } else {
        emailError.value = 'An error occurred. Please try again.';
      }
      console.error(error.value);
      return;
    }

    if (response.status === "success") {
      // Redirect to verification page
      window.location.href = "/verify";
    }
  } catch (e) {
    console.error(e);
    emailError.value = 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.sign-up-container {
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
  max-width: 480px;
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
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

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

/* Terms Checkbox */
.terms-checkbox {
  margin-bottom: 1.5rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 1.25rem;
  width: 1.25rem;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-wrapper:hover input ~ .checkmark {
  border-color: #3b82f6;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 0.375rem;
  top: 0.125rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-wrapper input:checked ~ .checkmark:after {
  display: block;
}

.label-text {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.label-text a {
  color: #3b82f6;
  text-decoration: none;
}

.label-text a:hover {
  text-decoration: underline;
}

/* Sign Up Button */
.sign-up-button {
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

.sign-up-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 75, 110, 0.2);
}

.sign-up-button:disabled {
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

/* Sign In Link */
.sign-in-link {
  text-align: center;
  color: #64748b;
}

.sign-in-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.sign-in-link a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-container {
    padding: 1rem;
  }
}

/* Add password strength indicator styles */
.password-strength {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.password-strength.weak {
  color: #ef4444;
}

.password-strength.medium {
  color: #f59e0b;
}

.password-strength.strong {
  color: #10b981;
}
</style>