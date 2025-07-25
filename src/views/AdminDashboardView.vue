<template>
  <div class="admin-container">
    <header class="admin-header">
      <!-- START: New Avatar Section -->
      <div class="avatar-section">
        <img :src="avatarPreview" alt="Avatar" class="admin-avatar" @click="triggerFileInput" title="Click to change avatar">
        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" style="display: none;">
        <div class="user-info">
          <h1>My Links</h1>
          <span>Welcome, {{ username }}!</span>
        </div>
      </div>
      <!-- END: New Avatar Section -->
      <div>
        <a :href="`/${username}`" target="_blank" class="public-link">View Public Page</a>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </header>

    <div class="add-link-form">
      <h3>Add a New Link</h3>
      <form @submit.prevent="addLink">
        <input v-model="newLink.title" placeholder="Link Title (e.g., My Portfolio)" required>
        <input v-model="newLink.url" type="url" placeholder="URL (e.g., https://...)" required>
        <button type="submit">Add Link</button>
      </form>
    </div>

    <div class="links-list">
      <div v-for="link in links" :key="link.id" class="link-item">
        <div class="link-info">
          <input v-model="link.title" @change="updateLink(link)" class="title-input">
          <input v-model="link.url" @change="updateLink(link)" class="url-input">
        </div>
        <div class="link-actions">
          <label class="switch">
            <input type="checkbox" v-model="link.is_active" @change="updateLink(link)">
            <span class="slider"></span>
          </label>
          <button @click="deleteLink(link.id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const links = ref([]);
const username = ref('');
const router = useRouter();
const newLink = reactive({ title: '', url: '' });

// --- START: Avatar Logic ---
const fileInput = ref(null);
const userAvatar = ref(null);
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NkZGJlNiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgMy4zcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtM3ptMCAxNC4yYy0yLjUgMC00LjcxLTEuMjgtNi0zLjIyLjAzLTEuOTkgNC0zLjA4IDYtMy4wOHM1Ljk2IDEuMDkgNiAzLjA4Yy0xLjI5IDEuOTQtMy41IDMuMjItNiAzLjIyeiIvPjwvc3ZnPg=='; // Placeholder SVG

const avatarPreview = computed(() => {
  // Construct full URL and add a timestamp to prevent browser caching issues after upload
  return userAvatar.value ? `http://localhost/linkhub/api/${userAvatar.value}?t=${new Date().getTime()}` : defaultAvatar;
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  uploadAvatar(file);
};

const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const { data } = await axios.post('/upload_avatar.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (data.success) {
      userAvatar.value = data.avatar_url; // Update the local state to show the new image
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to upload avatar.');
  }
};
// --- END: Avatar Logic ---

const fetchLinks = async () => {
  try {
    const { data } = await axios.get('/links_handler.php');
    links.value = data.map(link => ({...link, is_active: !!parseInt(link.is_active)}));
  } catch (error) {
    console.error('Failed to fetch links:', error);
    router.push('/');
  }
};

const fetchSession = async () => {
  try {
    const { data } = await axios.get('/session.php');
    if (data.loggedIn) {
      username.value = data.username;
      userAvatar.value = data.avatar_url; // Get avatar from session
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Session check failed:', error);
    router.push('/');
  }
}

onMounted(() => {
  fetchSession();
  fetchLinks();
});

const addLink = async () => {
  try {
    await axios.post('/links_handler.php', {
      action: 'create',
      title: newLink.title,
      url: newLink.url,
    });
    newLink.title = '';
    newLink.url = '';
    fetchLinks();
  } catch (error) {
    console.error('Failed to add link:', error);
  }
};

const updateLink = async (link) => {
  try {
    await axios.post('/links_handler.php', {
      action: 'update',
      id: link.id,
      title: link.title,
      url: link.url,
      is_active: link.is_active ? 1 : 0,
    });
  } catch (error) {
    console.error('Failed to update link:', error);
  }
};

const deleteLink = async (id) => {
  if (!confirm('Are you sure you want to delete this link?')) return;
  try {
    await axios.post('/links_handler.php', {
      action: 'delete',
      id: id,
    });
    fetchLinks();
  } catch (error) {
    console.error('Failed to delete link:', error);
  }
};

const logout = async () => {
  await axios.post('/logout.php');
  router.push('/');
};
</script>

<style scoped>
.admin-container { max-width: 800px; margin: 40px auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.admin-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
.admin-header > div:last-child { display: flex; align-items: center; gap: 15px; margin-top: 10px; }
.public-link { text-decoration: none; color: #007bff; }
.logout-btn { background: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; }

/* Avatar Styles */
.avatar-section { display: flex; align-items: center; gap: 15px; }
.admin-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2px solid #ddd; background-color: #f0f2f5; }
.user-info { display: flex; flex-direction: column; }
.user-info h1 { margin: 0; line-height: 1.2; font-size: 24px; }
.user-info span { margin-top: 5px; color: #555; }

/* Form & Link Styles */
.add-link-form { margin-bottom: 30px; }
.add-link-form input { padding: 10px; margin-right: 10px; border: 1px solid #ccc; border-radius: 6px; width: 300px; }
.add-link-form button { padding: 10px 20px; background-color: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; }
.link-item { display: flex; align-items: center; justify-content: space-between; padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; }
.link-info { display: flex; flex-direction: column; flex-grow: 1; margin-right: 15px; }
.link-info input { padding: 8px; border: 1px solid transparent; border-radius: 4px; }
.link-info input:focus { border-color: #007bff; background: #f8f9fa; }
.title-input { font-weight: bold; }
.url-input { font-size: 0.9em; color: #666; }
.link-actions { display: flex; align-items: center; gap: 20px; }
.delete-btn { background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }

/* Toggle Switch */
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #28a745; }
input:checked + .slider:before { transform: translateX(20px); }
</style>