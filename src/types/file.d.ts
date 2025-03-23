export interface FileInfo {
  url: string
  name: string
  type: string
  size: number
  sender?: string
}

export interface MediaState {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTime: number
  duration: number
  currentTimeStr: string
  durationStr: string
  progress: number
  showControls: boolean
  showVolumeSlider: boolean
  showHoverTime: boolean
  hoverTimePosition: number
  hoverTime: string
}
