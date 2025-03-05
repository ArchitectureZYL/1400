<template>
  <div class="min-h-screen bg-white">
    <!-- 导航栏 -->
    <NavBar />
    <!-- 主内容区 -->
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 左侧输入区 -->
        <div class="space-y-6">
          <textarea v-model="prompt"
                    class="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B4DB] focus:border-transparent resize-none"
                    placeholder="请输入图案描述，例如：新艺术风格藤蔓花纹，搭配金色几何线条，丝绸质感..."></textarea>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- 尺寸选择 -->
            <div class="space-y-2 relative">
              <label class="text-sm text-gray-600">图片尺寸</label>
              <button @click="showSizeDropdown = !showSizeDropdown"
                      class="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                {{ selectedSize }}
                <i class="fas fa-chevron-down text-gray-400 transition-transform"
                   :class="{ 'rotate-180': showSizeDropdown }"></i>
              </button>
              <div v-if="showSizeDropdown"
                   class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button v-for="size in sizes"
                        :key="size"
                        @click="selectSize(size)"
                        class="w-full px-4 py-2 text-left hover:bg-gray-50">
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- 数量选择 -->
            <div class="space-y-2 relative">
              <label class="text-sm text-gray-600">生成数量</label>
              <button @click="showCountDropdown = !showCountDropdown"
                      class="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                {{ count }} 张
                <i class="fas fa-chevron-down text-gray-400 transition-transform"
                   :class="{ 'rotate-180': showCountDropdown }"></i>
              </button>
              <div v-if="showCountDropdown"
                   class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button v-for="num in counts"
                        :key="num"
                        @click="selectCount(num)"
                        class="w-full px-4 py-2 text-left hover:bg-gray-50">
                  {{ num }} 张
                </button>
              </div>
            </div>
          </div>

          <button @click="generateImages"
                  :disabled="isGenerating"
                  class="w-full py-3 bg-[#00B4DB] text-white rounded-lg hover:bg-[#00A0C6] transition-colors disabled:opacity-50">
            <i class="fas fa-magic mr-2"></i>
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </button>
        </div>

        <!-- 右侧预览区 -->
        <div class="bg-gray-50 rounded-lg p-6 min-h-[500px]">
          <div v-if="generatedImages.length"
               class="grid grid-cols-2 gap-4">
            <div v-for="(image, index) in generatedImages"
                 :key="index"
                 class="relative group">
              <img :src="image"
                   class="w-full h-48 object-cover rounded-lg"
                   alt="生成的图案"
                   @click="toggleDownload(index)" />
              <div v-if="showDownload[index]"
                   class="absolute inset-0 bg-black/50 rounded-lg opacity-100 flex items-center justify-center">
                <div class="flex gap-4">
                  <button @click="downloadImage(image)"
                          class="text-white hover:text-[#00B4DB]">
                    <i class="fas fa-download"></i>
                  </button>
                  <button class="text-white hover:text-[#00B4DB]">
                    <i class="fas fa-share-alt"></i>
                  </button>
                  <button class="text-white hover:text-[#00B4DB]">
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else
               class="h-full flex items-center justify-center text-gray-400">
            <div class="text-center">
              <i class="fas fa-image text-4xl mb-2"></i>
              <p>生成的图案将在此处显示</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示词推荐 -->
      <div class="mt-12">
        <h2 class="text-xl font-semibold mb-6">专业图案提示词</h2>
        <div class="flex flex-wrap gap-2">
          <button v-for="(tag, index) in promptTags"
                  :key="index"
                  @click="selectPrompt(tag)"
                  class="px-4 py-2 bg-gray-50 hover:bg-[#00B4DB] hover:text-white rounded-full transition-colors">
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 作品展示 -->
      <div id="showcase"
           class="mt-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">优秀作品展示</h2>
          <div class="relative">
            <div class="flex items-center px-3 py-2 bg-gray-50 rounded-lg w-60">
              <i class="fas fa-search text-gray-400 mr-2"></i>
              <input type="text"
                     v-model="searchQuery"
                     placeholder="搜索作品或设计师..."
                     class="bg-transparent border-none text-sm focus:outline-none w-full" />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <button v-for="category in categories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="{
               'bg-[#00B4DB] text-white': selectedCategory === category.id,
               'bg-gray-50 text-gray-600': selectedCategory !== category.id
             }"
                  class="px-4 py-2 rounded-lg transition-colors">
            {{ category.name }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="(work, index) in filteredWorks"
               :key="index"
               class="relative group">
            <img :src="work.image"
                 class="w-full h-64 object-cover rounded-lg"
                 :alt="work.title" />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p class="text-white font-medium">{{ work.title }}</p>
              <div class="flex items-center mt-2">
                <img :src="work.authorAvatar"
                     class="w-6 h-6 rounded-full mr-2"
                     :alt="work.author" />
                <p class="text-white text-sm">{{ work.author }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterPage />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FooterPage from '@/components/FooterPage.vue'

// 状态管理
const prompt = ref('')
const selectedSize = ref('1024x1024')
const count = ref(1)
const showSizeDropdown = ref(false)
const showCountDropdown = ref(false)
const sizes = ref(['1024x1024', '768x1344', '864x1152', '1344x768', '1152x864'])
const counts = ref([1])
const isGenerating = ref(false)
const generatedImages = ref([])
const searchQuery = ref('')
const selectedCategory = ref('all')
const showDownload = ref([])

const constructPrompt = (userInput) => {
  return `作为一位经验丰富且创意十足、精通 AI 绘图工具的设计师，请根据以下要求绘制简单的、适用于物品贴花的、蓝色线稿的具有剪纸镂空效果的装饰图案：
【用户描述】${userInput || "简约且具独特魅力的经典剪纸风蓝色装饰图案，适用于各类物品贴花"}
【设计规范】
1. 风格：融合传统剪纸工艺的质朴韵味与现代数字艺术的简洁明快。参考民间传统单色剪纸的简约风格，结合现代数字艺术精准流畅的线条特性，以蓝色线稿呈现，让图案既保留复古质感又符合当下简洁的审美潮流，整体风格简洁大方，能适配多种物品的气质。
2. 元素：线稿中需包含至少三种复合元素，即花卉、几何图形、装饰线条。花卉选取形态简单且常见的，如四瓣花、五瓣花等，用简洁的蓝色线条勾勒轮廓；几何图形采用基础的圆形、方形、三角形，通过简单的拼接组合来展现一定的层次感，同样以蓝色线条绘制；装饰线条运用简洁的直线、弧线，避免复杂的曲线和过多的转折，线条颜色为蓝色。
3. 表现形式：以清晰、简洁的蓝色线条构成具有镂空效果的图案，线条要均匀流畅，如同剪纸刀干脆利落的裁剪效果，杜绝出现毛糙、断点等瑕疵，保证图案清晰易读。利用 AI 绘图工具精准呈现镂空部分，镂空形状应规则简单，便于后续制作贴花。
4. 构图：图案要能够完美适配常见的贴花形状和布局，考虑到贴花在物品上的使用方式，图案不宜过大或过于复杂。采用简单的对称、重复构图技巧，确保图案在有限的空间内形成有规律的节奏美感，并且在四方连续排列时，蓝色线条和镂空部分能够自然衔接，无明显错位。
5. 细节：通过蓝色线条的少量疏密变化和简单的镂空大小差异来表现不同的视觉效果，而并非严格对应材质特性。例如，用稍稀疏的蓝色线条和较大的镂空表现轻盈感，用稍密集的蓝色线条和较小的镂空体现厚重感，以满足贴花在不同物品上的装饰需求。
6. 创新：对传统剪纸元素进行简单而巧妙的现代化演绎，比如将传统剪纸中的简单图形进行轻微的变形，或者改变元素之间的组合方式，使其与现代简约风格相融合，同时通过蓝色线稿赋予图案新的视觉感受。
7. 其他注意事项：图案线稿的设计要充分考虑物品贴花制作工艺的可行性，线条和镂空设计必须简单，避免过于复杂而难以实现。同时，要根据不同物品（如手机壳、笔记本、行李箱等）的特点和使用场景，调整图案的大小、形状和风格，确保贴花能够起到良好的装饰作用。
8. 请依据用户描述和设计规范，生成符合要求的、简单的、适用于物品贴花的、蓝色线稿的具有剪纸镂空效果的装饰图案。
9. 生成的图片无背景，带有透明通道。`;
};

// 生成图片
const generateImages = async () => {
  if (!prompt.value.trim()) return alert('请输入图案描述')

  isGenerating.value = true

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer a6e2e05c69d146258c39ad842eedeb74.3OSXrIAAnu6P5rAI' // 替换实际API密钥
      },
      body: JSON.stringify({
        model: 'cogview-4',
        prompt: constructPrompt(prompt.value),
        size: selectedSize.value,
        quality: 'hd',
        style: 'vivid',
        n: count.value,
        temperature: 0.7,
        top_p: 0.9
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || '生成失败')

    const newImages = data.data?.map(item => item.url) || []
    generatedImages.value = [...generatedImages.value, ...newImages]
    showDownload.value = [...showDownload.value, ...new Array(newImages.length).fill(false)]
  } catch (error) {
    console.error('生成错误:', error)
    alert(`生成失败: ${error.message}`)
  } finally {
    isGenerating.value = false
  }
}

// 工具函数
const selectSize = (size) => {
  selectedSize.value = size
  showSizeDropdown.value = false
}

const selectCount = (num) => {
  count.value = num
  showCountDropdown.value = false
}

// 提示词系统
const promptTags = ref([
  '伊斯兰几何+金属浮雕',
  '和风市松纹+靛蓝染色',
  '新艺术运动+彩色玻璃',
  '非洲蜡染+渐变色彩',
  '中国团花+刺绣细节',
  '装饰艺术+流线几何',
  '波斯细密画+金箔',
  '数码迷彩+丝绸光泽'
])

const selectPrompt = (tag) => {
  prompt.value = tag
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 作品展示系统
const categories = ref([
  { id: 'all', name: '全部作品' },
  { id: 'ethnic', name: '民族纹样' },
  { id: 'modern', name: '现代设计' },
  { id: 'luxury', name: '奢侈品纹样' },
  { id: 'digital', name: '数码印花' }
])

const showcaseWorks = ref([
  {
    image: 'https://example.com/arabesque.jpg',
    title: '阿拉伯藤蔓纹',
    category: 'ethnic',
    author: '阿里·哈桑',
    authorAvatar: 'https://example.com/avatar1.jpg'
  },
  {
    image: 'https://example.com/art-deco.jpg',
    title: '装饰艺术几何',
    category: 'modern',
    author: '艾琳·王',
    authorAvatar: 'https://example.com/avatar2.jpg'
  },
  {
    image: 'https://example.com/silk-pattern.jpg',
    title: '真丝提花纹样',
    category: 'luxury',
    author: '玛丽·杜邦',
    authorAvatar: 'https://example.com/avatar3.jpg'
  },
  // 添加更多示例数据...
])

const filteredWorks = computed(() => {
  return showcaseWorks.value.filter(work => {
    const categoryMatch = selectedCategory.value === 'all' ||
      work.category === selectedCategory.value
    const searchMatch = work.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      work.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    return categoryMatch && searchMatch
  })
})

const toggleDownload = (index) => {
  showDownload.value[index] = !showDownload.value[index]
}

// 图片下载功能
const downloadImage = async (imageUrl) => {
  try {
    // 打印 URL 用于调试
    console.log('尝试下载的图片 URL:', imageUrl);

    const response = await fetch(imageUrl, {
      mode: 'cors', // 设置请求模式为 CORS
      credentials: 'omit' // 不携带凭证
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_image.png';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载图片失败:', error);
    alert('下载图片失败，请稍后重试');
  }
};
</script>

<style scoped>
/* 引入 Font Awesome 图标库，实际使用时需在 HTML 中添加对应 CDN 或本地文件 */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 悬停效果 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  #showcase .flex-wrap {
    flex-wrap: wrap;
  }
}

/* 通用样式 */
.rounded-button {
  border-radius: 8px;
}

.object-cover {
  object-fit: cover;
}

.transition-colors {
  transition: background-color 0.2s, color 0.2s;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

/* 输入框样式 */
textarea {
  font-family: inherit;
  font-size: 16px;
}

/* 下拉按钮样式 */
button[aria-haspopup="true"] {
  position: relative;
}

button[aria-haspopup="true"] i {
  transition: transform 0.2s ease;
}

/* 生成按钮样式 */
button[disabled] {
  cursor: not-allowed;
}

/* 图片预览区样式 */
.bg-gray-50 {
  background-color: #f9fafb;
}

/* 提示词标签样式 */
button[class*="px-4 py-2 bg-gray-50"] {
  cursor: pointer;
}

/* 作品展示搜索框样式 */
input[type="text"] {
  outline: none;
}

/* 作品展示分类按钮样式 */
button[class*="px-4 py-2 rounded-lg"] {
  cursor: pointer;
}

/* 图片下载图标悬停样式 */
button[class*="text-white hover:text-[#00B4DB]"] {
  cursor: pointer;
}
</style>