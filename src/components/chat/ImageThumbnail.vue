<!-- 图片缩略图组件 -->
<template>
  <div class="image-thumbnail">
    <a-image :src="src" :alt="alt" class="preview-image" :preview="false" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
}

defineProps<Props>()
defineEmits(['click'])
</script>

<style scoped>
.image-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  background: var(--brand-color-light);
}

/* 使用深度选择器确保样式生效 */
:deep(.ant-image) {
  width: 100%;
  height: 100%;
  display: block;
}

:deep(.ant-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 0.3s ease;
}

:deep(.ant-image-mask) {
  display: none;
}

.image-thumbnail:hover :deep(.ant-image img) {
  transform: scale(1.1);
}
</style>
