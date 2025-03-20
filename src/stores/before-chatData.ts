// stores/chatData.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
// import type { ChatSession, ChatMessage, NewChatMessage } from './chatData.types'

/**
 * 聊天数据
 */
export const useChatDataStore1 = defineStore('chatData1', () => {
  /**
   * 所有聊天会话
   */
  // const chatSessions = ref<ChatSession[]>([])
  const chatSessions = ref([
    {
      id: '1',
      title: '对话1',
      messages: {
        id: '666',
        sender: 'bot',
        avatar: 'bot',
        content: '你好1',
        type: 'text',
      },
    },
    {
      id: '2',
      title: '对话2',
      messages: {
        id: '666',
        sender: 'bot',
        avatar: 'bot',
        content: '你好2',
        type: 'text',
      },
    },
  ])

  // 当前选中的会话ID
  const currentSessionId = ref<string | null>(null)

  // 获取当前会话
  const currentSession = computed(() =>
    chatSessions.value.find((s) => s.id === currentSessionId.value),
  )

  /**
   * 创建新会话
   *
   */
  function createNewSession(initialModel?: string) {
    const newSession: ChatSession = {
      id: nanoid(),
      title: '新对话',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      model: initialModel,
    }

    chatSessions.value.unshift(newSession)
    currentSessionId.value = newSession.id
    return newSession
  }

  /**
   * 删除会话
   *
   */
  function deleteSession(sessionId: string) {
    const index = chatSessions.value.findIndex((s) => s.id === sessionId)
    if (index !== -1) {
      chatSessions.value.splice(index, 1)
      // 如果删除的是当前会话，自动切换到最近会话
      if (currentSessionId.value === sessionId) {
        currentSessionId.value = chatSessions.value[0]?.id || null
      }
    }
  }

  // 添加消息到当前会话
  function addMessage(message: NewChatMessage) {
    if (!currentSession.value) return

    const newMessage: ChatMessage = {
      ...message,
      id: nanoid(),
      timestamp: Date.now(),
    }

    currentSession.value.messages.push(newMessage)
    currentSession.value.updatedAt = Date.now()
  }

  return {
    chatSessions,
    currentSessionId,
    currentSession,
    createNewSession,
    deleteSession,
    addMessage,
  }
})
