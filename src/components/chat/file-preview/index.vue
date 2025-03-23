<!-- 
文件预览主组件
这是一个通用的文件预览组件，支持多种文件类型的预览：
1. 图片文件 - 直接显示图片
2. 视频文件 - 提供视频播放功能，包括播放控制、进度条、音量控制等
3. 音频文件 - 提供音频播放功能，包括播放控制、进度条、音量控制等
4. 文档文件 - 使用pdfjs-dist和mammoth进行本地预览(有问题)
5. 其他类型 - 提供下载选项
-->
<template>
  <!-- 预览弹窗 - 使用 Ant Design Vue 的 Modal 组件 -->
  <a-modal
    :open="isPreviewVisible"
    :footer="null"
    :destroyOnClose="false"
    @cancel="closePreview"
    class="file-preview-modal"
    width="80%"
  >
    <!-- 预览窗口的头部，显示文件名和下载按钮 -->
    <PreviewHeader
      :file-name="currentFile?.name"
      :file-url="currentFile?.url"
      @close="closePreview"
    />

    <!-- 预览内容区域 - 根据文件类型显示不同的预览组件 -->
    <div class="preview-content">
      <!-- 图片预览组件 -->
      <ImagePreview v-if="isImage" :src="currentFile?.url" />

      <!-- 视频预览组件 -->
      <VideoPreview v-else-if="isVideo" :src="currentFile?.url" />

      <!-- 音频预览组件 -->
      <AudioPreview v-else-if="isAudio" :src="currentFile?.url" />

      <!-- 文档预览组件 -->
      <DocumentPreview v-else-if="isDocument" :src="currentFile?.url" />

      <!-- 不支持的文件类型显示提示组件 -->
      <UnsupportedPreview v-else :file-name="currentFile?.name" :file-url="currentFile?.url" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
// 导入需要的工具和组件
import { storeToRefs } from 'pinia'
import { useFilePreviewStore } from '@/stores/filePreview'
import PreviewHeader from '@/components/chat/file-preview/components/PreviewHeader.vue'
import ImagePreview from '@/components/chat/file-preview/components/ImagePreview.vue'
import VideoPreview from '@/components/chat/file-preview/components/VideoPreview.vue'
import AudioPreview from '@/components/chat/file-preview/components/AudioPreview.vue'
import DocumentPreview from '@/components/chat/file-preview/components/DocumentPreview.vue'
import UnsupportedPreview from '@/components/chat/file-preview/components/UnsupportedPreview.vue'

// 获取文件预览的数据管理器
const filePreviewStore = useFilePreviewStore()

// 从数据管理器中获取需要的状态
const {
  currentFile, // 当前预览的文件信息
  isPreviewVisible, // 预览窗口的显示状态
  isImage, // 是否为图片文件
  isVideo, // 是否为视频文件
  isAudio, // 是否为音频文件
  isDocument, // 是否为文档文件
} = storeToRefs(filePreviewStore)

// 获取关闭预览的方法
const { closePreview } = filePreviewStore
</script>

<style scoped>
/* 预览弹窗的样式 */
.file-preview-modal {
  /* 设置弹窗内容的背景色和圆角 */
  :deep(.ant-modal-content) {
    background-color: var(--card-bg);
    border-radius: 8px;
    overflow: hidden;
  }

  /* 移除弹窗内容的内边距 */
  :deep(.ant-modal-body) {
    padding: 0;
  }
}

/* 预览内容区域的样式 */
.preview-content {
  position: relative;
  min-height: 200px;
  max-height: calc(90vh - 120px); /* 设置最大高度为视窗高度的90%减去120px */
  overflow: auto;
  opacity: 1;
  transition: opacity 0.3s ease; /* 添加透明度过渡效果 */
}
</style>
