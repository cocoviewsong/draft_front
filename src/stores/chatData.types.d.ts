// stores/chatData.d.ts
export type MessageSender = 'user' | 'bot'
export type MessageType = 'text' | 'image' | 'audio' | 'video'
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

interface BaseMessage {
  /** 唯一消息ID */
  id: string
  /** 发送者类型 */
  sender: MessageSender
  /** 发送者头像 */
  avatar: string
  /** 消息类型 */
  type: MessageType
  /** 时间戳 (毫秒) */
  timestamp: number
  /** 消息状态 */
  status?: MessageStatus
  /** 使用的 AI 模型（仅 bot 消息需要） */
  model?: string
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

export interface ImageMessage extends BaseMessage {
  type: 'image'
  /** 图片 URL */
  url: string
  /** 图片预览缩略图 */
  thumbnail?: string
  /** 图片描述（无障碍支持） */
  alt?: string
  /** 图片宽度（可选） */
  width?: number
  /** 图片高度（可选） */
  height?: number
}

export interface AudioMessage extends BaseMessage {
  type: 'audio'
  /** 音频 URL */
  url: string
  /** 音频时长（秒） */
  duration: number
  /** 波形图数据（可选） */
  waveform?: number[]
}

export interface VideoMessage extends BaseMessage {
  type: 'video'
  /** 视频 URL */
  url: string
  /** 视频封面图 */
  poster?: string
  /** 视频时长（秒） */
  duration: number
  /** 视频宽度（可选） */
  width?: number
  /** 视频高度（可选） */
  height?: number
}

export type ChatMessage = TextMessage | ImageMessage | AudioMessage | VideoMessage

export interface ChatSession {
  /** 会话唯一ID */
  id: string
  /** 会话标题（可自动生成） */
  title: string
  /** 创建时间戳 */
  createdAt: number
  /** 最后活动时间戳 */
  updatedAt: number
  /** 是否置顶 */
  isPinned?: boolean
  /** 关联的AI模型 */
  model?: string
  /** 对话消息列表 */
  messages: ChatMessage[]
}

export type NewChatMessage =
  | Omit<TextMessage, 'id' | 'timestamp'>
  | Omit<ImageMessage, 'id' | 'timestamp'>
  | Omit<AudioMessage, 'id' | 'timestamp'>
  | Omit<VideoMessage, 'id' | 'timestamp'>
