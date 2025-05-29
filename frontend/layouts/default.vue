<template>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <div class="layout">
        <!-- Navbar -->
        <nav class="navbar" v-if="!isMobile">
            <div class="navbar-container">
                <!-- Logo Section -->
                <NuxtLink to="/" class="logo">
                    <i class="fas fa-heart"></i>
                    <span>Matcha</span>
                </NuxtLink>

                <!-- Search Bar (visible on desktop) -->
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search profiles..." />
                </div>

                <!-- Navigation Items -->
                <div class="nav-items">
                    <NuxtLink to="/discover" class="nav-item" active-class="active">
                        <i class="fas fa-compass"></i>
                        <span>Discover</span>
                    </NuxtLink>
                    
                    <NuxtLink to="/chat" class="nav-item" active-class="active">
                        <div class="nav-icon-wrapper">
                            <i class="fas fa-comment"></i>
                            <span class="notification-badge" v-if="hasUnreadMessages">3</span>
                        </div>
                        <span>Chat</span>
                    </NuxtLink>
                    
                    <NuxtLink to="/notifications" class="nav-item" active-class="active">
                        <div class="nav-icon-wrapper">
                            <i class="fas fa-bell"></i>
                            <span class="notification-badge" v-if="hasNotifications">5</span>
                        </div>
                        <span>Notifications</span>
                    </NuxtLink>

                    <!-- Profile Menu -->
                    <div class="profile-menu" @click="toggleProfile">
                        <div class="profile-button">
                            <img src="http://localhost:4566/test-bucket/default-avatar.svg" alt="Profile" class="profile-avatar" />
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        
                        <!-- Dropdown Menu -->
                        <div class="dropdown" v-if="showProfile">
                            <NuxtLink to="/profile" class="dropdown-item">
                                <i class="fas fa-user"></i>
                                <span>My Profile</span>
                            </NuxtLink>
                            <NuxtLink to="/settings" class="dropdown-item">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </NuxtLink>
                            <button class="dropdown-item" @click="handleLogout">
                                <i class="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filter Button (visible on mobile) -->
                <button class="filter-button" @click="togglePopup" v-if="route.path === '/'">
                    <i class="fas fa-sliders-h"></i>
                </button>
            </div>
        </nav>

        <!-- Main Content -->
        <main :class="{ 'mobile-padding': isMobile }">
            <Notification />
            <slot></slot>
        </main>

        <!-- Bottom Navigation (Mobile Only) -->
        <nav class="bottom-nav" v-if="isMobile">
            <NuxtLink to="/" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <i class="fas fa-heart"></i>
                    <span class="nav-label">Matches</span>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/discover" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <i class="fas fa-compass"></i>
                    <span class="nav-label">Discover</span>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/chat" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <i class="fas fa-comment"></i>
                    <span class="nav-label">Chat</span>
                    <span class="notification-badge" v-if="hasUnreadMessages">3</span>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/notifications" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <i class="fas fa-bell"></i>
                    <span class="nav-label">Notifications</span>
                    <span class="notification-badge" v-if="hasNotifications">5</span>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/profile" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <i class="fas fa-user"></i>
                    <span class="nav-label">Profile</span>
                </div>
            </NuxtLink>
        </nav>

        <filter-popup class="popup" v-if="showPopup" @close="togglePopup" @apply-filters="handleFilters" />
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Notification from '~/components/Notification.vue'

const isLoggedIn = ref(true); // Change to `true` when logged in
const showProfile = ref(false);
const showPopup = ref(false);
const route = useRoute();
const hasUnreadMessages = ref(true); // Replace with actual logic
const hasNotifications = ref(true); // Replace with actual logic
const isMobile = ref(false);

// Check if we're on mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
};

// Add resize listener
onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

// Clean up resize listener
onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
});

const toggleProfile = () => {
    showProfile.value = !showProfile.value;
};

function togglePopup() {
    showPopup.value = !showPopup.value;
}

function handleFilters(filters: object) {
    console.log('Filters applied:', filters);
}

const goToPage = (page: string) => {
    window.location.href = '/' + page;
};

const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #1a1a1a;
    font-size: 1.5rem;
    font-weight: 700;
    transition: all 0.3s ease;
}

.logo i {
    color: #ff4b6e;
    font-size: 1.25rem;
}

.logo:hover {
    transform: translateY(-1px);
}

/* Search Bar */
.search-bar {
    flex: 1;
    max-width: 400px;
    position: relative;
    display: none;
}

@media (min-width: 768px) {
    .search-bar {
        display: block;
    }
}

.search-bar input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    background: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;
}

.search-bar input:focus {
    outline: none;
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-bar i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 0.875rem;
}

/* Navigation Items */
.nav-items {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    color: #64748b;
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.nav-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-item i {
    font-size: 1.25rem;
    transition: all 0.3s ease;
}

.nav-item:hover {
    color: #3b82f6;
}

.nav-item:hover i {
    transform: translateY(-2px);
}

.nav-item.active {
    color: #3b82f6;
}

.nav-item.active i {
    transform: translateY(-2px);
}

/* Profile Menu */
.profile-menu {
    position: relative;
}

.profile-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.profile-button:hover {
    background: rgba(0, 0, 0, 0.05);
}

.profile-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;
}

