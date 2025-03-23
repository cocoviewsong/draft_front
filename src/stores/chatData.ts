// stores/chatData.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

interface MessagesType {
  id: string
  sender: string
  avatar: string
  content: string
  type: string
  fileUrl?: string
  fileType?: string
  fileSize?: number
}

interface FileItem {
  uid: string
  name: string
  status: string
  url?: string
  type?: string
  size?: number
}

// 定义对话会话的类型
interface Conversation {
  id: string
  title: string
  messages: MessagesType[]
  fileList: FileItem[] // 每个会话独立的文件列表
}

const STORAGE_KEY = 'chat-sessions'

/**
 * 聊天数据
 */
export const useChatDataStore = defineStore('chatData', () => {
  // 所有聊天会话
  const chatSessions = ref<Conversation[]>([])

  // 从 localStorage 恢复数据
  const initFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      chatSessions.value = JSON.parse(stored)
    }
  }

  // 保存数据到 localStorage
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatSessions.value))
  }

  /**
   * 当前选中的会话ID
   */
  const currentSessionId = ref<string | null>(null)

  /**
   * 当前选中的会话索引
   */
  const selectedIndex = computed(() =>
    chatSessions.value.findIndex((s) => s.id === currentSessionId.value),
  )

  /**
   * 获取当前聊天对话的数据结构
   */
  const currentSession = computed(() =>
    chatSessions.value.find((s) => s.id === currentSessionId.value),
  )

  /**
   * 获取所有聊天对话中的 id 和 title 属性
   */
  const getAllChatIdAndTitle = computed(() =>
    chatSessions.value.map((session) => ({ id: session.id, title: session.title })),
  )

  /**
   * 获取当前对话的 messages属性
   */
  const getCurrentMessages = computed(() => {
    return currentSession.value ? currentSession.value.messages : []
  })

  /**
   * 获取当前对话的文件列表
   */
  const getCurrentFileList = computed(() => {
    return currentSession.value ? currentSession.value.fileList : []
  })

  /**
   * 创建新对话
   */
  const createNewSession = () => {
    const newSessionId = nanoid()
    const newSession = {
      id: newSessionId,
      title: `对话${chatSessions.value.length + 1}`,
      messages: [
        {
          id: nanoid(),
          sender: 'bot',
          avatar: 'bot',
          content: '你好',
          type: 'text',
        },
      ],
      fileList: [], // 初始化空的文件列表
    }
    chatSessions.value.push(newSession)
    currentSessionId.value = newSessionId
    saveToStorage()
  }

  /**
   * 添加聊天对话
   */
  const addMessage = (sessionMessage: MessagesType) => {
    if (currentSession.value) {
      currentSession.value.messages.push(sessionMessage)
      // 如果是用户发送的消息，清空当前对话的文件列表
      if (sessionMessage.sender === 'user' && sessionMessage.type === 'text') {
        currentSession.value.fileList = []
      }
      saveToStorage()
    } else {
      console.error('当前会话不存在')
    }
  }

  /**
   * 更新文件列表
   */
  const updateFileList = (files: FileItem[]) => {
    if (currentSession.value) {
      currentSession.value.fileList = files
      saveToStorage()
    }
  }

  /**
   * 删除对话
   */
  const removeSession = (sessionId: string) => {
    const index = chatSessions.value.findIndex((s) => s.id === sessionId)
    if (index === -1) return

    const wasSelected = currentSessionId.value === sessionId
    chatSessions.value.splice(index, 1)

    if (wasSelected) {
      currentSessionId.value = chatSessions.value[0]?.id || null
    }
    saveToStorage()
  }

  // 初始化时从 localStorage 加载数据
  initFromStorage()

  return {
    chatSessions,
    currentSessionId,
    currentSession,
    createNewSession,
    addMessage,
    getAllChatIdAndTitle,
    getCurrentMessages,
    getCurrentFileList,
    selectedIndex,
    removeSession,
    updateFileList,
  }
})
