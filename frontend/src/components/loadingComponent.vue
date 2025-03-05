<template>
  <div v-if="isLoading"
       class="loading-component">
    <!-- 线条动画 -->
    <div class="loading-component__lines">
      <div class="loading-component__line"></div>
      <div class="loading-component__line"></div>
      <div class="loading-component__line"></div>
      <div class="loading-component__line"></div>
    </div>
    <!-- 加载文字 -->
    <div class="loading-component__text">
      <span>加载中</span>
      <span class="loading-component__dots">...</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据，控制加载动画的显示与隐藏
const isLoading = ref(false);

// 提供一个函数，用于显示加载动画
const showLoading = () => {
  isLoading.value = true;
};

// 提供一个函数，用于隐藏加载动画
const hideLoading = () => {
  isLoading.value = false;
};

// 将函数导出，以便在其他地方使用
defineExpose({
  showLoading,
  hideLoading
});
</script>

<style scoped>
/* 线条动画 */
.loading-component__lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
}

.loading-component__line {
  width: 4px;
  height: 24px;
  background: #6366f1;
  animation: lines 1.2s ease-in-out infinite;
}

.loading-component__line:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-component__line:nth-child(3) {
  animation-delay: 0.2s;
}

.loading-component__line:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes lines {
  0%,
  100% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(1);
  }
}

/* 文字动画 */
.loading-component__text {
  position: relative;
  display: inline-block;
}

.loading-component__dots {
  display: inline-block;
  animation: dots-fade 1.4s infinite;
}

@keyframes dots-fade {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>