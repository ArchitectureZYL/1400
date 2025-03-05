<template>
  <nav class="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <i class="fas fa-brain text-[#00B4DB] text-2xl"></i>
        <span class="text-[#00B4DB] text-xl font-semibold">花笺阁</span>
      </div>
      <!-- 移动端菜单按钮 -->
      <button class="md:hidden text-gray-600"
              @click="toggleMobileMenu">
        <i class="fas fa-bars text-xl"></i>
      </button>
      <!-- 桌面端菜单 -->
      <div class="hidden md:flex items-center space-x-8">
        <a href="#"
           :class="{
            'text-[#00B4DB]': isActiveLink === 'home',
            'text-gray-600': isActiveLink !== 'home',
          }"
           class="hover:text-[#00B4DB]"
           @click.prevent="handleLinkClick('home')">
          首页
        </a>
        <a href="#showcase"
           :class="{
            'text-[#00B4DB]': isActiveLink === 'showcase',
            'text-gray-600': isActiveLink !== 'showcase',
          }"
           class="hover:text-[#00B4DB]"
           @click.prevent="handleLinkClick('showcase')">
          作品展示
        </a>
        <router-link :to="{ name: 'profile' }"
                     :class="{
            'text-[#00B4DB]': isActiveLink === 'profile',
            'text-gray-600': isActiveLink !== 'profile',
          }"
                     class="hover:text-[#00B4DB]"
                     @click="setActiveLink('profile')">
          个人中心
        </router-link>
      </div>
    </div>
    <!-- 移动端菜单 -->
    <div :class="{
        'translate-x-0': isMobileMenuOpen,
        'translate-x-full': !isMobileMenuOpen,
      }"
         class="md:hidden fixed top-0 right-0 w-64 h-500 bg-white shadow-md transition-transform duration-300 z-50">
      <div class="flex flex-col space-y-4 p-4">
        <a href="#"
           :class="{
            'text-[#00B4DB]': isActiveLink === 'home',
            'text-gray-600': isActiveLink !== 'home',
          }"
           class="hover:text-[#00B4DB]"
           @click.prevent="handleLinkClick('home'); toggleMobileMenu()">
          首页
        </a>
        <a href="#showcase"
           :class="{
            'text-[#00B4DB]': isActiveLink === 'showcase',
            'text-gray-600': isActiveLink !== 'showcase',
          }"
           class="hover:text-[#00B4DB]"
           @click.prevent="handleLinkClick('showcase'); toggleMobileMenu()">
          作品展示
        </a>
        <router-link :to="{ name: 'profile' }"
                     :class="{
            'text-[#00B4DB]': isActiveLink === 'profile',
            'text-gray-600': isActiveLink !== 'profile',
          }"
                     class="hover:text-[#00B4DB]"
                     @click="setActiveLink('profile'); toggleMobileMenu()">
          个人中心
        </router-link>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div v-if="isMobileMenuOpen"
         @click="toggleMobileMenu"
         class="absolute top-0 left-0 w-full h-500 bg-black opacity-50 z-40"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isActiveLink = ref("");
const isMobileMenuOpen = ref(false);

const handleLinkClick = (link) => {
  if (route.name === "profile") {
    router.push("/");
  } else {
    setActiveLink(link);
    if (link === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link === "showcase") {
      scrollToShowcase();
    }
  }
};

const setActiveLink = (link) => {
  isActiveLink.value = link;
};

const scrollToShowcase = () => {
  document.getElementById("showcase")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  isActiveLink.value = "showcase";
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

onMounted(() => {
  if (route.name === "home") {
    isActiveLink.value = "home";
  } else if (route.name === "showcase") {
    isActiveLink.value = "showcase";
  } else if (route.name === "profile") {
    isActiveLink.value = "profile";
  }
});
</script>
