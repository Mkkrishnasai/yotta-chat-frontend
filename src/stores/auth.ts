import { defineStore } from 'pinia';
import { ref } from 'vue'
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        username: localStorage.getItem('username') || '',
    }),
    actions: {
        login(userToken: string, userUsername: string) {
          this.token = userToken;
          this.username = userUsername;
          localStorage.setItem('token', userToken);
          localStorage.setItem('username', userUsername);
          axios.interceptors.request.use(
              (config) => {
                  if (this.token) {
                  config.headers['Authorization'] = `Bearer ${this.token}`;
                  }
              
                  return config;
              },
              (error) => {
                  return Promise.reject(error);
              }
            );
        },
        logout() {
          this.token = '';
          this.username = '';
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        },
      },
});
