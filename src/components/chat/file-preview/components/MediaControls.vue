<!-- 
媒体控制组件
用于视频和音频播放的通用控制界面，提供以下功能：
1. 播放/暂停按钮
2. 可拖动的进度条
3. 时间显示（当前时间/总时长）
4. 音量控制（静音按钮和音量滑块）
5. 进度条预览时间提示
-->
<template>
  <!-- 控制条容器 -->
  <div class="media-controls" v-show="mediaState.showControls">
    <!-- 进度条区域 - 支持拖动和预览 -->
    <div
      class="progress-bar"
      @mousemove="(e) => handleProgressHover(e, mediaElement)"
      @mouseleave="mediaState.showHoverTime = false"
      @click="(e) => handleProgressClick(e, mediaElement)"
    >
      <!-- 进度条背景层 -->
      <div class="progress-background" />
      <!-- 当前播放进度层 -->
      <div class="progress-current" :style="{ width: `${mediaState.progress}%` }" />
      <!-- 悬停时间提示 -->
      <div
        v-if="mediaState.showHoverTime"
        class="hover-time"
        :style="{ left: `${mediaState.hoverTimePosition}px` }"
      >
        {{ mediaState.hoverTime }}
      </div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls-bar">
      <!-- 左侧控制区：播放/暂停按钮和时间显示 -->
      <div class="left-controls">
        <!-- 播放/暂停按钮 -->
        <button class="control-btn" @click="() => togglePlay(mediaElement)">
          <PlayCircleOutlined v-if="!mediaState.isPlaying" />
          <PauseCircleOutlined v-else />
        </button>
        <!-- 时间显示 -->
        <div class="time-display">
          {{ mediaState.currentTimeStr }} / {{ mediaState.durationStr }}
        </div>
      </div>

      <!-- 右侧控制区：音量控制 -->
      <div class="right-controls">
        <!-- 音量控制区域 -->
        <div
          class="volume-control"
          @mouseenter="handleVolumeSliderEnter"
          @mouseleave="handleVolumeSliderLeave"
        >
          <!-- 音量按钮 - 根据音量状态显示不同图标 -->
          <button class="control-btn" @click="() => toggleMute(mediaElement)">
            <SoundOutlined v-if="!mediaState.isMuted && mediaState.volume > 0" />
            <SoundFilled v-else-if="!mediaState.isMuted && mediaState.volume > 50" />
            <AudioMutedOutlined v-else />
          </button>
          <!-- 音量滑块 - 鼠标悬停时显示 -->
          <div class="volume-slider" v-show="mediaState.showVolumeSlider">
            <a-slider
              :value="mediaState.volume"
              :min="0"
              :max="100"
              :step="1"
              vertical
              @change="(value: number) => handleVolumeChange(value, mediaElement)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入需要的图标组件
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  SoundFilled,
  AudioMutedOutlined,
} from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useFilePreviewStore } from '@/stores/filePreview'

// 定义组件接收的参数：媒体元素（视频或音频元素）
defineProps<{
  /** HTML媒体元素（视频或音频） */
  mediaElement: HTMLVideoElement | HTMLAudioElement
}>()

// 获取文件预览的数据管理器
const filePreviewStore = useFilePreviewStore()
// 获取媒体状态
const { mediaState } = storeToRefs(filePreviewStore)
// 获取控制方法
const {
  togglePlay, // 切换播放/暂停状态
  toggleMute, // 切换静音状态
  handleVolumeChange, // 处理音量变化
  handleProgressHover, // 处理进度条悬停
  handleProgressClick, // 处理进度条点击
  handleVolumeSliderEnter, // 处理音量滑块显示
  handleVolumeSliderLeave, // 处理音量滑块隐藏
} = filePreviewStore
</script>

<style scoped>
/* 媒体控制条的基本样式 */
.media-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7)); /* 渐变背景 */
  color: white;
  padding: 10px;
  transition: opacity 0.3s;
}

/* 进度条样式 */
.progress-bar {
  width: 100%;
  height: 4px;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}

/* 进度条背景 */
.progress-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
}

/* 当前播放进度 */
.progress-current {
  position: absolute;
  height: 100%;
  background: var(--ant-primary-color);
  transition: width 0.1s linear;
}

/* 悬停时间提示 */
.hover-time {
  position: absolute;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  bottom: 10px;
}

/* 控制栏布局 */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 左右控制区域布局 */
.left-controls,
.right-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 控制按钮样式 */
.control-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
}

/* 按钮悬停效果 */
.control-btn:hover {
  opacity: 0.8;
}

/* 时间显示样式 */
.time-display {
  font-size: 14px;
  font-family: monospace;
}

/* 音量控制区域 */
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
}

/* 音量滑块容器 */
.volume-slider {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  padding: 10px 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
}

/* Ant Design 滑块组件样式调整 */
:deep(.ant-slider) {
  margin: 0;
  height: 80px;
}

:deep(.ant-slider-rail),
:deep(.ant-slider-track) {
  width: 4px;
}

:deep(.ant-slider-handle) {
  width: 12px;
  height: 12px;
}
</style>
