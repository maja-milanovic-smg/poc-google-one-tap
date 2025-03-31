<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import Banner from './components/Banner.vue';
import GoogleOneTap from './components/GoogleOneTap.vue';
import UserProfile from './components/UserProfile.vue';
import { authStore } from './stores/authStore';
import type { GoogleUser } from './types/auth';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const GOOGLE_SECRET = import.meta.env.VITE_GOOGLE_SECRET;

const isAuthenticated = computed(() => authStore.state.isAuthenticated);
const user = computed(() => authStore.state.user);
const isHomePage = ref(true); // Track if we're on the homepage

const handleLoginSuccess = (googleUser: GoogleUser) => {
  authStore.login(googleUser);
};

const handleLoginError = (error: Error) => {
  console.error('Google One Tap login error:', error);
};

// Check if current path is homepage
const checkIsHomePage = () => {
  isHomePage.value = window.location.pathname === '/' || window.location.pathname === '/index.html';
};

onMounted(() => {
  authStore.initAuth();
  checkIsHomePage();
  
  // Add event listener for route changes (if using history API)
  window.addEventListener('popstate', checkIsHomePage);
});
</script>

<template>
  <div class="app-container">
    <Banner :message="isAuthenticated ? `Welcome, ${user?.given_name || 'User'}!` : 'Hello World'" />

    <div class="auth-container">
      <UserProfile v-if="isAuthenticated && user" :user="user" />
      <GoogleOneTap 
        v-else-if="isHomePage" 
        :client-id="GOOGLE_CLIENT_ID" 
        :showButton="false"
        @success="handleLoginSuccess" 
        @error="handleLoginError" 
      />
    </div>

    <div class="logo-container">
      <a href="https://vite.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <HelloWorld msg="Vite + Vue" />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.logo-container {
  display: flex;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
