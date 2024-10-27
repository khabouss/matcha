<template>

    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <div class="sign-up-page">
        <div class="container">

            <div class="logo">
                <h2>Matcha <i class="fas fa-heart"></i></h2>
            </div>

            <div class="verification-container">
                <div v-if="loading" class="loading-container">
                    <div class="spinner"></div>
                    <p>Verifying your account, please wait...</p>
                </div>
                <div v-else-if="verified" class="success-message">
                    <h2>Account Verified</h2>
                    <p>Your account has been successfully verified! You can now log in.</p>
                    <NuxtLink to="/login" class="btn">Go to Login</NuxtLink>
                </div>
                <div v-else class="error-message">
                    <h2>Verification Failed</h2>
                    <p>We couldn't verify your account. The link may be invalid or expired.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'nuxt/app'

const loading = ref(true)
const verified = ref(false)
const router = useRouter()

onMounted(async () => {
    const token = router.currentRoute.value.query.token
    try {
        // Send the token to the backend for verification
        const response = await $fetch('http://localhost:3001/auth/verify-account', {
            method: 'POST',
            body: { token }
        })
        console.log(response);
        if (response.success) {
            verified.value = true
        } else {
            verified.value = false
        }
    } catch (error) {
        verified.value = false
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.sign-up-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(15deg, #d894df, #c4ffec);
}

.container {
    max-width: 400px;
    width: 100%;
    margin: 1rem;
    background-color: white;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

.logo img {
    max-width: 100px;
    margin-bottom: 10px;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
}

.sign-up-form .input-group input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.sign-up-button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(45deg, #A7C957, #6A994E);
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}

.social-sign-up {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.social-sign-up button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.social-sign-up .google-sign-up {
    background-color: #4285F4;
    color: white;
}

.social-sign-up .facebook-sign-up {
    background-color: #1877F2;
    color: white;
}

.footer p {
    margin-top: 20px;
}

.footer a {
    color: #A7C957;
    text-decoration: none;
}

.verification-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #ccc;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  display: inline-flex;
  align-items: center;
}

.success-message, .error-message {
  max-width: 400px;
}

h2 {
  margin-bottom: 16px;
  color: #333;
}

p {
  color: #555;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}

.btn:hover {
  background-color: #0056b3;
}
</style>