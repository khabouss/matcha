<template>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <div class="layout">
        <!-- Navbar -->
        <nav class="navbar">
            <div class="logo">Matcha <i class="fas fa-heart"></i></div>
            <div class="navbar-right">
                <svg v-if="route.path === '/'" @click="togglePopup" xmlns="http://www.w3.org/2000/svg" width="30px"
                    height="30px" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15 10.5A3.502 3.502 0 0 0 18.355 8H21a1 1 0 1 0 0-2h-2.645a3.502 3.502 0 0 0-6.71 0H3a1 1 0 0 0 0 2h8.645A3.502 3.502 0 0 0 15 10.5zM3 16a1 1 0 1 0 0 2h2.145a3.502 3.502 0 0 0 6.71 0H21a1 1 0 1 0 0-2h-9.145a3.502 3.502 0 0 0-6.71 0H3z"
                        fill="#000000" />
                </svg>
            </div>
        </nav>

        <!-- Main Content -->
        <main>
            <slot></slot>
        </main>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav">
            <button @click="goToPage('')" class="nav-btn">
                <i class="fas fa-heart"></i><span> Matches</span>
            </button>
            <hr style="width: 1px; height: 20px; display: inline-block;">
            <button @click="goToPage('profile')" class="nav-btn">
                <i class="fas fa-user"></i><span> Profile</span>
            </button>
            <hr style="width: 1px; height: 20px; display: inline-block;">
            <button @click="goToPage('chat')" class="nav-btn">
                <i class="fas fa-envelope"></i><span> Chat</span>
            </button>
            <hr style="width: 1px; height: 20px; display: inline-block;">
            <button @click="goToPage('notifications')" class="nav-btn">
                <i class="fas fa-bell"></i><span> Notifications</span>
            </button>
        </nav>

        <filter-popup class="popup" v-if="showPopup" @close="togglePopup" @apply-filters="handleFilters" />
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const isLoggedIn = ref(true); // Change to `true` when logged in
const showProfile = ref(false);
const showPopup = ref(false);
const route = useRoute();

const toggleProfile = () => {
    showProfile.value = !showProfile.value;
};

function togglePopup() {
    showPopup.value = !showPopup.value;
}

function handleFilters(filters: object) {
    // Process the filters received from the SortFilterPopup component
    console.log('Filters applied:', filters);
    // Implement your filtering logic here
}

const goToPage = (page: string) => {
    window.location.href = '/' + page;
};
</script>

<style>
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
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    /* Adjust as necessary */
    background-color: #fff;
    /* Example background color */
    z-index: 10;
    /* Ensure it's on top of other content */
    padding-bottom: calc(env(safe-area-inset-bottom) + 10px);
    /* Adjust for the safe area and provide some space */
}

.bottom-nav:hover {
    background-color: #f8f9fa;
}

.nav-btn {
    background: none;
    border: none;
    height: 60px;
    width: 60px;
    color: #333;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    align-items: center;
    gap: 3px;
    transition: color 0.3s ease, transform 0.3s ease;
}

.nav-btn:hover {
    color: #007bff;
    transform: scale(1.1);
}

/* Main Content */
main {
    flex-grow: 1;
    padding: 1rem;
}

/* Responsive Design */
@media (min-width: 600px) {

    .navbar-right {
        gap: 2rem;
    }

    .nav-btn {
        font-size: 1.0rem;
    }


}

@media (max-width: 600px) {

    .nav-btn {
        justify-content: center;
        /* Center icon in button */
    }

}
</style>