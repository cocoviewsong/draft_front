<!-- FilePreview.vue - 文件预览组件 -->
<template>
  <!-- 预览模态框 -->
  <a-modal
    :visible="visible"
    :footer="null"
    @cancel="handleClose"
    class="file-preview-modal"
    :width="800"
    :closable="false"
    :destroyOnClose="false"
  >
    <!-- 模态框头部 - 显示文件信息和操作按钮 -->
    <div class="modal-header">
      <div class="file-info">
        <FileOutlined class="file-icon" />
        <span class="file-name">{{ file?.name }}</span>
      </div>
      <div class="header-actions">
        <a-button type="text" :href="file?.url" target="_blank">
          <template #icon><DownloadOutlined /></template>
        </a-button>
        <a-button type="text" @click="handleClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </div>
    </div>

    <!-- 预览内容区域 -->
    <div class="preview-content">
      <!-- 图片预览区域 -->
      <a-image
        v-if="isImage && visible"
        :src="file?.url"
        :preview="{
          visible: false,
          src: file?.url,
        }"
        class="image-preview"
      />

      <!-- 视频预览区域 -->
      <div v-else-if="isVideo && visible" class="video-container" ref="videoContainer">
        <!-- 视频播放器 -->
        <video
          ref="videoRef"
          class="video-preview"
          :key="file?.url"
          @timeupdate="handleTimeUpdate"
          @loadedmetadata="handleVideoLoaded"
          @play="handlePlay"
          @pause="handlePause"
          @ended="handleEnded"
          @volumechange="handleMediaVolumeChange"
        >
          <source :src="file?.url" type="video/mp4" />
          您的浏览器不支持视频播放
        </video>

        <!-- 视频控制器 -->
        <div class="media-controls" :class="{ 'controls-hidden': !showControls }">
          <!-- 进度条控制 -->
          <div
            class="progress-container"
            @mousemove="handleProgressHover"
            @click="handleProgressClick"
          >
            <div class="progress-bar">
              <div class="progress-loaded"></div>
              <div class="progress-played" :style="{ width: `${progress}%` }"></div>
            </div>
            <!-- 悬停时间提示 -->
            <div
              class="progress-hover-time"
              :style="{ left: hoverTimePosition + 'px' }"
              v-if="showHoverTime"
            >
              {{ hoverTime }}
            </div>
          </div>

          <!-- 控制按钮区域 -->
          <div class="controls-main">
            <!-- 左侧控制区：播放/暂停按钮和时间显示 -->
            <div class="left-controls">
              <a-button type="text" class="control-btn" @click="togglePlay">
                <template #icon>
                  <PauseOutlined v-if="isPlaying" />
                  <CaretRightOutlined v-else />
                </template>
              </a-button>
              <span class="time-display">{{ currentTime }} / {{ duration }}</span>
            </div>

            <!-- 右侧控制区：音量控制 -->
            <div class="right-controls">
              <div
                class="volume-control"
                @mouseenter="handleVolumeSliderEnter"
                @mouseleave="handleVolumeSliderLeave"
              >
                <a-button type="text" class="control-btn" @click="toggleMute">
                  <template #icon>
                    <SoundOutlined v-if="!isMuted && volume > 0 && volume <= 50" />
                    <SoundFilled v-else-if="!isMuted && volume > 50" />
                    <AudioMutedOutlined v-else />
                  </template>
                </a-button>
                <!-- 音量滑块 -->
                <div
                  class="volume-slider-container"
                  :class="{ visible: showVolumeSlider }"
                  @mouseenter="handleVolumeSliderEnter"
                  @mouseleave="handleVolumeSliderLeave"
                >
                  <a-slider
                    v-model:value="volume"
                    vertical
                    :min="0"
                    :max="100"
                    :step="1"
                    @change="handleVolumeChange"
                    class="volume-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 音频预览区域 -->
      <div v-else-if="isAudio && visible" class="audio-container" ref="audioContainer">
        <!-- 音频播放器 -->
        <audio
          ref="audioRef"
          class="audio-element"
          :key="file?.url"
          @timeupdate="handleTimeUpdate"
          @loadedmetadata="handleVideoLoaded"
          @play="handlePlay"
          @pause="handlePause"
          @ended="handleEnded"
          @volumechange="handleMediaVolumeChange"
        >
          <source :src="file?.url" type="audio/mpeg" />
          您的浏览器不支持音频播放
        </audio>

        <!-- 音频可视化效果 -->
        <div class="audio-visualization">
          <div class="wave-container">
            <div
              v-for="n in 32"
              :key="n"
              class="wave-bar"
              :class="{ 'wave-bar-active': isPlaying }"
              :style="{
                height: isPlaying ? (Math.sin(n * 0.3) + 1) * 30 + 20 + 'px' : '20px',
                animationDelay: n * 0.05 + 's',
              }"
            ></div>
          </div>
        </div>

        <!-- 音频控制器（复用视频控件样式） -->
        <div class="media-controls audio-controls">
          <!-- 进度条控制 -->
          <div
            class="progress-container"
            @mousemove="handleProgressHover"
            @click="handleProgressClick"
          >
            <div class="progress-bar">
              <div class="progress-loaded"></div>
              <div class="progress-played" :style="{ width: `${progress}%` }"></div>
            </div>
            <div
              class="progress-hover-time"
              :style="{ left: hoverTimePosition + 'px' }"
              v-if="showHoverTime"
            >
              {{ hoverTime }}
            </div>
          </div>

          <!-- 控制按钮区域 -->
          <div class="controls-main">
            <div class="left-controls">
              <a-button type="text" class="control-btn" @click="togglePlay">
                <template #icon>
                  <PauseOutlined v-if="isPlaying" />
                  <CaretRightOutlined v-else />
                </template>
              </a-button>
              <span class="time-display">{{ currentTime }} / {{ duration }}</span>
            </div>

            <div class="right-controls">
              <div
                class="volume-control"
                @mouseenter="handleVolumeSliderEnter"
                @mouseleave="handleVolumeSliderLeave"
              >
                <a-button type="text" class="control-btn" @click="toggleMute">
                  <template #icon>
                    <SoundOutlined v-if="!isMuted && volume > 0 && volume <= 50" />
                    <SoundFilled v-else-if="!isMuted && volume > 50" />
                    <AudioMutedOutlined v-else />
                  </template>
                </a-button>
                <div
                  class="volume-slider-container"
                  :class="{ visible: showVolumeSlider }"
                  @mouseenter="handleVolumeSliderEnter"
                  @mouseleave="handleVolumeSliderLeave"
                >
                  <a-slider
                    v-model:value="volume"
                    vertical
                    :min="0"
                    :max="100"
                    :step="1"
                    @change="handleVolumeChange"
                    class="volume-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文档预览区域 -->
      <div v-else-if="isDocument && visible" class="document-preview">
        <DocumentPreview :file="file" />
      </div>

      <!-- 不支持的文件类型提示 -->
      <div
        v-else-if="!isImage && !isVideo && !isAudio && !isDocument && visible"
        class="unsupported-preview"
      >
        <FileOutlined class="file-icon" />
        <p>该文件类型暂不支持预览</p>
        <a-button type="primary" :href="file?.url" target="_blank"> 下载文件 </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
