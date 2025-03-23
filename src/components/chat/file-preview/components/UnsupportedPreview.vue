<!-- 
不支持的文件类型预览组件
用于显示无法预览的文件类型，提供以下功能：
1. 显示提示信息
2. 显示文件名称
3. 提供文件下载选项
-->
<template>
  <!-- 不支持预览的文件显示容器 -->
  <div class="unsupported-preview">
    <!-- 内容区域 -->
    <div class="content">
      <!-- 警告图标 -->
      <FileExclamationOutlined class="icon" />
      <!-- 提示信息区域 -->
      <div class="message">
        <!-- 主标题 -->
        <div class="title">无法预览此文件</div>
        <!-- 说明文本 -->
        <div class="description">{{ fileName || '当前文件' }}暂不支持预览，请下载后查看</div>
      </div>
      <!-- 下载按钮 -->
      <a-button type="primary" @click="handleDownload">
        <template #icon><DownloadOutlined /></template>
        下载文件
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入所需的图标组件
import { FileExclamationOutlined, DownloadOutlined } from '@ant-design/icons-vue'

// 定义组件的属性
const props = defineProps<{
  /** 文件名称 */
  fileName?: string
  /** 文件下载地址 */
  fileUrl?: string
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
/* 不支持预览的文件显示容器样式 */
.unsupported-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 24px;
  background: var(--card-bg);
}

/* 内容区域样式 */
.content {
  text-align: center;
  max-width: 400px; /* 限制内容最大宽度 */
  padding: 32px;
  border-radius: 8px;
  background: var(--hover-bg);
}

/* 警告图标样式 */
.icon {
  font-size: 48px;
  color: var(--warning-color);
  margin-bottom: 16px;
  opacity: 0.8;
}

/* 提示信息区域样式 */
.message {
  margin-bottom: 24px;
}

/* 主标题样式 */
.title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* 说明文本样式 */
.description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

/* 下载按钮样式调整 */
:deep(.ant-btn) {
  min-width: 120px;
  height: 36px;
  border-radius: 18px;
  transition: all 0.3s ease;
}

/* 下载按钮悬停效果 */
:deep(.ant-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
