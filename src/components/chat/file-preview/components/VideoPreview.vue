<!-- 
视频预览组件
用于播放视频文件，提供以下功能：
1. 视频播放控制 - 播放/暂停
2. 进度显示和控制 - 可拖动进度条
3. 音量调节 - 支持静音和音量滑块
4. 时间显示 - 显示当前时间和总时长
5. 自动隐藏的控制条
-->
<template>
  <!-- 视频预览容器 -->
  <div class="video-preview">
    <!-- 视频播放器 - 隐藏原生控件，使用自定义控件 -->
    <video
      ref="videoRef"
      :src="src"
      class="video-player"
      @loadedmetadata="handleVideoLoaded"
      @timeupdate="handleTimeUpdate"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @volumechange="handleVolumeChange"
    />
    <!-- 自定义媒体控制条 -->
    <media-controls v-if="videoRef" :mediaElement="videoRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFilePreviewStore } from '@/stores/filePreview'
import MediaControls from '@/components/chat/file-preview/components/MediaControls.vue'

// 定义组件接收的参数：视频源地址
defineProps<{
  /** 视频文件的URL地址 */
  src?: string
}>()

// 获取文件预览的数据管理器
const filePreviewStore = useFilePreviewStore()
// 获取媒体状态
const { mediaState } = storeToRefs(filePreviewStore)
// 视频元素引用
const videoRef = ref<HTMLVideoElement>()

/**
 * 视频加载完成时的处理函数
 * 在视频元数据加载完成后执行：
 * 1. 获取视频总时长
 * 2. 格式化时间显示
 * 3. 设置初始音量
 */
const handleVideoLoaded = () => {
  if (videoRef.value) {
    const media = videoRef.value
    const duration = media.duration
    const durationStr = formatTime(duration)
    // 更新持续时间显示
    mediaState.value.durationStr = durationStr
    // 设置初始音量
    media.volume = mediaState.value.volume / 100
  }
}

/**
 * 视频播放进度更新时的处理函数
 * 在播放过程中持续更新：
 * 1. 当前播放时间
 * 2. 进度条位置
 */
const handleTimeUpdate = () => {
  if (videoRef.value) {
    const media = videoRef.value
    const currentTime = media.currentTime
    const duration = media.duration
    // 更新当前时间显示
    mediaState.value.currentTimeStr = formatTime(currentTime)
    // 更新进度条
    mediaState.value.progress = (currentTime / duration) * 100
  }
}

/**
 * 视频开始播放时的处理函数
 * 更新播放状态为播放中
 */
const handlePlay = () => {
  mediaState.value.isPlaying = true
}

/**
 * 视频暂停时的处理函数
 * 更新播放状态为暂停
 */
const handlePause = () => {
  mediaState.value.isPlaying = false
}

/**
 * 视频播放结束时的处理函数
 * 1. 重置播放状态
 * 2. 重置进度条位置
 */
const handleEnded = () => {
  mediaState.value.isPlaying = false
  mediaState.value.progress = 0
}

/**
 * 视频音量变化时的处理函数
 * 1. 更新音量显示值
 * 2. 更新静音状态
 */
const handleVolumeChange = () => {
  if (videoRef.value) {
    const media = videoRef.value
    // 更新音量显示
    mediaState.value.volume = Math.round(media.volume * 100)
    // 更新静音状态
    mediaState.value.isMuted = media.muted || media.volume === 0
  }
}

/**
 * 格式化时间显示
 * @param seconds 秒数
 * @returns 格式化后的时间字符串 (MM:SS)
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/* 视频预览容器样式 */
.video-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 200px;
  background-color: #000; /* 视频背景色 */
}

/* 视频播放器样式 */
.video-player {
  width: 100%;
  max-height: calc(90vh - 200px); /* 预留空间给头部和边距 */
  object-fit: contain; /* 保持视频比例 */
}
</style>
