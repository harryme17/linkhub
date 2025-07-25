<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>{{ isLogin ? 'Login' : 'Register' }} to LinkHub</h1>
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="username" placeholder="Username" required>
        <input type="password" v-model="password" placeholder="Password" required>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
      </form>
      <a href="#" @click.prevent="isLogin = !isLogin">
        {{ isLogin ? 'Need an account? Register' : 'Have an account? Login' }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  const url = isLogin.value ? '/login.php' : '/register.php';
  try {
    const response = await axios.post(url, {
      username: username.value,
      password: password.value
    });
    if (response.data.success) {
      if (isLogin.value) {
        router.push('/admin');
      } else {
        alert('Registration successful! Please log in.');
        isLogin.value = true;
        password.value = '';
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred.';
  }
};
</script>

<style scoped>
.auth-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.auth-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; width: 360px; }
h1 { margin-top: 0; font-size: 24px; }
input { display: block; width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
button { width: 100%; padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
button:hover { background-color: #0056b3; }
.error { color: #dc3545; margin-bottom: 15px; }
a { display: block; margin-top: 20px; color: #007bff; text-decoration: none; }
</style>