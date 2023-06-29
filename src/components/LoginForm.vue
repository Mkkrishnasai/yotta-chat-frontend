<template>
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Login
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input type="username" v-model="username" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required="">
                            <span class="text-red-600" v-if="errors.includes('username')">Please Fill Username</span>
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" v-model="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                            <span class="text-red-600" v-if="errors.includes('password')">Please Fill Password</span>
                        </div>
                        <button type="button" @click="loginUser" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            New User ? <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500"><RouterLink to="/register">Signup here</RouterLink></a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { userRoutes } from '@/router/routes';
import { useAuthStore } from '@/stores/auth';
export default {
    data(){
        return {
            username: null,
            password: null,
            errors : [],
            baseUrl: import.meta.env.VITE_BASE_URL
        }
    },
    methods : {
        async loginUser(){
            await this.validateRequest()
            try{
                let response = await axios.post(this.baseUrl+userRoutes.loginUser,{
                    username: this.username,
                    password:  this.password
                });
                if(response.data.status == true){
                    Swal.fire({
                        title: 'Success !',
                        text: 'Successfully Logged In',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    const authStore = useAuthStore();
                    authStore.login(response.data.access_token,response.data.username);
                    this.$router.push({name: 'users'});
                }else{
                    throw new Error("Invalid Credentials! Please try again.")
                }
            }catch(error){
                console.log(error);
                Swal.fire({
                        title: 'Error !',
                        text: error?.message,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
            }
        },
        validateRequest(){
            this.errors = [];
            if(!this.username){
                this.errors?.push('username');
            }
            if(!this.password){
                this.errors?.push('password');
            }
        }
    },
}
</script>