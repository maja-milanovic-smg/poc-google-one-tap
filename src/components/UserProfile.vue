<template>
  <div v-if="user" class="user-profile">
    <div class="profile-header">
      <img :src="user.picture" alt="Profile" class="profile-image" />
      <div class="profile-info">
        <h2>{{ user.name }}</h2>
        <p class="email">{{ user.email }}</p>
      </div>
    </div>
    <button @click="onLogout" class="logout-button">Logout</button>
  </div>
</template>

<script setup lang="ts">
import type { GoogleUser } from '../types/auth';
import { authStore } from '../stores/authStore';

const props = defineProps<{
  user: GoogleUser;
}>();

const onLogout = () => {
  if (window.google) {
    // Disable auto-selection to prevent automatic re-login
    window.google.accounts.id.disableAutoSelect();
  }
  authStore.logout();
};
</script>

<style scoped>
.user-profile {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px 0;
  max-width: 500px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 16px;
}

.profile-info {
  flex-grow: 1;
}

h2 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
}

.email {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style> 