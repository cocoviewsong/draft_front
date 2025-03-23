/**
 * 文件预览状态管理
 * 用于管理文件预览相关的状态和操作，包括：
 * 1. 文件类型判断
 * 2. 媒体播放控制
 * 3. 预览窗口状态
 * 4. 进度条和音量控制
 */
import type { FileInfo, MediaState } from '@/types/file'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useFilePreviewStore = defineStore('filePreview', () => {
  // 文件类型判断
  /**
   * 判断当前文件是否为图片类型
   * 支持的格式：image/*、jpg、jpeg、png、gif、webp
   */
  const isImage = computed(() => {
    if (!currentFile.value?.type) return false
    const type = currentFile.value.type.toLowerCase()
    return type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)
  })

  /**
   * 判断当前文件是否为视频类型
   * 支持的格式：video/*、mp4、webm、ogg
   */
  const isVideo = computed(() => {
    if (!currentFile.value?.type) return false
    const type = currentFile.value.type.toLowerCase()
    return type.startsWith('video/') || ['mp4', 'webm', 'ogg'].includes(type)
  })

  /**
   * 判断当前文件是否为音频类型
   * 支持的格式：audio/*、mp3、wav、ogg
   */
  const isAudio = computed(() => {
    if (!currentFile.value?.type) return false
    const type = currentFile.value.type.toLowerCase()
    return type.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(type)
  })

  /**
   * 判断当前文件是否为文档类型
   * 支持的格式：pdf、doc、docx、xls、xlsx、ppt、pptx、txt
   */
  const isDocument = computed(() => {
    if (!currentFile.value?.type) return false
    const type = currentFile.value.type.toLowerCase()
    const name = currentFile.value.name.toLowerCase()
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
    return type.startsWith('application/') || documentTypes.some((ext) => name.endsWith(`.${ext}`))
  })

  // 当前预览的文件信息
  const currentFile = ref<FileInfo | null>(null)
  // 预览窗口显示状态
  const isPreviewVisible = ref(false)

  /**
   * 媒体控制状态
   * 包含播放、音量、进度等控制参数
   */
  const mediaState = ref<MediaState>({
    isPlaying: false, // 是否正在播放
    isMuted: false, // 是否静音
    volume: 100, // 音量大小(0-100)
    currentTime: 0, // 当前播放时间(秒)
    duration: 0, // 总时长(秒)
    currentTimeStr: '00:00', // 当前时间格式化字符串
    durationStr: '00:00', // 总时长格式化字符串
    progress: 0, // 播放进度(0-100)
    showControls: true, // 是否显示控制栏
    showVolumeSlider: false, // 是否显示音量滑块
    showHoverTime: false, // 是否显示进度条悬停时间
    hoverTimePosition: 0, // 进度条悬停位置
    hoverTime: '00:00', // 悬停位置对应的时间
  })

  // 控制栏自动隐藏计时器
  let controlsTimer: number | null = null
  // 音量滑块自动隐藏计时器
  let volumeHideTimer: number | null = null

  /**
   * 将秒数格式化为 MM:SS 格式的时间字符串
   * @param seconds 秒数
   * @returns 格式化后的时间字符串
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * 关闭预览窗口
   * 清空当前文件信息并清理计时器
   */
  const closePreview = () => {
    isPreviewVisible.value = false
    currentFile.value = null
    cleanupTimers()
  }

  /**
   * 处理媒体加载完成事件
   * 设置总时长和初始音量
   */
  const handleVideoLoaded = (media: HTMLVideoElement | HTMLAudioElement) => {
    mediaState.value.duration = media.duration
    mediaState.value.durationStr = formatTime(media.duration)
    media.volume = mediaState.value.volume / 100
  }

  /**
   * 处理媒体播放进度更新事件
   * 更新当前时间和进度条
   */
  const handleTimeUpdate = (media: HTMLVideoElement | HTMLAudioElement) => {
    mediaState.value.currentTime = media.currentTime
    mediaState.value.currentTimeStr = formatTime(media.currentTime)
    mediaState.value.progress = (media.currentTime / media.duration) * 100
  }

  /**
   * 处理媒体开始播放事件
   */
  const handlePlay = () => {
    mediaState.value.isPlaying = true
  }

  /**
   * 处理媒体暂停事件
   */
  const handlePause = () => {
    mediaState.value.isPlaying = false
  }

  /**
   * 处理媒体播放结束事件
   * 重置播放状态和进度
   */
  const handleEnded = () => {
    mediaState.value.isPlaying = false
    mediaState.value.progress = 0
  }

  /**
   * 切换播放/暂停状态
   */
  const togglePlay = (media: HTMLVideoElement | HTMLAudioElement) => {
    if (media.paused) {
      media.play()
    } else {
      media.pause()
    }
  }

  /**
   * 切换静音状态
   */
  const toggleMute = (media: HTMLVideoElement | HTMLAudioElement) => {
    media.muted = !media.muted
    mediaState.value.isMuted = media.muted
  }

  /**
   * 处理音量变化
   * @param newVolume 新的音量值(0-100)
   */
  const handleVolumeChange = (newVolume: number, media: HTMLVideoElement | HTMLAudioElement) => {
    media.volume = newVolume / 100
    mediaState.value.volume = newVolume
    mediaState.value.isMuted = newVolume === 0
  }

  /**
   * 处理媒体音量变化事件
   */
  const handleMediaVolumeChange = (media: HTMLVideoElement | HTMLAudioElement) => {
    mediaState.value.volume = Math.round(media.volume * 100)
    mediaState.value.isMuted = media.muted || media.volume === 0
  }

  /**
   * 处理进度条悬停事件
   * 显示悬停位置对应的时间
   */
  const handleProgressHover = (event: MouseEvent, media: HTMLVideoElement | HTMLAudioElement) => {
    const progressBar = event.currentTarget as HTMLElement
    const rect = progressBar.getBoundingClientRect()
    const pos = (event.clientX - rect.left) / rect.width

    mediaState.value.hoverTimePosition = event.clientX - rect.left
    mediaState.value.hoverTime = formatTime(pos * media.duration)
    mediaState.value.showHoverTime = true
  }

  /**
   * 处理进度条点击事件
   * 跳转到点击位置对应的时间
   */
  const handleProgressClick = (event: MouseEvent, media: HTMLVideoElement | HTMLAudioElement) => {
    const progressBar = event.currentTarget as HTMLElement
    const rect = progressBar.getBoundingClientRect()
    const pos = (event.clientX - rect.left) / rect.width

    media.currentTime = pos * media.duration
    mediaState.value.showHoverTime = false
  }

  /**
   * 临时显示控制栏
   * 3秒后自动隐藏(仅在播放状态)
   */
  const showControlsTemporarily = () => {
    mediaState.value.showControls = true
    if (controlsTimer) {
      clearTimeout(controlsTimer)
    }
    controlsTimer = window.setTimeout(() => {
      if (mediaState.value.isPlaying) {
        mediaState.value.showControls = false
      }
    }, 3000)
  }

  /**
   * 处理音量滑块显示事件
   */
  const handleVolumeSliderEnter = () => {
    if (volumeHideTimer) {
      clearTimeout(volumeHideTimer)
    }
    mediaState.value.showVolumeSlider = true
  }

  /**
   * 处理音量滑块隐藏事件
   * 300ms延迟后隐藏
   */
  const handleVolumeSliderLeave = () => {
    volumeHideTimer = setTimeout(() => {
      mediaState.value.showVolumeSlider = false
    }, 300)
  }

  /**
   * 清理所有计时器
   */
  const cleanupTimers = () => {
    if (controlsTimer) {
      clearTimeout(controlsTimer)
    }
    if (volumeHideTimer) {
      clearTimeout(volumeHideTimer)
    }
  }

  return {
    // 状态
    currentFile,
    isPreviewVisible,
    mediaState,
    isImage,
    isVideo,
    isAudio,
    isDocument,
    closePreview,

    // 方法
    formatTime,
    handleVideoLoaded,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    handleMediaVolumeChange,
    handleProgressHover,
    handleProgressClick,
    showControlsTemporarily,
    handleVolumeSliderEnter,
    handleVolumeSliderLeave,
    cleanupTimers,
  }
})