.profile-button:hover .profile-avatar {
    border-color: #3b82f6;
}

.profile-button i {
    font-size: 0.75rem;
    color: #64748b;
    transition: transform 0.3s ease;
}

.profile-menu:hover .profile-button i {
    transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 200px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    animation: dropdownFade 0.3s ease;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #1a1a1a;
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: 0.875rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.dropdown-item:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #3b82f6;
}

.dropdown-item i {
    font-size: 1rem;
    color: #64748b;
    transition: color 0.3s ease;
}

.dropdown-item:hover i {
    color: #3b82f6;
}

/* Filter Button (Mobile) */
.filter-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    background: none;
    color: #64748b;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

@media (min-width: 768px) {
    .filter-button {
        display: none;
    }
}

.filter-button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #3b82f6;
}

.filter-button i {
    font-size: 1.25rem;
}

/* Notification Badge */
.notification-badge {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    background: #ef4444;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 1.25rem;
    height: 1.25rem;
    border-radius: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.25rem;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes dropdownFade {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .navbar {
        background: rgba(17, 24, 39, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logo {
        color: #ffffff;
    }

    .search-bar input {
        background: rgba(31, 41, 55, 0.9);
        border-color: rgba(255, 255, 255, 0.1);
        color: #ffffff;
    }

    .search-bar input:focus {
        border-color: #60a5fa;
        background: #1f2937;
    }

    .search-bar i {
        color: #9ca3af;
    }

    .nav-item {
        color: #9ca3af;
    }

    .nav-item:hover,
    .nav-item.active {
        color: #60a5fa;
    }

    .profile-button:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .profile-avatar {
        border-color: rgba(255, 255, 255, 0.1);
    }

    .profile-button:hover .profile-avatar {
        border-color: #60a5fa;
    }

    .profile-button i {
        color: #9ca3af;
    }

    .dropdown {
        background: rgba(31, 41, 55, 0.95);
        border-color: rgba(255, 255, 255, 0.05);
    }

    .dropdown-item {
        color: #ffffff;
    }

    .dropdown-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #60a5fa;
    }

    .dropdown-item i {
        color: #9ca3af;
    }

    .dropdown-item:hover i {
        color: #60a5fa;
    }

    .filter-button {
        color: #9ca3af;
    }

    .filter-button:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #60a5fa;
    }

    .notification-badge {
        border-color: #1f2937;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .navbar-container {
        padding: 0.5rem 1rem;
    }

    .nav-items {
        gap: 1rem;
    }

    .nav-item span {
        display: none;
    }

    .nav-item i {
        font-size: 1.5rem;
    }

    .profile-button span {
        display: none;
    }
}

/* Bottom Navigation */
.bottom-nav {
    display: none; /* Hidden by default, shown on mobile */
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding: 8px 16px calc(env(safe-area-inset-bottom) + 8px);
    z-index: 100;
}

.bottom-nav .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #64748b;
    transition: all 0.3s ease;
    position: relative;
    padding: 8px 0;
    min-width: 64px;
}

.bottom-nav .nav-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
}

.bottom-nav .nav-icon i {
    font-size: 1.25rem;
    transition: all 0.3s ease;
}

.bottom-nav .nav-label {
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.bottom-nav .nav-item.active {
    color: #3b82f6;
}

.bottom-nav .nav-item.active .nav-icon i {
    transform: translateY(-2px);
}

.bottom-nav .nav-item.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: #3b82f6;
    border-radius: 50%;
}

.bottom-nav .notification-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ef4444;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Bottom Navigation Hover and Active States */
.bottom-nav .nav-item:hover {
    color: #3b82f6;
}

.bottom-nav .nav-item:hover .nav-icon i {
    transform: translateY(-2px);
}

/* Bottom Navigation Responsive Design */
@media (max-width: 640px) {
    .bottom-nav {
        height: 60px;
        padding: 6px 12px calc(env(safe-area-inset-bottom) + 6px);
    }

    .bottom-nav .nav-icon i {
        font-size: 1.125rem;
    }

    .bottom-nav .nav-label {
        font-size: 0.7rem;
    }

    .bottom-nav .notification-badge {
        min-width: 16px;
        height: 16px;
        font-size: 0.65rem;
    }
}

/* Bottom Navigation Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .bottom-nav {
        background: rgba(17, 24, 39, 0.95);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .bottom-nav .nav-item {
        color: #9ca3af;
    }

    .bottom-nav .nav-item.active {
        color: #60a5fa;
    }

    .bottom-nav .nav-item.active::after {
        background: #60a5fa;
    }

    .bottom-nav .notification-badge {
        border-color: #1f2937;
    }
}

/* Show bottom navigation on mobile */
@media (max-width: 767px) {
    .bottom-nav {
        display: flex;
    }
}

/* Main Content */
main {
    flex-grow: 1;
    padding: 1rem;
    margin-top: 0;
}

@media (min-width: 768px) {
    main {
        margin-top: 64px;
    }
}

/* Mobile Padding for Main Content */
.mobile-padding {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
}

@media (max-width: 640px) {
    .mobile-padding {
        padding-bottom: calc(60px + env(safe-area-inset-bottom));
    }
}
</style>