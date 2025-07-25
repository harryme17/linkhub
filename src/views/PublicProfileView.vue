<template>
  <div class="profile-page">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="profile-container">
      <div class="profile-header">
        <!-- The img src is now dynamic -->
        <img :src="avatarSrc" alt="Avatar" class="avatar">
        <h1>@{{ profile.username }}</h1>
      </div>
      <div class="links-list">
        <a v-for="(link, index) in profile.links" :key="index" :href="link.url" target="_blank" class="link-button">
          {{ link.title }}
        </a>
        <p v-if="!profile.links.length" class="no-links">This user hasn't added any links yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const profile = ref({ username: '', links: [], avatar_url: null });

// A default placeholder for when no avatar is set
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgMy4zcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTkgNC0zLjA4IDYtMy4wOHM1Ljk2IDEuMDkgNiAzLjA4Yy0xLjI5IDEuOTQtMy41IDMuMjItNiAzLjIyeiIvPjwvc3ZnPg==';

// Computed property to decide which avatar to show
const avatarSrc = computed(() => {
  return profile.value.avatar_url 
    ? `http://localhost/linkhub/api/${profile.value.avatar_url}`
    : defaultAvatar;
});

onMounted(async () => {
  const username = route.params.username;
  try {
    const { data } = await axios.get(`/profile.php?user=${username}`);
    // More robust check to see if we got a valid user profile
    if (data.error || !data.username) {
        throw new Error(data.error || 'Profile data is incomplete.')
    }
    profile.value = data;
  } catch (err) {
    error.value = 'Profile not found.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-page { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px; box-sizing: border-box; }
.profile-container { max-width: 680px; margin: 0 auto; text-align: center; }
.avatar { 
  width: 96px; 
  height: 96px; 
  border-radius: 50%; 
  border: 4px solid white; 
  margin-bottom: 1rem; 
  object-fit: cover; /* Ensures non-square images look good */
  background-color: rgba(255, 255, 255, 0.2); /* BG for default SVG */
}
h1 { color: white; margin: 0 0 30px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.link-button {
  display: block;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 20px;
  margin: 16px 0;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.link-button:hover { transform: scale(1.05); background-color: white; }
.loading, .error, .no-links { color: white; font-size: 1.2rem; }
</style>