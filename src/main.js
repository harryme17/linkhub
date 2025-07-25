import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Set a base URL for all Axios requests
axios.defaults.baseURL = 'http://localhost/linkhub/api';
axios.defaults.withCredentials = true; // IMPORTANT: allows cookies to be sent

createApp(App).use(router).mount('#app')