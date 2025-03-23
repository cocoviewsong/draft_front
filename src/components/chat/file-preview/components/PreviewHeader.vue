<!-- 
预览头部组件
用于显示文件预览窗口的顶部栏，提供以下功能：
1. 显示文件名和图标
2. 提供文件下载按钮
3. 提供关闭预览按钮
4. 美观的布局和交互效果
-->
<template>
  <!-- 头部容器 -->
  <div class="modal-header">
    <!-- 左侧文件信息区域 -->
    <div class="file-info">
      <!-- 文件图标 -->
      <FileOutlined />
      <!-- 文件名称 -->
      <span class="file-name">{{ fileName }}</span>
    </div>
    <!-- 右侧操作按钮区域 -->
    <div class="header-actions">
      <!-- 下载按钮 -->
      <a-button type="text" @click="handleDownload">
        <template #icon><DownloadOutlined /></template>
        下载
      </a-button>
      <!-- 关闭按钮 -->
      <a-button type="text" @click="$emit('close')">
        <template #icon><CloseOutlined /></template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入所需的图标组件
import { FileOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons-vue'

// 定义组件的属性
const props = defineProps<{
  /** 文件名称 */
  fileName?: string
  /** 文件下载地址 */
  fileUrl?: string
}>()

// 定义组件的事件
defineEmits<{
  /** 关闭预览窗口事件 */
  (e: 'close'): void
}>()

/**
 * 处理文件下载
 * 通过在新标签页打开文件URL来触发下载
 */
const handleDownload = () => {
  if (props.fileUrl) {
    window.open(props.fileUrl, '_blank')
  }
}
</script>

<style scoped>
/* 头部容器样式 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-bg);
}

/* 文件信息区域样式 */
.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0; /* 防止文件名过长时溢出 */
  color: var(--text-primary);
}

/* 文件名样式 */
.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

/* 操作按钮区域样式 */
.header-actions {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
}

/* 按钮样式 */
:deep(.ant-btn) {
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

/* 按钮悬停效果 */
:deep(.ant-btn:hover) {
  color: var(--text-primary);
  background: var(--hover-bg);
}
</style>