// 导入所需的组件和工具
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import {
  FileOutlined,
  DownloadOutlined,
  CloseOutlined,
  PauseOutlined,
  CaretRightOutlined,
  SoundOutlined,
  SoundFilled,
  AudioMutedOutlined,
} from '@ant-design/icons-vue'
import DocumentPreview from './file-preview/components/DocumentPreview.vue'

// 定义文件信息接口
interface FileInfo {
  url: string
  name: string
  type: string
  size?: number
  sender?: 'user' | 'bot'
}

// 定义组件属性接口
interface Props {
  visible: boolean
  file: FileInfo | null
}

// 组件属性和事件
const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'close'])

// 组件状态管理
const loading = ref(false) // 加载状态
const videoRef = ref<HTMLVideoElement | null>(null) // 视频元素引用
const audioRef = ref<HTMLAudioElement | null>(null) // 音频元素引用
const isPlaying = ref(false) // 播放状态
const isMuted = ref(false) // 静音状态
const volume = ref(100) // 音量值
const currentTimeStr = ref('00:00') // 当前播放时间
const durationStr = ref('00:00') // 总时长
const progress = ref(0) // 播放进度
const showControls = ref(true) // 控制器显示状态
const showVolumeSlider = ref(false) // 音量滑块显示状态
const showHoverTime = ref(false) // 进度条悬停时间显示状态
const hoverTimePosition = ref(0) // 悬停时间位置
const hoverTime = ref('00:00') // 悬停时间值
let controlsTimer: number | null = null // 控制器显示计时器
let volumeHideTimer: number | null = null // 音量滑块隐藏计时器

