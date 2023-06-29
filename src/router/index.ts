import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat/:userid',
      name: 'chat',
      meta : {
        requiresAuth: true
      },
      component: () => import('../views/Chat.vue')
    },
    {
      path: '/users',
      name: 'users',
      meta : {
        requiresAuth: true
      },
      component: () => import('../views/Users.vue')
    },
    {
      path: '/register',
      name: 'Register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Register.vue')
    },
    {
      path: '/login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login.vue')
    }
  ]
});

function isAuthenticated(){
  let token = localStorage.getItem('token');
  if(token == null) return null;
  return true;
}

router.beforeEach((to, from, next) => {
  // Example: Redirect to login if not authenticated
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' });
  }else if(!to.meta.requiresAuth && isAuthenticated()){
    next({name: 'users'})
  } else {
    next(); // Proceed to the next route
  }
});

export default router
