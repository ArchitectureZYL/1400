<template>
  <div id="app">
    <!-- 加载动画组件 -->
    <LoadingComponent ref="loadingRef" />
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoadingComponent from './components/loadingComponent.vue';

// 获取路由实例
const router = useRouter();
// 获取加载动画组件的引用
const loadingRef = ref(null);

onMounted(() => {
  // 路由开始跳转时显示加载动画
  router.beforeEach(() => {
    if (loadingRef.value) {
      loadingRef.value.showLoading();
    }
  });

  // 路由跳转完成后隐藏加载动画
  router.afterEach(() => {
    if (loadingRef.value) {
      loadingRef.value.hideLoading();
    }
  });
});
</script>
