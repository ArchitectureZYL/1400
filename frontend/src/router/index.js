// 从 vue-router 库中导入创建路由和使用 HTML5 History 模式所需的函数
import {
  createRouter,
  createWebHistory
} from 'vue-router';
// 导入首页组件
import HomePage from '../views/home/HomePage.vue';
import ProfilePage from '@/views/profile/ProfilePage.vue';
import LoginPage from '@/views/login/LoginPage.vue';
import AddWorkPage from '@/views/add-work/AddWorkPage.vue';
import RegisterPage from '@/views/register/RegisterPage.vue';


const routes = [{
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/add-work',
    name: 'add-work',
    component: AddWorkPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;