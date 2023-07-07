<template>
    <main>
        <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen" :key="user._id">
            <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div class="relative flex items-center space-x-4">
                    <div class="relative">
                        <span class="absolute text-green-500 right-0 bottom-0">
                        <svg width="20" height="20">
                            <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                        </svg>
                        </span>
                    <img src="@/assets/user.png" alt="" class="w-10 sm:w-16 h-10 sm:h-16 rounded-full">
                    </div>
                    <div class="flex flex-col leading-tight">
                        <div class="text-2xl mt-1 flex items-center">
                        <span class="text-gray-700 mr-3">{{ user?.full_name }}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button type="button" @click="$router.push({name: 'users'})" class="inline-flex items-center justify-center rounded-lg border h-10 p-5 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        User List
                    </button>
                    <button @click="logout" type="button" class="inline-flex items-center justify-center rounded-lg border h-10 p-5 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                        Logout
                    </button>
                </div>
            </div>
            <div id="messages" class="flex flex-col h-full space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                <div class="chat-message" v-for="m in chats">
                    <div class="flex items-end" :class="(!m.from || m.from != this.user._id) ? 'justify-end' : ''">
                        <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2" :class="(!m.from || m.from != this.user._id) ? 'order-1 items-end' : 'order-2 items-start'">
                            <div><span class="px-4 py-2 rounded-lg inline-block rounded-bl-none " :class="(!m.from || m.from != this.user._id) ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'">
                                <span v-if="isEdit == m.mid">
                                    <input type="text" v-model="newMessage" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3">
                                </span>
                                <span v-else>
                                    {{ m?.message }}
                                </span>
                            </span></div>
                            <div v-if="(!m.from || m.from != this.user._id) && isEdit != m.mid" class="flex items-end p-2">
                                <button @click="editChat(m)" type="button" class="flex items-center justify-center bg-gray-300 h-6 w-6 rounded-full mr-2">
                                    <i class="fa fa-pen"></i>
                                </button>
                                <button @click="deleteMessage(m.mid)" type="button" class="flex items-center justify-center bg-gray-300 h-6 w-6 rounded-full">
                                    <i class="fa fa-trash text-red-600"></i>
                                </button>
                            </div>
                            <div v-if="(!m.from || m.from != this.user._id) && isEdit == m.mid" class="flex items-end p-2">
                                <button @click="updateChat" class="flex items-center justify-center bg-green-600 text-white h-6 p-4 rounded-full mr-2">
                                    save message
                                </button>
                            </div>
                        </div>
                        <img src="@/assets/user.png" alt="My profile" class="w-6 h-6 rounded-full order-1" :class="(!m.from || m.from != this.user._id) ? 'mb-12' : ''">
                    </div>
                </div>
            </div>
            <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                <div class="relative flex">
                    <input type="text" v-model="message" placeholder="Write your message!" class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3">
                    <div class="absolute right-0 items-center inset-y-0 sm:flex">
                        <button @click="saveChat" type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                        <span class="font-bold">Send</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>