/**
 * 格式化时间
 * @param seconds 秒数
 * @returns 格式化后的时间字符串 (MM:SS)
 */
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 获取当前媒体元素（视频或音频）
 */
const getMediaElement = () => videoRef.value || audioRef.value

/**
 * 处理媒体加载完成事件
 */
const handleVideoLoaded = () => {
  const media = getMediaElement()
  if (media) {
    durationStr.value = formatTime(media.duration)
    media.volume = volume.value / 100
  }
}

/**
 * 处理媒体时间更新事件
 */
const handleTimeUpdate = () => {
  const media = getMediaElement()
  if (media) {
    currentTimeStr.value = formatTime(media.currentTime)
    progress.value = (media.currentTime / media.duration) * 100
  }
}

/**
 * 处理播放状态相关事件
 */
const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  progress.value = 0
}

/**
 * 切换播放/暂停状态
 */
const togglePlay = () => {
  const media = getMediaElement()
  if (media) {
    if (media.paused) {
      media.play()
    } else {
      media.pause()
    }
  }
}

/**
 * 切换静音状态
 */
const toggleMute = () => {
  const media = getMediaElement()
  if (media) {
    media.muted = !media.muted
    isMuted.value = media.muted
  }
}

/**
 * 处理音量变化
 * @param newVolume 新的音量值
 */
const handleVolumeChange = (newVolume: number) => {
  const media = getMediaElement()
  if (media) {
    media.volume = newVolume / 100
    volume.value = newVolume
    isMuted.value = newVolume === 0
  }
}

/**
 * 处理媒体音量变化事件
 */
const handleMediaVolumeChange = () => {
  const media = getMediaElement()
  if (media) {
    volume.value = Math.round(media.volume * 100)
    isMuted.value = media.muted || media.volume === 0
  }
}

/**
 * 处理进度条相关事件
 */
const handleProgressHover = (event: MouseEvent) => {
  const media = getMediaElement()
  if (!media) return

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width

  hoverTimePosition.value = event.clientX - rect.left
  hoverTime.value = formatTime(pos * media.duration)
  showHoverTime.value = true
}

const handleProgressClick = (event: MouseEvent) => {
  const media = getMediaElement()
  if (!media) return

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width

  media.currentTime = pos * media.duration
  showHoverTime.value = false
}

/**
 * 控制器显示管理
 */
const showControlsTemporarily = () => {
  showControls.value = true
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  controlsTimer = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

const handleMouseMove = () => {
  showControlsTemporarily()
}

// 计算属性
const currentTime = computed(() => currentTimeStr.value)
const duration = computed(() => durationStr.value)

// 监听文件变化
watch(
  () => props.file,
  () => {
    loading.value = true
  },
  { immediate: true },
)

// 文件类型判断
const isImage = computed(() => {
  if (!props.file?.type) return false
  const type = props.file.type.toLowerCase()
  return type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)
})

