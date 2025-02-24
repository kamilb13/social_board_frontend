import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home/Home.vue'
import Login from '../components/Login/Login.vue'
import Register from '../components/Register/Register.vue'
import Profile from '../components/Profile/Profile.vue'
import MyProfile from '../components/MyProfile/MyProfile.vue'
import NotFound from '../components/NotFound/NotFound.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true },
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/my-profile',
    component: MyProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