<script>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { userRoutes } from '../../router/routes';
import io from 'socket.io-client';
import Swal from 'sweetalert2';
import userImage from '@/assets/user.png';

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
    props: ['to'],
    data(){
        return {
            store: useAuthStore(),
            baseUrl : import.meta.env.VITE_BASE_URL,
            chats : [],
            message: '',
            socket: socket,
            user : {},
            isEdit : null,
            newMessage: '',
        }
    },
    async created(){
        this.socket.emit('login_user');
        await this.getUserDetails();
        await this.getChat();
        this.socket.on('message', async (data) => {
            if(data.from  == this.user._id){
                this.chats.push(data)
            }else{
                let user = await this.getUserDetails(data.from);
                
                Swal.fire({
                    position: 'top-end',
                    html: `
                    <div class="flex items-center p-4 bg-white rounded-lg shadow-xl mx-auto max-w-sm relative m-10">
                        <span class="text-xs font-bold uppercase px-2 mt-2 mr-2 text-green-900 bg-green-400 border rounded-full absolute top-0 right-0">New</span>
                        <img class="h-12 w-12 rounded-full" alt="John Doe's avatar"
                        src="${userImage}" />

                        <div class="ml-5">
                        <h4 class="text-lg font-semibold leading-tight text-gray-900">${user?.full_name}</h4>
                        <p class="text-sm text-gray-600">${data.message}</p>
                        </div>
                    </div>
                    `,
                    showCloseButton: false,
                    showConfirmButton: false,
                    toast: true,
                    background: 'transparent',
                    showClass: {
                    popup: '',
                    },
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                        toast.addEventListener('click', () => {
                            location.href = '/chat/'+user._id;
                        });
                    },
                });
            }
        });
        this.socket.on('edited_message', (data) => {
            this.chats = this.chats.map(d => {
                if(d.mid == data.mid){
                    d.message = data.message
                }
                return d;
            });
        });
        this.socket.on('deleted_message', (data) => {
            this.chats = this.chats.filter(d => d.mid != data.mid);
        });
        this.scrollToBottom();
    },
    methods : {
        logout(){
            this.store.logout();
            location.reload();
        },
        scrollToBottom(){
            const messagesDiv = document.getElementById('messages');
            if(messagesDiv){
                messagesDiv.scrollTop = messagesDiv.scrollHeight + 100;
            }
        },
        async editChat(m){
            this.isEdit = m.mid;
            this.newMessage = m.message;
        },
        async updateChat(){
            try {
                await axios.post(this.baseUrl + userRoutes.updateMessage + '/' + this.isEdit,{
                    message:  this.newMessage
                });
                this.socket.emit('edit_message',{
                    mid : this.isEdit,
                    to : this.$route.params.userid,
                    message : this.newMessage
                });
                this.chats = this.chats.map(c => {
                    if(c.mid == this.isEdit){
                        c.message = this.newMessage;
                    }
                    return c;
                });
                this.isEdit = null;
                this.newMessage = '';
            } catch (error) {
                console.log(error);
            }   
        },
        async deleteMessage(chat_id){
            try {
                await axios.post(this.baseUrl + userRoutes.deleteMessage + '/' + chat_id);
                this.socket.emit('delete_message',{
                    mid : chat_id,
                    to : this.$route.params.userid
                });
                this.chats = this.chats.filter(f => f.mid != chat_id);
            } catch (error) {
                console.log(error);
            }
        },
        async getChat(){
            try {
                console.log(this.user);
                
                let response = await axios.get(this.baseUrl + userRoutes.chat,{
                    params : {
                        to : this.user._id
                    }
                });
                if(response.data.status){
                    this.chats = response.data.chats.map(m => {
                        m.mid = m._id;
                        return m;
                    });
                }
                throw new Error(response.data.message);
            } catch (error) {
                console.log(error);
            }
        },
        async getUserDetails(user_id = null){
            try {
                let response = await axios.get(this.baseUrl + userRoutes.userDetails + '/' + (user_id != null ? user_id : this.$route.params.userid));
                if(response.data.status){
                    if(user_id == null){
                        this.user = response.data.users;
                    }else{
                        return response.data.users;
                    }
                }
                throw new Error(response.data.message);
            } catch (error) {
                console.log(error);
            }
        },
        async saveChat(){
            try {
                if(this.message == '' || this.message == null){
                    return;
                }
                let response = await axios.post(this.baseUrl + userRoutes.chat,{
                    message : this.message,
                    to: this.$route.params.userid
                });
                if(response.data.status){
                    this.chats.push({
                        mid : response.data.chat._id,
                        to: this.$route.params.userid,
                        message : this.message
                    })
                    this.socket.emit('message',{
                        mid : response.data.chat._id,
                        to: this.$route.params.userid,
                        message : this.message
                    });
                }
                this.message = null;
                throw new Error(response.data.message);
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>
<style> 
    .swal2-popup.swal2-toast {
        box-shadow : none !important;
    }
</style>