const isVideo = computed(() => {
  if (!props.file?.type) return false
  const type = props.file.type.toLowerCase()
  return type.startsWith('video/') || ['mp4', 'webm', 'ogg'].includes(type)
})

const isAudio = computed(() => {
  if (!props.file?.type) return false
  const type = props.file.type.toLowerCase()
  return type.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(type)
})

const isDocument = computed(() => {
  if (!props.file?.type) return false
  const type = props.file.type.toLowerCase()
  return type.startsWith('application/') || ['pdf', 'doc', 'docx'].includes(type)
})

/**
 * 关闭预览
 */
const handleClose = () => {
  emit('update:visible', false)
  setTimeout(() => {
    emit('close')
  }, 200)
}

/**
 * 音量滑块显示控制
 */
const handleVolumeSliderEnter = () => {
  if (volumeHideTimer) {
    clearTimeout(volumeHideTimer)
  }
  showVolumeSlider.value = true
}

const handleVolumeSliderLeave = () => {
  volumeHideTimer = setTimeout(() => {
    showVolumeSlider.value = false
  }, 300)
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
})
</script>

<style scoped>
/* Modal 样式 */
/* 覆盖 ant-design-vue 的默认样式 */
:deep(.ant-modal) {
  /* 调整模态框的层级，确保它显示在其他元素之上 */
  z-index: 1000;
}

:deep(.ant-modal),
:deep(.ant-modal-content),
:deep(.ant-modal-body) {
  /* 使用主题变量确保背景色跟随主题切换 */
  background-color: var(--card-bg) !important;
}

/* 添加过渡效果 */
:deep(.ant-modal-wrap) {
  transition: opacity 0.2s ease-out;
}

:deep(.ant-modal) {
  transition: transform 0.2s ease-out;
}

:deep(.ant-modal-wrap.ant-modal-hidden) {
  display: block !important;
  opacity: 0;
  pointer-events: none;
}

:deep(.ant-modal-hidden .ant-modal) {
  transform: scale(0.95);
}

:deep(.ant-modal-content) {
  /* 添加圆角和边框 */
  border-radius: 12px;
  border: 1px solid var(--border-color);
  /* 防止内容溢出 */
  overflow: hidden;
  /* 移除默认内边距 */
  padding: 0;
}

/* 移除 Modal body 的默认样式 */
:deep(.ant-modal-body) {
  padding: 0;
}

/* 模态框头部样式 */
.modal-header {
  /* 使用 flex 布局对齐元素 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 设置内边距和边框 */
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  /* 使用主题变量设置背景色 */
  background: var(--header-bg);
}

/* 文件信息容器 */
.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

/* 文件图标样式 */
.file-info .file-icon {
  /* 使用主题色 */
  color: var(--brand-color);
  font-size: 20px;
  flex-shrink: 0;
}

/* 文件名称样式 */
.file-info .file-name {
  /* 使用主题文本颜色 */
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  /* 文本溢出处理 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 头部操作按钮容器 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 头部按钮样式 */
.header-actions :deep(.ant-btn) {
  /* 默认状态使用次要文本颜色 */
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    /* 悬停状态使用主要文本颜色和背景 */
    color: var(--text-primary);
    background: var(--hover-bg);
  }
}

/* 预览内容区域 */
.preview-content {
  position: relative;
  background: var(--card-bg);
  /* 设置最小高度避免内容过少时的布局问题 */
  min-height: 200px;
  /* 添加过渡效果 */
  transition: opacity 0.2s ease-out;
}

.preview-content > * {
  transition: opacity 0.2s ease-out;
}

/* 视频预览样式 */
.video-container {
  width: 100%;
  background: var(--card-bg);
  position: relative;
  aspect-ratio: 16/9;
  opacity: 1;
  transition: opacity 0.2s ease-out;
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--card-bg);
}

/* 音频预览样式 */
.audio-container {
  width: 100%;
  padding: 24px;
  background: var(--card-bg);
  position: relative;
  opacity: 1;
  transition: opacity 0.2s ease-out;
}

