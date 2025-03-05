<template>
  <div class="min-h-screen bg-gradient-to-b from-[#00B4D8]/10 to-white flex flex-col items-center justify-center px-4 md:px-8">
    <!-- 背景装饰 -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-[#00B4D8]/20 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#00B4D8]/20 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
    </div>
    <!-- 主要内容 -->
    <div class="relative w-full max-w-md">
      <!-- 注册表单 -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <!-- Logo区域 -->
        <div class="mb-12 text-center">
          <h1 class="text-2xl font-semibold text-gray-800 mb-3">注册新账号</h1>
          <p class="text-gray-500">请填写以下信息进行注册</p>
        </div>
        <div class="relative mb-6">
          <img src="@/assets/icons/user.svg"
               alt="User Icon"
               class="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00B4D8] icon-size" />
          <input type="text"
                 v-model="username"
                 placeholder="请输入账号"
                 class="w-full h-12 pl-12 pr-4 text-gray-700 placeholder-gray-400 border-none rounded-xl bg-[#00B4D8]/5 focus:bg-[#00B4D8]/10 focus:ring-2 focus:ring-[#00B4D8] transition-all duration-200 text-base" />
        </div>
        <div class="relative mb-6">
          <img src="@/assets/icons/lock.svg"
               alt="Lock Icon"
               class="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00B4D8] icon-size" />
          <input :type="showPassword ? 'text' : 'password'"
                 v-model="password"
                 placeholder="请输入密码"
                 class="w-full h-12 pl-12 pr-12 text-gray-700 placeholder-gray-400 border-none rounded-xl bg-[#00B4D8]/5 focus:bg-[#00B4D8]/10 focus:ring-2 focus:ring-[#00B4D8] transition-all duration-200 text-base" />
          <button @click="togglePassword"
                  class="absolute right-1 top-1/2 transform -translate-y-1/4 text-[#00B4D8] hover:text-[#0077B6] transition-colors">
          </button>
        </div>
        <div class="relative mb-8">
          <img src="@/assets/icons/lock.svg"
               alt="Lock Icon"
               class="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00B4D8] icon-size" />
          <input :type="showConfirmPassword ? 'text' : 'password'"
                 v-model="confirmPassword"
                 placeholder="请确认密码"
                 class="w-full h-12 pl-12 pr-12 text-gray-700 placeholder-gray-400 border-none rounded-xl bg-[#00B4D8]/5 focus:bg-[#00B4D8]/10 focus:ring-2 focus:ring-[#00B4D8] transition-all duration-200 text-base" />
          <button @click="toggleConfirmPassword"
                  class="absolute right-1 top-1/2 transform -translate-y-1/4 text-[#00B4D8] hover:text-[#0077B6] transition-colors">
          </button>
        </div>
        <button @click="handleRegister"
                class="w-full h-12 bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white font-medium rounded-xl hover:from-[#0077B6] hover:to-[#023E8A] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00B4D8]/25 !rounded-button text-base">
          注册
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios.config';
// 引入 useRouter
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const router = useRouter();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const showNotification = (message, type = 'error') => {
  const notification = document.createElement('div');
  const bgClass = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const borderClass = type === 'error' ? 'border-red-400' : 'border-green-400';
  const textClass = type === 'error' ? 'text-red-700' : 'text-green-700';
  notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgClass} ${borderClass} border px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${textClass}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
};

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    const errorMessage = !username.value ? '请输入账号' : (!password.value ? '请输入密码' : '请确认密码');
    showNotification(errorMessage);
    return;
  }

  if (password.value !== confirmPassword.value) {
    showNotification('两次输入的密码不一致');
    return;
  }

  try {
    const response = await axios.post('/api/register', {
      username: username.value,
      password: password.value
    });

    const token = response.headers['authorization'];
    if (token) {
      localStorage.setItem('token', token);
    }

    showNotification('注册成功', 'success');
    // 注册成功后跳转到登录页面
    router.push('/login');
  } catch (error) {
    const errorMessage = error.response?.data?.error || '注册失败，请稍后重试';
    showNotification(errorMessage);
  }
};
</script>

<style scoped>
input {
  appearance: none;
  -webkit-appearance: none;
  font-size: 16px;
  transition: all 0.3s ease;
}
input:focus {
  outline: none;
}
button {
  transition: all 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (min-width: 768px) {
  input {
    font-size: 16px;
  }
}
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* 设置图标大小 */
.icon-size {
  width: 1.25em;
  height: 1.25em;
  object-fit: contain;
}
</style>