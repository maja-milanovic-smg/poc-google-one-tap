<template>
  <!-- Empty div to avoid errors, but we won't render the button -->
  <div id="google-one-tap-container" style="display: none;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import type { GoogleUser } from '../types/auth';

const props = defineProps<{
  clientId: string;
  showButton?: boolean; // Optional prop to control button visibility
}>();

const emit = defineEmits<{
  (e: 'success', user: GoogleUser): void;
  (e: 'error', error: Error): void;
}>();

const scriptLoaded = ref(false);

function handleCredentialResponse(response: any) {
  try {
    const credential = response.credential;
    const decodedUser = jwtDecode<GoogleUser>(credential);
    
    emit('success', decodedUser);
  } catch (error) {
    emit('error', error as Error);
  }
}

function loadGoogleScript() {
  if (scriptLoaded.value) return;
  
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    scriptLoaded.value = true;
    initGoogleOneTap();
  };
  
  script.onerror = (error) => {
    emit('error', new Error('Failed to load Google One Tap script'));
  };
  
  document.head.appendChild(script);
}

function initGoogleOneTap() {
  if (!window.google || !scriptLoaded.value) return;
  
  window.google.accounts.id.initialize({
    client_id: props.clientId,
    callback: handleCredentialResponse,
    auto_select: true,
    cancel_on_tap_outside: false
  });
  
  // Only render the button if showButton is true
  if (props.showButton) {
    window.google.accounts.id.renderButton(
      document.getElementById('google-one-tap-container')!,
      { theme: 'outline', size: 'large' }
    );
  }
  
  // Always prompt the One Tap UI
  window.google.accounts.id.prompt();
}

onMounted(() => {
  loadGoogleScript();
});
</script>

<style scoped>
#google-one-tap-container {
  margin: 20px 0;
}
</style> 