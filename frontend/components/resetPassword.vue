<template>
    <div class="reset-password-container">
        <h2>Reset Password</h2>
        <form @submit.prevent="handleSubmit" v-if="confirmationBegun">
            <div class="form-group">
                <label for="newPassword">New Password</label>
                <input v-model="newPassword" type="password" id="newPassword" placeholder="Enter new password"
                    required />
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="Confirm new password"
                    required />
            </div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button type="submit" class="btn" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                Reset Password
            </button>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
        <form @submit.prevent="handleSubmitReset" v-else>
            
            <div class="form-group">
                <label for="newPassword">Email or Username</label>
                <input v-model="newPassword" type="text" id="email" placeholder="Email or Username"
                    required />
            </div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button type="submit" class="btn" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                Reset Password
            </button>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'nuxt/app'

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()
const route = useRoute()
const confirmationBegun = ref(false)

onMounted(() => {
    confirmationBegun.value = route.query?.token !== undefined;
})

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
    }

    loading.value = true
    const token = router.currentRoute.value.query.token

    try {
        const response: any = await $fetch('/api/reset-password', {
            method: 'POST',
            body: { token, password: newPassword.value }
        })

        if (response.success) {
            successMessage.value = 'Password successfully reset! You can now log in.'
        } else {
            errorMessage.value = 'Failed to reset password. The link may be invalid or expired.'
        }
    } catch (error) {
        errorMessage.value = 'An error occurred. Please try again later.'
    } finally {
        loading.value = false
    }
}

function handleSubmitReset() {
    successMessage.value = 'An email has been sent to you, please check your emails'
}
</script>

<style scoped>
.reset-password-container {
    max-width: 400px;
    margin: auto;
    text-align: center;

}

h2 {
    margin-bottom: 24px;
    color: #333;
}

.form-group {
    margin-bottom: 16px;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #555;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.error-message {
    color: #ff4d4f;
    margin-bottom: 16px;
}

.success-message {
    color: #28a745;
    margin-top: 16px;
}

.btn {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.btn:disabled {
    background-color: #007bff77;
}

.loading-spinner {
    width: 18px;
    height: 18px;
    border: 3px solid white;
    border-top: 3px solid #ccc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 8px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>