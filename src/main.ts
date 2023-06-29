import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css';

import App from './App.vue'
import router from './router'
const app = createApp(App)
  
app.use(createPinia())
import { useAuthStore } from './stores/auth';
import axios from 'axios';
const authStore = useAuthStore();
const token = authStore.token;
axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  app.use(router)

app.mount('#app')
