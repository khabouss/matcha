<template>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
    />
  </head>
  <div class="sign-in-page">
    <div class="container">
      <div class="logo">
        <h2>Matcha <i class="fas fa-heart"></i></h2>
      </div>
      <form class="sign-in-form">
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Email" required />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <div class="options">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <button class="sign-in-button" @click="handleSignin">Sign In</button>

        <div class="social-sign-in">
          <button class="google-sign-in">Sign in with Google</button>
          <button class="facebook-sign-in">Sign in with Facebook</button>
        </div>
      </form>

      <div class="footer">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCFetch } from "~/composables/useCFetch";

const email = ref("");
const password = ref("");
const signinData = ref(null);

type SignInResponse = {
  status: string;
  data: {
    message: string;
    accesstoken: string;
    refreshToken: string;
    data: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      isVerfied: boolean;
      hasProfile: boolean | undefined;
    };
  };
};

async function handleSignin(e: MouseEvent) {
  try {
    e.preventDefault();
    const { data, error } = await useCFetch(
      "http://localhost:3001/auth/sign-in",
      {
        body: {
          username: email.value,
          password: password.value,
        },
        method: "POST",
      }
    );

    const response = data.value as SignInResponse;

    if (error.value) {
      console.error(error.value);
    }

    if (response.status === "success") {
      useCookie("access_token").value = response.data.accesstoken;
      useCookie("refresh_token").value = response.data.refreshToken;
      window.location.href =
        response.data.data.hasProfile !== undefined ? "/" : "/completeprofile";
    }
  } catch (e) {
    console.error(e);
  }
}
</script>

<style scoped>
.sign-in-page {
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

.sign-in-form .input-group input {
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

.sign-in-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #a7c957, #6a994e);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.social-sign-in button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.social-sign-in .google-sign-in {
  background-color: #4285f4;
  color: white;
}

.social-sign-in .facebook-sign-in {
  background-color: #1877f2;
  color: white;
}

.footer p {
  margin-top: 20px;
}

.footer a {
  color: #a7c957;
  text-decoration: none;
}
</style>
