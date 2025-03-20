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
}

/**
 * 聊天数据
 */
export const useChatDataStore = defineStore('chatData', () => {
  // 所有聊天会话
  const chatSessions = ref([
    {
      id: '1',
      title: '对话1',
      messages: [
        {
          id: '11',
          sender: 'bot',
          avatar: 'bot',
          content: '你好1',
          type: 'text',
        },
      ],
    },
    {
      id: '2',
      title: '对话2',
      messages: [
        {
          id: '22',
          sender: 'bot',
          avatar: 'bot',
          content: '你好2',
          type: 'text',
        },
      ],
    },
  ])

  /**
   * 当前选中的会话ID
   */
  const currentSessionId = ref<string | null>('1')

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
   *
   * @returns {Array} 当前会话的所有消息
   */
  const getCurrentMessages = computed(() => {
    return currentSession.value ? currentSession.value.messages : []
  })

  /**
   * 创建新对话
   */
  const createNewSession = () => {}

  /**
   * 添加聊天对话
   */
  const addMessage = (sessionMessage: MessagesType) => {
    if (currentSession.value) {
      currentSession.value.messages.push(sessionMessage)
    } else {
      console.error('当前会话不存在')
    }
  }

  return {
    chatSessions,
    currentSessionId,
    currentSession,
    createNewSession,
    addMessage,
    getAllChatIdAndTitle,
    getCurrentMessages,
  }
})
