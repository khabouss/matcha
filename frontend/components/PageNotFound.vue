<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">Oops! Page Not Found</p>
      <p class="error-description">
        It seems like the page you’re looking for doesn't exist.
      </p>
      <button class="home-button" @click="goHome">Go to Homepage</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  window.location.href = '/';
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.not-found-content {
  text-align: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 96px;
  font-weight: bold;
  color: #333;
}

.error-message {
  font-size: 24px;
  margin-top: 10px;
  color: #555;
}

.error-description {
  font-size: 16px;
  margin-top: 5px;
  color: #777;
}

.home-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.home-button:hover {
  background-color: #0056b3;
}
</style>
