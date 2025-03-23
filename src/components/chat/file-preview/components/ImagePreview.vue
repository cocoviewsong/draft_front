<!-- 
图片预览组件
用于预览图片文件，提供以下功能：
1. 图片自适应显示
2. 加载状态提示
3. 保持原始宽高比
4. 优雅的加载过渡效果
-->
<template>
  <div class="image-preview">
    <!-- 加载状态显示 -->
    <div v-if="loading" class="loading-container">
      <a-spin />
      <span class="loading-text">加载中...</span>
    </div>
    <!-- 图片显示区域 -->
    <a-image
      v-if="src"
      :src="src"
      :preview="{
        visible: false,
        src: src,
      }"
      @load="handleImageLoaded"
      class="preview-image"
      :class="{ 'image-loaded': !loading }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src?: string
}>()

// 加载状态
const loading = ref(true)

/**
 * 处理图片加载完成事件
 */
const handleImageLoaded = () => {
  loading.value = false
}
</script>

<style scoped>
.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  min-height: 200px;
  position: relative;
}

/* 加载状态容器样式 */
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 1;
}

.loading-text {
  color: var(--text-secondary);
}

/* 图片容器样式 */
.preview-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-image.image-loaded {
  opacity: 1;
}

:deep(.preview-image.ant-image) {
  max-width: 100%;
  max-height: calc(90vh - 200px);

  img {
    max-width: 100%;
    max-height: calc(90vh - 200px);
    object-fit: contain;
  }
}
</style>
