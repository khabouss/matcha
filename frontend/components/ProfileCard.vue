<template>
    <div @click="changeRoute">
        <img v-if="props.profile?.image?.length > 0" :src="props.profile.image[0]" alt="Profile image"
            class="profile-image" />
        <div class="profile-info">
            <h3>{{ props.profile.name }}, {{ props.profile.age }}</h3>
            <p>{{ props.profile.bio }}</p>
        </div>
        <div v-if="route.path !== '/'">
            <img v-if="props.profile?.image?.length > 1" :src="props.profile.image[1]" alt="Profile image"
                class="profile-image" />
            <div class="profile-info">
                <h4>About me</h4>
                <div class="about">
                    <p v-for="key of props.profile.about" class="profile-tag">{{ key }}</p>
                </div>
            </div>
            <img v-if="props.profile?.image?.length > 2" :src="props.profile.image[2]" alt="Profile image"
                class="profile-image" />
            <img v-if="props.profile?.image?.length > 3" :src="props.profile.image[3]" alt="Profile image"
                class="profile-image" />
            <div class="profile-info">
                <h4>Languages</h4>
                <div class="about">
                    <p v-for="key of props.profile.languages" class="profile-tag">{{ key }}</p>
                </div>
            </div>
            <img v-if="props.profile?.image?.length > 4" :src="props.profile.image[4]" alt="Profile image"
                class="profile-image" />
            <div class="profile-info">
                <h4>Location</h4>
                <div class="about">
                    <p class="profile-tag">{{ props.profile.lastLocation }}</p>
                </div>
            </div>

            <div class="profile-info">
                <h4>Online status</h4>
                <div class="about">
                    <p class="profile-tag">{{ props.profile.lastOnlineStatus }}</p>
                </div>
            </div>

            <h4 style="margin-left: 1rem; margin-top: 1rem;">Actions</h4>
            <div class="actions">
                <div class="unmatch" v-if="props.profile.isMatch">
                    <p style="width: fit-content;">Unmatch</p>
                    <svg viewBox="0 0 24 24" width="30px" height="30px" fill="none" xmlns="http://www.w3.org/2000/svg"
                        stroke="#e25555">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M4.42602 12.3115L12 19.8854L19.574 12.3115C21.4753 10.4101 21.4753 7.32738 19.574 5.42602C17.6726 3.52466 14.5899 3.52466 12.6885 5.42602L12 6.11456L11.3115 5.42602C9.4101 3.52466 6.32738 3.52466 4.42602 5.42602C2.52466 7.32738 2.52466 10.4101 4.42602 12.3115Z"
                                stroke="#f27d7d" stroke-width="2" stroke-linejoin="round"></path>
                            <path d="M12 6L10 9.99995L14 11L12 14" stroke="#f27d7d" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </div>

                <div class="unmatch" v-if="props.profile.isMatch">
                    <p style="width: fit-content;">Block</p>
                    <svg viewBox="0 0 24 24" width="30px" height="30px" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M5.63605 18.364L18.364 5.63603M5.63605 5.63603L18.364 18.364M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="#f27d7d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </g>
                    </svg>
                </div>

                <div class="unmatch" v-if="props.profile.isMatch">
                    <p style="width: fit-content;">Report</p>
                    <svg width="30px" height="30px" viewBox="-7.14 -7.14 35.28 35.28" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <title>report_flag [#1420]</title>
                            <desc>Created with Sketch.</desc>
                            <defs> </defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Dribbble-Light-Preview" transform="translate(-59.000000, -640.000000)"
                                    fill="#f27d7d">
                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path
                                            d="M7.2,492 L24,492 L24,480 L7.2,480 L7.2,492 Z M3,500 L5.1,500 L5.1,480 L3,480 L3,500 Z"
                                            id="report_flag-[#1420]"> </path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const props = defineProps({
    profile: {
        type: Object,
        required: true
    }
})

function changeRoute() {
    if (route.path )
    window.location.href = `/${props.profile.username}`;
}
</script>

<style>
.profile-image {
    width: 100%;
    height: 45vh;
    object-fit: cover;
}

.unmatch {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 1rem;
}

.unmatch p {
    color: #f27d7d;
}

.actions {
    display: flex;
}

.profile-info {
    padding: 1rem;
    width: 100%;
}

.profile-info h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.profile-info h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.about {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    gap: 10px;
}

.profile-info p {
    color: #555;
}

.profile-tag {
    background-color: #ebebeb;
    border-radius: 10px;
    width: fit-content;
    padding: 8px;
}
</style>