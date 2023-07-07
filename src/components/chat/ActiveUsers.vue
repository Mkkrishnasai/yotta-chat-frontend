<template>
    <main>
      <div class="flex flex-row items-center justify-center h-12 w-full">
          <div
            class="flex items-center justify-center rounded-2xl text-blue-700 bg-blue-100 h-10 w-10"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div class="ml-2 font-bold text-2xl">Yotta Chat</div>
        </div>
        <div
          class="flex flex-col items-center bg-blue-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
        >
          <div class="h-20 w-20 rounded-full border overflow-hidden">
            <img
              src="@/assets/user.png"
              alt="Avatar"
              class="h-full w-full"
            />
          </div>
          <div class="text-sm font-semibold mt-2">{{ store.username }}</div>
          <button @click="logout" type="button" class="inline-flex items-center justify-center rounded-lg border h-10 p-5 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
              Logout
          </button>
        </div>
        <div class="flex flex-col mt-8 pl-40 pr-40">
          <div class="flex flex-row items-center justify-between text-xs">
            <span class="font-bold">Active Conversations</span>
            <span
              class="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
              >{{ ActiveUsers?.length }}</span
            >
          </div>
          <div class="flex flex-col space-y-1 mt-4 -mx-2 overflow-y-auto">
            <button
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
              v-for="u in ActiveUsers"
              @click="goToUserChat(u._id)"
            >
              <div
                class="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100"
              >
                {{ getInitials(u?.full_name) }}
              </div>
              <div class="ml-2 text-sm font-semibold">{{ u?.full_name }}</div>
            </button>
          </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import {userRoutes} from '../../router/routes';
import { useAuthStore } from '@/stores/auth';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_WEBSOCKET_URL,{
    transportOptions: {
        polling: {
            extraHeaders: {
                Authorization: localStorage.getItem('token'),
            }
        }
    }
});

export default {
  data() {
      return {
        users : [],
        baseUrl : import.meta.env.VITE_BASE_URL,
        store: useAuthStore(),
        socket: socket
      }
  },
  created(){
    this.getActiveUsers();
    this.socket.emit('login_user');
    this.socket.on('active_users', (data) => {
      if(this.users.filter(u => u._id == data._id).length == 0){
        this.users.push(data);
      }
    });
  },
  computed :{
    ActiveUsers(){
      return this.users.filter(f => f.username != this.store.username);
    }
  },
  methods : {
    logout(){
          this.store.logout();
          location.reload();
      },
    async getActiveUsers(){
        try {
                const response = await axios.get(this.baseUrl + userRoutes.getActiveUsers);
                if(response.data.status == true){
                    this.users = response.data.users;
                }else{
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error(error);
            }
    },
    getInitials(fullName) {
        const names = fullName.split(' ');
        const initials = names.map((name) => name.charAt(0).toUpperCase());
        return initials.join('');
    },
    goToUserChat(userId){
      this.$router.push({
        name : 'chat',
        params: {
          userid: userId
        }
      });
    }
  },
}
</script>