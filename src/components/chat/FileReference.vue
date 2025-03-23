<!-- 文件引用组件 -->
<template>
  <div class="file-reference" :class="{ 'image-file': isImage }" @click="handleClick">
    <ImageThumbnail v-if="isImage" :src="file.url" :alt="fileName" @click="handleClick" />
    <div v-else class="file-icon">
      <FileOutlined />
    </div>
    <div class="file-name">
      <span class="name">{{ fileName }}</span>
      <span class="type">.{{ fileType }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileOutlined } from '@ant-design/icons-vue'
import ImageThumbnail from '@/components/chat/ImageThumbnail.vue'

interface FileInfo {
  url: string
  name: string
  type: string
}

interface Props {
  file: FileInfo
}

const props = defineProps<Props>()
const emit = defineEmits(['click'])

const fileName = computed(() => {
  const name = props.file.name
  const lastDotIndex = name.lastIndexOf('.')
  return lastDotIndex > -1 ? name.slice(0, lastDotIndex) : name
})

const fileType = computed(() => {
  const name = props.file.name
  const lastDotIndex = name.lastIndexOf('.')
  return lastDotIndex > -1 ? name.slice(lastDotIndex + 1) : ''
})

const isImage = computed(() => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  return imageTypes.includes(fileType.value.toLowerCase())
})

const handleClick = () => {
  emit('click', props.file)
}
</script>

<style scoped>
.file-reference {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  background: var(--card-bg);
  border: 1px solid var(--border-color-light);
}

.file-reference:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
}

.file-reference .file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--brand-color);
  background: var(--brand-color-light);
  border-radius: 8px;
  flex-shrink: 0;
}

.file-reference .file-name {
  display: flex;
  align-items: center;
  max-width: 200px;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-weight: 500;
}

.file-reference .file-name .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-reference .file-name .type {
  flex-shrink: 0;
  color: var(--text-secondary);
  font-weight: normal;
}

.file-reference:hover .file-name {
  color: var(--brand-color);
}

.file-reference:hover .file-name .type {
  color: var(--brand-color);
}

.file-reference.image-file {
  padding: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color-light);
}

.file-reference.image-file:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
}

.file-reference.image-file .file-name {
  padding: 0 0 0 8px;
}
</style>
