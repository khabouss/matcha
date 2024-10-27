<template>

    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <div class="sign-up-page">
        <div class="container" v-if="!verify">

            <div class="logo">
                <h2>Matcha <i class="fas fa-heart"></i></h2>
            </div>

            <form class="sign-up-form">
                <div class="input-group">
                    <input type="text" v-model="userName" placeholder="Username" required />
                    <input type="text" v-model="firstName" placeholder="First Name" required />
                    <input type="text" v-model="lastName" placeholder="Last Name" required />
                    <input type="email" v-model="email" placeholder="Email" required />
                    <input type="password" v-model="password" placeholder="Password" required />
                    <input type="password" v-model="confirmPassword" placeholder="Re enter password" required />
                </div>

                <button class="sign-up-button" @click="handleSignup">Sign Up</button>

                <div class="social-sign-up">
                    <button class="google-sign-up">Sign up with Google</button>
                    <button class="facebook-sign-up">Sign up with Facebook</button>
                </div>
            </form>

            <div class="footer">
                <p>You have an account? <a href="/signin">Sign in</a></p>
            </div>
        </div>
        <div class="container" v-else>
            <verify-your-email/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useCFetch } from '~/composables/useCFetch';

const userName = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const verify = ref(false);

type SignUpResponse = {
    status: string;
};


async function handleSignup(e: MouseEvent) {
    try {
        e.preventDefault();
        const { data, error } = await useCFetch('http://localhost:3001/auth/sign-up', {
            body: {
                "userName": userName.value,
                "firstName": firstName.value,
                "lastName": lastName.value,
                "email": email.value,
                "password": password.value,
            }
            ,
            method: 'POST'
        })

        const response = data.value as SignUpResponse;

        if (error.value) {            
            alert(error.value.data.error)
        }

        if (response.status === 'success') {
            verify.value = true;
        }
    } catch (e) {
        console.error(e);
    }

}
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
</style>