<template>
    <div class="modern-profile" @click="changeRoute">
        <!-- Hero Section with Dynamic Background -->
        <div class="hero-section" :style="heroStyle">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="profile-basic">
                    <h1 class="profile-name">{{ props.profile.first_name }}</h1>
                    <div class="profile-meta">
                        <span class="age">{{ calculateAge(props.profile.birthdate) }}</span>
                        <span class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            {{ props.profile.location || 'Nearby' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Navigation -->
        <div class="profile-nav">
            <button 
                v-for="(tab, index) in tabs" 
                :key="index"
                :class="['nav-item', { active: activeTab === tab.id }]"
                @click.stop="activeTab = tab.id">
                <i :class="tab.icon"></i>
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- Profile Content -->
        <div class="profile-body">
            <!-- Photos Tab -->
            <div v-show="activeTab === 'photos'" class="tab-content photos-grid">
                <div v-for="(image, index) in props.profile.images" 
                     :key="index"
                     class="photo-item"
                     @click.stop="openGallery(index)">
                    <img :src="image" :alt="`Photo ${index + 1}`" />
                    <div class="photo-overlay">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
            </div>

            <!-- About Tab -->
            <div v-show="activeTab === 'about'" class="tab-content about-section">
                <div class="bio-card">
                    <h3>About Me</h3>
                    <p>{{ props.profile.biography }}</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <i class="fas fa-heart"></i>
                        <div class="stat-info">
                            <span class="stat-value">{{ props.profile.fame_rating }}</span>
                            <span class="stat-label">Fame Rating</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-users"></i>
                        <div class="stat-info">
                            <span class="stat-value">{{ props.profile.match_count }}</span>
                            <span class="stat-label">Matches</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-eye"></i>
                        <div class="stat-info">
                            <span class="stat-value">{{ props.profile.views_count }}</span>
                            <span class="stat-label">Profile Views</span>
                        </div>
                    </div>
                </div>

                <div class="interests-cloud">
                    <div v-for="interest in props.profile.interests" 
                         :key="interest"
                         class="interest-bubble"
                         :style="getRandomBubbleStyle()">
                        {{ interest }}
                    </div>
                </div>
            </div>

            <!-- Preferences Tab -->
            <div v-show="activeTab === 'preferences'" class="tab-content preferences-section">
                <div class="preference-card">
                    <h3>Looking For</h3>
                    <div class="preference-tags">
                        <span class="preference-tag">
                            <i class="fas fa-venus-mars"></i>
                            {{ props.profile.sexual_preferences }}
                        </span>
                        <span class="preference-tag">
                            <i class="fas fa-heart"></i>
                            {{ props.profile.relationship_type }}
                        </span>
                    </div>
                </div>

                <div class="preference-card">
                    <h3>Location</h3>
                    <div class="location-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>{{ props.profile.distance }}km away</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Bar -->
        <div v-if="props.profile.isMatch" class="action-bar">
            <button class="action-button message" @click.stop="handleMessage">
                <i class="fas fa-comment"></i>
                Message
            </button>
            <button class="action-button unmatch" @click.stop="handleUnmatch">
                <i class="fas fa-heart-broken"></i>
                Unmatch
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeTab = ref('photos');

const props = defineProps({
    profile: {
        type: Object,
        required: true
    }
});

const tabs = [
    { id: 'photos', label: 'Photos', icon: 'fas fa-images' },
    { id: 'about', label: 'About', icon: 'fas fa-user' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' }
];

const heroStyle = computed(() => ({
    backgroundImage: `url(${props.profile.images[0]})`
}));

function calculateAge(birthdate: string) {
    if (!birthdate) return '';
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    return `${age} years`;
}

function getRandomBubbleStyle() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const sizes = ['small', 'medium', 'large'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    return {
        backgroundColor: color,
        transform: `scale(${Math.random() * 0.4 + 0.8})`
    };
}

function changeRoute() {
    if (route.path !== `/${props.profile.username}`) {
        window.location.href = `/${props.profile.username}`;
    }
}

function openGallery(index: number) {
    // Implement gallery view
}

function handleMessage() {
    // Implement message action
}

function handleUnmatch() {
    // Implement unmatch action
}
</script>

<style scoped>
.modern-profile {
    height: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* Hero Section */
.hero-section {
    height: 60vh;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: flex-end;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.7) 100%
    );
}

.hero-content {
    position: relative;
    z-index: 1;
    padding: 24px;
    width: 100%;
    color: white;
}

.profile-basic {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.profile-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.profile-meta {
    display: flex;
    gap: 16px;
    font-size: 1.1rem;
}

.age, .location {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Profile Navigation */
.profile-nav {
    display: flex;
    background: white;
    padding: 12px;
    gap: 8px;
    border-bottom: 1px solid #f0f0f0;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px;
    border: none;
    background: none;
    color: #666;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
}

.nav-item i {
    font-size: 1.2rem;
}

.nav-item.active {
    background: #f8f9fa;
    color: #3b82f6;
}

/* Profile Body */
.profile-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

/* Photos Grid */
.photos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.photo-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
}

.photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.photo-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.photo-item:hover .photo-overlay {
    opacity: 1;
}

.photo-overlay i {
    color: white;
    font-size: 1.5rem;
}

/* About Section */
.about-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.bio-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 16px;
}

.bio-card h3 {
    margin: 0 0 12px 0;
    color: #1a1a1a;
    font-size: 1.2rem;
}

.bio-card p {
    margin: 0;
    color: #4b5563;
    line-height: 1.6;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.stat-card {
    background: white;
    padding: 16px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card i {
    font-size: 1.5rem;
    color: #3b82f6;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a1a;
}

.stat-label {
    font-size: 0.8rem;
    color: #64748b;
}

.interests-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 20px 0;
}

.interest-bubble {
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
    transition: transform 0.3s ease;
}

.interest-bubble:hover {
    transform: scale(1.05) !important;
}

/* Preferences Section */
.preferences-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.preference-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 16px;
}

.preference-card h3 {
    margin: 0 0 16px 0;
    color: #1a1a1a;
    font-size: 1.2rem;
}

.preference-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.preference-tag {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: white;
    border-radius: 20px;
    color: #4b5563;
    font-size: 0.9rem;
}

.preference-tag i {
    color: #3b82f6;
}

.location-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4b5563;
}

.location-info i {
    color: #3b82f6;
}

/* Action Bar */
.action-bar {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: white;
    border-top: 1px solid #f0f0f0;
}

.action-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button.message {
    background: #3b82f6;
    color: white;
}

.action-button.message:hover {
    background: #2563eb;
}

.action-button.unmatch {
    background: #f8f9fa;
    color: #ef4444;
}

.action-button.unmatch:hover {
    background: #fee2e2;
}

@media (max-width: 768px) {
    .hero-section {
        height: 50vh;
    }

    .profile-name {
        font-size: 2rem;
    }

    .profile-meta {
        font-size: 1rem;
    }

    .nav-item {
        padding: 8px;
        font-size: 0.8rem;
    }

    .nav-item i {
        font-size: 1.1rem;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .action-button {
        padding: 12px;
        font-size: 0.9rem;
    }
}
</style>