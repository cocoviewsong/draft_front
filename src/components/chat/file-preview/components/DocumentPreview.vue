<!-- 
文档预览组件
用于预览文档文件（PDF、Word等），提供以下功能：
...
-->
<template>
  <div class="document-preview">
    <!-- 加载状态显示 -->
    <div v-if="loading" class="loading-container">
      <a-spin />
      <span class="loading-text">加载中...</span>
    </div>

    <!-- 文档预览 -->
    <div v-if="!loading" class="document-container">
      <!-- PDF预览 -->
      <template v-if="isPdf">
        <object :data="file?.url" type="application/pdf" class="document-viewer">
          <div class="fallback-message">
            <FileExclamationOutlined class="warning-icon" />
            <p>您的浏览器不支持PDF预览，请下载后查看</p>
            <div class="action-buttons">
              <a-button type="primary" :href="file?.url" target="_blank">
                <template #icon><DownloadOutlined /></template>
                下载PDF
              </a-button>
              <a-button @click="tryGoogleViewer">
                <template #icon><EyeOutlined /></template>
                使用Google预览
              </a-button>
            </div>
          </div>
        </object>
      </template>

      <!-- Office文档预览 -->
      <iframe
        v-else-if="isOffice"
        :src="`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file?.url || '')}`"
        class="document-viewer"
        frameborder="0"
      ></iframe>

      <!-- 不支持的文档类型 -->
      <div v-else class="fallback-message">
        <FileExclamationOutlined class="warning-icon" />
        <p>该文档类型暂不支持预览，请下载后查看</p>
        <a-button type="primary" :href="file?.url" target="_blank">
          <template #icon><DownloadOutlined /></template>
          下载文件
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FileExclamationOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons-vue'

// 定义文件信息接口
interface FileInfo {
  url: string
  name: string
  type: string
  size?: number
}

// 定义组件的属性
const props = defineProps<{
  /** 文件对象 */
  file: FileInfo | null
}>()

// 组件状态
const loading = ref(true)

// 文档类型判断
const isPdf = computed(() => props.file?.name.toLowerCase().endsWith('.pdf'))
const isOffice = computed(() => {
  const ext = props.file?.name.toLowerCase().split('.').pop()
  return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || '')
})

// 使用Google Docs Viewer预览
const tryGoogleViewer = () => {
  if (props.file?.url) {
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(props.file.url)}&embedded=true`
    window.open(googleViewerUrl, '_blank')
  }
}

// 监听文件变化
watch(
  () => props.file,
  (newFile) => {
    if (newFile) {
      loading.value = true
      // 模拟加载延迟
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.document-preview {
  width: 100%;
  height: calc(90vh - 120px);
  position: relative;
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.document-container {
  width: 100%;
  height: 100%;
  background: white;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.loading-text {
  color: var(--text-secondary);
}

.document-viewer {
  width: 100%;
  height: 100%;
  border: none;
}

.fallback-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.warning-icon {
  font-size: 48px;
  color: var(--warning-color);
}

.fallback-message p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style>