.audio-element {
  display: none;
}

.audio-visualization {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: var(--brand-color-light);
  border-radius: 12px;
  overflow: hidden;
}

.wave-container {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 24px;
  height: 100%;
}

.wave-bar {
  width: 3px;
  height: 20px;
  background: var(--brand-color);
  border-radius: 2px;
  transition: height 0.2s ease;
}

.wave-bar-active {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}

/* 媒体控件样式 */
.media-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 16px;
  transition: opacity 0.3s ease;
}

.audio-controls {
  position: relative;
  background: var(--header-bg);
  border-radius: 12px;
  margin-top: 16px;
  /* 添加边框以增加在浅色模式下的可见度 */
  border: 1px solid var(--border-color);
  /* 修改背景色，确保控件在浅色模式下可见 */
  background: var(--brand-color-light);
}

.controls-hidden {
  opacity: 0;
}

/* 进度条容器 */
.progress-container {
  position: relative;
  padding: 8px 0;
  cursor: pointer;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  transition: height 0.2s ease;
}

.progress-container:hover .progress-bar {
  height: 6px;
}

.progress-loaded {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: inherit;
}

.progress-played {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--brand-color);
  border-radius: inherit;
  transition: width 0.1s linear;
}

.progress-hover-time {
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  margin-bottom: 8px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
}

.progress-container:hover .progress-hover-time {
  opacity: 1;
  visibility: visible;
}

/* 控制按钮区 */
.controls-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 4px;
}

.left-controls,
.right-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 32px;
}

.control-btn {
  color: white !important;
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1) !important;
  }

  &:active {
    transform: scale(0.95);
  }
}

.time-display {
  color: white;
  font-size: 14px;
  font-family: monospace;
  opacity: 0.9;
  line-height: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
}

/* 音量控制 */
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
}

.volume-slider-container {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
}

/* 自定义 Slider 样式 */
:deep(.volume-slider) {
  height: 80px;
  margin: 0;

  .ant-slider-rail {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .ant-slider-track {
    background-color: white;
  }

  .ant-slider-handle {
    border-color: white;

    &:focus {
      border-color: white;
    }
  }
}

/* 文档预览和不支持的文件类型样式 */
.document-preview,
.unsupported-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--card-bg);
  opacity: 1;
  visibility: hidden;
  transition: opacity 0.2s ease-out;
}

.unsupported-preview.visible {
  opacity: 1;
  visibility: visible;
}

/* 修改音频控件的颜色 */
.audio-controls .control-btn {
  /* 使用主题色替代白色 */
  color: var(--brand-color) !important;
}

.audio-controls .time-display {
  /* 使用主题文本颜色 */
  color: var(--text-primary);
}

/* 修改进度条样式 */
.audio-controls .progress-bar {
  background: var(--border-color-light);
}

.audio-controls .progress-loaded {
  background: var(--border-color);
}

.audio-controls .progress-played {
  background: var(--brand-color);
}

.audio-controls .progress-hover-time {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* 修改音量控制样式 */
.audio-controls .volume-slider-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

/* 自定义音频播放器的 Slider 样式 */
.audio-controls :deep(.volume-slider) {
  height: 80px;
  margin: 0;

  .ant-slider-rail {
    background-color: var(--border-color-light);
  }

  .ant-slider-track {
    background-color: var(--brand-color);
  }

  .ant-slider-handle {
    border-color: var(--brand-color);
    background-color: var(--card-bg);

    &:focus {
      border-color: var(--brand-color);
    }

    &:hover {
      border-color: var(--brand-color-hover);
    }
  }
}

/* 视频控件保持原样 */
.video-container .media-controls {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.video-container .control-btn {
  color: white !important;
}

.video-container .time-display {
  color: white;
}

/* 图片预览 */
.image-preview {
  opacity: 1;
  transition: opacity 0.2s ease-out;
}
</style>
