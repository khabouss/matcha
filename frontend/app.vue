<template>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  </head>
  <div class="layout">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">Matcha ♡</div>
      <div class="navbar-right">
        <div v-if="isLoggedIn" class="profile-menu">
          <button @click="toggleProfile" class="profile-button">Profile</button>
          <div v-if="showProfile" class="dropdown">
            <button class="dropdown-btn">Settings</button>
            <button class="dropdown-btn">Logout</button>
          </div>
        </div>
        <button v-else class="signin">Sign In</button>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <Swipe/>
    </main>

<!-- Bottom Navigation -->
<nav class="bottom-nav">
  <button @click="goToPage('home')" class="nav-btn">
    <i class="fas fa-home"></i><span> Home</span>
  </button>
  <button @click="goToPage('search')" class="nav-btn">
    <i class="fas fa-search"></i><span> Search</span>
  </button>
  <button @click="goToPage('matches')" class="nav-btn">
    <i class="fas fa-heart"></i><span> Matches</span>
  </button>
  <button @click="goToPage('messages')" class="nav-btn">
    <i class="fas fa-envelope"></i><span> Messages</span>
  </button>
  <button @click="goToPage('profile')" class="nav-btn">
    <i class="fas fa-user"></i><span> Profile</span>
  </button>
</nav>


  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Swipe from './pages/Swipe.vue'

const isLoggedIn = ref(false); // Change to `true` when logged in
const showProfile = ref(false);

const toggleProfile = () => {
  showProfile.value = !showProfile.value;
};

const goToPage = (page:string) => {
  console.log(`Navigating to ${page}`);
};
</script>

<style>
/* General Styling */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease-in-out;
}

.navbar:hover {
  background-color: #f8f9fa;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #007bff;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Profile Menu */
.profile-button {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: color 0.3s ease;
}

.profile-button:hover {
  color: #007bff;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 3rem;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  border-radius: 0.25rem;
  animation: dropdownFade 0.3s ease forwards;
}

@keyframes dropdownFade {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.dropdown-btn:hover {
  background-color: #f1f1f1;
}

/* Sign In Button */
.signin {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signin:hover {
  background-color: #0056b3;
}

/* Notifications */
.notifications {
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.notifications:hover {
  color: #007bff;
}

/* Bottom Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  background-color: #fff;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease-in-out;
}

.bottom-nav:hover {
  background-color: #f8f9fa;
}

.nav-btn {
  background: none;
  border: none;
  height: 40px;
  color: #333;
  cursor: pointer;

  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-btn:hover {
  color: #007bff;
  transform: scale(1.1);
}

/* Main Content */
main {
  flex-grow: 1;
  padding: 1.5rem;
}

/* Responsive Design */
@media (min-width: 600px) {

  .navbar-right {
    gap: 2rem;
  }

  .nav-btn {
    height: 40px;
    font-size: 1.0rem;
  }

  
}

@media (max-width: 600px) {

  .nav-btn span {
    display: none; /* Hide text */
  }

  .nav-btn {
    justify-content: center; /* Center icon in button */
  }
  
}
</style>
