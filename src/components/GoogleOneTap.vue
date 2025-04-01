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
  (e: 'shown'): void;           // New event when One Tap UI is shown
  (e: 'dismissed', reason: string): void;  // New event when One Tap is dismissed
}>();

const scriptLoaded = ref(false);
// let isShown = false; // Track if One Tap has been shown
let isShown = ref(false); // Track if One Tap has been shown

function handleCredentialResponse(response: any) {
  try {
    const credential = response.credential;
    const decodedUser = jwtDecode<GoogleUser>(credential);
    
    // Extract and log the email from the decoded token
    const email = decodedUser.email;
    console.log('Authenticated user email:', email);
    
    // Also log the full decoded token for reference
    console.log('Full decoded Google ID token:', decodedUser);

    // Log the sign-in success event
    console.log('One Tap Sign-In Success', { email });
    logAnalyticsEvent('One Tap Sign-In Success', { 
      email, 
      method: 'Google One Tap',
      timestamp: new Date().toISOString()
    });

    emit('success', decodedUser);
  } catch (error) {
    console.error('Error decoding Google ID token:', error);
    
    // Log the sign-in failure
    console.log('One Tap Sign-In Failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    logAnalyticsEvent('One Tap Sign-In Failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      method: 'Google One Tap',
      timestamp: new Date().toISOString()
    });
    
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
    console.error('Failed to load Google One Tap script');
    emit('error', new Error('Failed to load Google One Tap script'));
  };

  document.head.appendChild(script);

  console.log('Google One Tap script loaded');
}

function initGoogleOneTap() {
  if (!window.google || !scriptLoaded.value) return;

  window.google.accounts.id.initialize({
    client_id: props.clientId,
    callback: handleCredentialResponse,
    // auto_select: true,
    cancel_on_tap_outside: false,
    itp_support: true,
    use_fedcm_for_prompt: true // Explicitly opt in to FedCM
  });

  // Only render the button if showButton is true
  if (props.showButton) {
    window.google.accounts.id.renderButton(
      document.getElementById('google-one-tap-container')!,
      { theme: 'outline', size: 'large' }
    );
  }

  // Always prompt the One Tap UI with notification callback to track events
  window.google.accounts.id.prompt();
}

// Helper function for sending analytics events
// This could be replaced with actual analytics implementation
function logAnalyticsEvent(eventName: string, eventData: Record<string, any>) {
  // This is a placeholder for your actual analytics implementation
  // For example, you might use Google Analytics, Mixpanel, or a custom solution
  console.log(`ANALYTICS EVENT: ${eventName}`, eventData);
  
  // If you have a real analytics implementation, call it here
  // Example: window.gtag('event', eventName, eventData);
  // Example: window.mixpanel.track(eventName, eventData);
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