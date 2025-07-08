import { createRouter, createWebHistory } from 'vue-router'
import GamePage from "../components/feature/game/src/pages/GamePage.vue";
import HomePage from '../components/feature/home/src/pages/HomePage.vue';
import LoginPage from '../components/feature/login/src/pages/LoginPage.vue';
import Locker from '../components/feature/shop/pages/Locker.vue'

const routes = [
  { path: '/', component: HomePage},
  { path: '/login', component: LoginPage },
  { path: '/ingame', component: GamePage },
  { path: '/locker', component: Locker }
]

const router = createRouter({
  history: createWebHistory('/Pillenschlucker3000/'),
  routes
})

export default router
