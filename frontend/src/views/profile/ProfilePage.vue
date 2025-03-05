<template>
  <div class="min-h-screen bg-white">
    <navBar />
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
      <!-- 个人信息模块 -->
      <div class="bg-white shadow-lg rounded-xl p-4 sm:p-8 mb-8 sm:mb-12"
           style="margin-top:40px;">
        <h2 class="text-lg sm:text-xl font-medium mb-4 sm:mb-6 pb-2 sm:pb-4 border-b border-gray-100">个人信息</h2>
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
          <!-- 头像区域 -->
          <div class="relative group">
            <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
              <img :src="avatarUrl"
                   alt="用户头像"
                   class="w-full h-full object-cover object-top" />
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                 @click="triggerFileInput">
              <svg class="w-6 h-6 text-white"
                   viewBox="0 0 24 24"
                   fill="none">
                <path d="M4 15L8.586 8.586a2 2 0 012.828 0L16 15m-2-2l2.586-2.586a2 2 0 012.828 0L20 13m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
              </svg>
            </div>
            <input type="file"
                   ref="fileInput"
                   class="hidden"
                   accept="image/*"
                   @change="handleAvatarChange" />
          </div>

          <!-- 个人信息右侧区域 -->
          <div class="flex-1 w-full sm:w-auto">
            <!-- 昵称区域 -->
            <div class="mb-4 sm:mb-6">
              <div class="flex items-center gap-2 sm:gap-4">
                <input v-if="isEditing"
                       v-model="editingNickname"
                       class="border-none bg-gray-50 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                       @keyup.enter="saveNickname"
                       @blur="saveNickname"
                       ref="nicknameInput" />
                <template v-else>
                  <span class="text-base sm:text-xl font-medium">{{ nickname }}</span>
                  <button class="text-blue-500 hover:text-blue-600 rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                          @click="startEditing">
                    <svg class="w-5 h-5"
                         viewBox="0 0 24 24"
                         fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                  </button>
                </template>
              </div>
            </div>

            <!-- 个人介绍区域 -->
            <div class="mb-4 sm:mb-6">
              <div class="flex items-start gap-2 sm:gap-4">
                <div class="flex-1">
                  <label class="text-sm text-gray-500 mb-1 block">个人介绍</label>
                  <div class="flex items-center gap-2">
                    <input v-if="isEditingBio"
                           v-model="editingBio"
                           class="border-none bg-gray-50 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                           @keyup.enter="saveBio"
                           @blur="saveBio"
                           ref="bioInput"
                           placeholder="介绍一下你自己..." />
                    <template v-else>
                      <p class="text-gray-700 text-base sm:text-lg break-words">
                        {{ bio || '这个人很懒，还没有写介绍...' }}
                      </p>
                      <button class="text-blue-500 hover:text-blue-600 rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                              @click="startEditingBio">
                        <svg class="w-5 h-5"
                             viewBox="0 0 24 24"
                             fill="none">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- 作品数量统计 -->
            <div class="flex items-center gap-2 text-gray-500 text-sm sm:text-base">
              <svg class="w-5 h-5"
                   viewBox="0 0 24 24"
                   fill="none">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
              </svg>
              <span>已上传作品：{{ works.length }} 个</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 作品展示模块 -->
      <div class="bg-white shadow-lg rounded-xl p-4 sm:p-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h2 class="text-lg sm:text-xl font-medium mb-3 sm:mb-0">我的作品</h2>
          <div class="flex gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto pb-2 scrollbar-thin">
            <button v-for="category in categories"
                    :key="category.id"
                    @click="currentCategory = category.id"
                    :class="[
                      'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full whitespace-nowrap transition-colors',
                      currentCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    ]">
              {{ category.name }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 sm:gap-6 lg:gap-8"
             :class="{ 'grid-cols-3': isMobile }">
          <!-- 上传按钮 -->
          <div class="aspect-[4/3] bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
               @click="toAddWork">
            <svg class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2"
                 viewBox="0 0 24 24"
                 fill="none">
              <path d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round" />
            </svg>
            <span class="text-sm sm:text-base text-gray-500">上传新作品</span>
            <input type="file"
                   ref="workFileInput"
                   class="hidden"
                   accept="image/*"
                   @change="handleWorkUpload"
                   multiple />
          </div>
          <!-- 作品列表 -->
          <div v-for="work in filteredWorks"
               :key="work.url"
               class="relative group">
            <div class="aspect-[4/3] overflow-hidden rounded-xl">
              <img :src="work.url"
                   :alt="work.title"
                   class="w-full h-full object-cover object-top transform transition-transform duration-300 group-hover:scale-105"
                   @click="!isMobile && toggleWorkInfo(work)"
                   @touchstart.stop="isMobile && toggleWorkInfo(work)" />
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-3 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                 :class="{ 'opacity-100': work.showInfo, 'text-xs': isMobile }">
              <div class="flex justify-between items-start">
                <div>
                  <h3 :class="{ 'text-sm': isMobile }"
                      class="font-medium mb-1">{{ work.title }}</h3>
                  <span :class="{ 'text-[10px]': isMobile }">作者: {{ work.author }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span :class="{ 'text-[10px]': isMobile }"
                        class="text-red-500 cursor-pointer"
                        @click.stop="deleteWork(work)">删除</span>
                  <span :class="{ 'text-[8px]': isMobile }"
                        class="px-2 py-1 bg-blue-500 rounded-full mt-1">
                    {{ categories.find(c => c.id === work.category)?.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footerPage />
  </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted } from 'vue';
import navBar from '@/components/navBar.vue';
import footerPage from '@/components/footerPage.vue';
import { useRouter } from 'vue-router';

const avatarUrl = ref('https://ai-public.mastergo.com/ai/img_res/6f29e7efa0815842ee702b0ad77273b8.jpg');
const nickname = ref('陈艺术家');
const isEditing = ref(false);
const editingNickname = ref('');
const nicknameInput = ref(null);
const fileInput = ref(null);
const workFileInput = ref(null);

// 新增个人介绍相关
const bio = ref('热爱绘画与设计的自由创作者，探索数字艺术与传统技法的融合之美');
const isEditingBio = ref(false);
const editingBio = ref('');
const bioInput = ref(null);

const categories = ref([
  { id: "all", name: "全部作品" },
  { id: "traditional", name: "传统风格" },
  { id: "modern", name: "现代简约" },
  { id: "vintage", name: "复古风格" },
  { id: "abstract", name: "抽象艺术" }
]);

const currentCategory = ref('all');
const works = ref([
  {
    title: '马尔代夫的日落',
    author: '陈艺术家',
    category: 'traditional',
    url: 'https://ai-public.mastergo.com/ai/img_res/86a173124881eb0f5586c3edda9d5490.jpg',
    showInfo: false
  },
  {
    title: '海滩度假',
    author: '陈艺术家',
    category: 'modern',
    url: 'https://ai-public.mastergo.com/ai/img_res/a19d79cbbda737f0dc707fbf3f7b40ea.jpg',
    showInfo: false
  },
  {
    title: '水上别墅',
    author: '陈艺术家',
    category: 'vintage',
    url: 'https://ai-public.mastergo.com/ai/img_res/6ae4a71b1c33e325366ad6313b1e5f7b.jpg',
    showInfo: false
  }
]);

const isMobile = ref(false);

onMounted(() => {
  const checkIsMobile = () => {
    isMobile.value = window.innerWidth < 640;
  };
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
});

// 昵称编辑方法
const startEditing = () => {
  isEditing.value = true;
  editingNickname.value = nickname.value;
  nextTick(() => {
    nicknameInput.value?.focus();
  });
};
// 保存“昵称”方法
const saveNickname = () => {
  if (editingNickname.value.trim()) {
    nickname.value = editingNickname.value;
  }
  isEditing.value = false;
};

// 个人介绍编辑方法
const startEditingBio = () => {
  isEditingBio.value = true;
  editingBio.value = bio.value;
  nextTick(() => {
    bioInput.value?.focus();
  });
};

const saveBio = () => {
  if (editingBio.value.trim()) {
    bio.value = editingBio.value;
  }
  isEditingBio.value = false;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
// 跳转到“上传作品”页面
const router = useRouter();
const toAddWork = () => {
  router.push('/add-work');
};

const handleAvatarChange = (event) => {
  const target = event.target;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        avatarUrl.value = e.target.result;
      }
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const handleWorkUpload = (event) => {
  const target = event.target;
  if (target.files) {
    Array.from(target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          works.value.push({
            title: file.name.replace(/\.[^/.]+$/, ""),
            author: nickname.value,
            category: currentCategory.value === 'all'
              ? categories.value[1].id
              : currentCategory.value,
            url: e.target.result,
            showInfo: false
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }
};

const deleteWork = (work) => {
  const index = works.value.findIndex(w => w === work);
  if (index !== -1) {
    works.value.splice(index, 1);
  }
};

const filteredWorks = computed(() => {
  if (currentCategory.value === 'all') {
    return works.value;
  }
  return works.value.filter(work => work.category === currentCategory.value);
});

const toggleWorkInfo = (work) => {
  work.showInfo = !work.showInfo;
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 640px) {
  .aspect-\[4\/3\] {
    aspect-ratio: 3/4;
  }

  img {
    transform: scale(0.95);
  }

  .group:hover img {
    transform: scale(1);
  }
}
</style>