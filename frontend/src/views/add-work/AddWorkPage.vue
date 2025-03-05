<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-6 md:py-12 px-4"
       style="padding-top:10px;">
    <div class="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 md:p-8 border border-white/50">
      <h1 class="text-xl md:text-2xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-[#00bfff] to-blue-600 bg-clip-text text-transparent flex items-center">
        <!-- 使用 img 标签替换 Font Awesome 图标 -->
        <img src="@/assets/icons/作品.png"
             class="mr-3 w-6 h-6"
             alt="image icon">
        添加作品
      </h1>
      <div class="space-y-6">
        <!-- 作品标题 -->
        <div>
          <label class="block text-sm md:text-base font-medium text-gray-700 mb-2">作品标题</label>
          <input type="text"
                 v-model="title"
                 placeholder="请输入作品标题"
                 class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none transition text-sm md:text-base">
        </div>
        <!-- 作品类别 -->
        <div>
          <label class="block text-sm md:text-base font-medium text-gray-700 mb-2">作品类别</label>
          <input type="text"
                 v-model="category"
                 placeholder="请输入作品类别"
                 class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none transition text-sm md:text-base">
        </div>
        <!-- 作品描述 -->
        <div>
          <label class="block text-sm md:text-base font-medium text-gray-700 mb-2">作品描述</label>
          <textarea v-model="description"
                    placeholder="请输入作品描述"
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00bfff] focus:border-transparent outline-none transition resize-none text-sm md:text-base"></textarea>
        </div>
        <!-- 作品图片 -->
        <div>
          <label class="block text-sm md:text-base font-medium text-gray-700 mb-2">作品图片</label>
          <div class="relative border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:border-[#00bfff] transition-all duration-300 hover:bg-blue-50/50 group"
               @click="triggerFileInput"
               @dragover.prevent
               @drop.prevent="handleDrop">
            <input ref="fileInput"
                   type="file"
                   accept=".jpg,.jpeg,.png,.gif"
                   class="hidden"
                   @change="handleFileChange">
            <div v-if="!preview"
                 class="space-y-2">
              <!-- 使用 img 标签替换 Font Awesome 图标 -->
              <img src="@/assets/icons/upload.png"
                   class="text-4xl text-gray-400 group-hover:text-[#00bfff] transition-colors duration-300 mx-auto w-12 h-12"
                   alt="upload image icon">
              <div class="text-sm text-gray-500">
                点击或拖拽上传作品图片
              </div>
              <div class="text-xs text-gray-400">
                仅支持 jpg、png、gif 格式，大小不超过 5MB
              </div>
            </div>
            <div v-else
                 class="relative w-full pt-[56.25%]">
              <img :src="preview"
                   class="absolute inset-0 w-full h-full object-cover rounded-xl"
                   alt="预览图">
              <button class="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-xl flex items-center justify-center text-white hover:bg-opacity-70"
                      @click.stop="removeImage">
                <!-- 使用 img 标签替换 Font Awesome 图标 -->
                <img src="@/assets/icons/取消.png"
                     class="w-5 h-5"
                     alt="cancel icon">
              </button>
            </div>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4 pt-8">
          <button class="px-4 md:px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-md whitespace-nowrap text-sm md:text-base flex items-center"
                  @click="cancel">
            <!-- 使用 img 标签替换 Font Awesome 图标 -->
            <img src="@/assets/icons/取消.png"
                 class="mr-2 w-4 h-4"
                 alt="cancel icon">
            取消
          </button>
          <button class="px-4 md:px-6 py-2 bg-gradient-to-r from-[#00bfff] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap disabled:opacity-50 text-sm md:text-base flex items-center transform hover:-translate-y-0.5"
                  :disabled="isSubmitting"
                  @click="submit">
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 定义表单数据的响应式变量
const title = ref("");
const description = ref("");
const category = ref("");
const preview = ref("");
const fileInput = ref < HTMLInputElement | null > (null);
const isSubmitting = ref(false);

// 触发文件选择框
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件选择事件
const handleFileChange = (event) => {
  const target = event.target;
  const file = target.files?.[0];
  if (file) {
    validateAndPreviewImage(file);
  }
};

// 处理文件拖拽事件
const handleDrop = (event) => {
  const file = event.dataTransfer?.files[0];
  if (file) {
    validateAndPreviewImage(file);
  }
};

// 验证并预览图片
const validateAndPreviewImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    alert("仅支持 jpg、png、gif 格式的图片");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("图片大小不能超过 5MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target?.result;
  };
  reader.readAsDataURL(file);
};

// 移除已选择的图片
const removeImage = () => {
  preview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 取消表单操作
const cancel = () => {
  if (confirm("确定要取消吗？已填写的内容将不会保存。")) {
    title.value = "";
    description.value = "";
    preview.value = "";
    category.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
    window.history.back();
  }
};

// 提交表单
const submit = async () => {
  if (!title.value.trim()) {
    alert("请输入作品标题");
    return;
  }
  if (!category.value) {
    alert("请选择作品类别");
    return;
  }
  if (!description.value.trim()) {
    alert("请输入作品描述");
    return;
  }
  if (!preview.value) {
    alert("请上传作品图片");
    return;
  }
  isSubmitting.value = true;
  try {
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("提交成功！");
    title.value = "";
    description.value = "";
    preview.value = "";
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  } catch (error) {
    alert("提交失败，请重试");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
}
.upload-area:hover {
  border-color: #3b82f6;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input,
textarea {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
input:focus,
textarea:focus {
  box-shadow: 0 4px 6px rgba(0, 191, 255, 0.1);
}
</style>