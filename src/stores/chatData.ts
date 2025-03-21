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

// 定义对话会话的类型
interface Conversation {
  id: string
  title: string
  messages: MessagesType[]
}
/**
 * 聊天数据
 */
export const useChatDataStore = defineStore('chatData', () => {
  // 所有聊天会话
  const chatSessions = ref<Conversation[]>([
    // {
    //   id: nanoid(),
    //   title: '对话1',
    //   messages: [
    //     {
    //       id: '11',
    //       sender: 'bot',
    //       avatar: 'bot',
    //       content: '你好1',
    //       type: 'text',
    //     },
    //   ],
    // },
    // {
    //   id: nanoid(),
    //   title: '对话2',
    //   messages: [
    //     {
    //       id: '22',
    //       sender: 'bot',
    //       avatar: 'bot',
    //       content: '你好2',
    //       type: 'text',
    //     },
    //   ],
    // },
  ])

  /**
   * 当前选中的会话ID(通过nnid()生成)
   */
  const currentSessionId = ref<string | null>('1')

  /**
   * 当前选中的会话索引(高亮tag)
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
   *
   * @returns {Array} 当前会话的所有消息
   */
  const getCurrentMessages = computed(() => {
    return currentSession.value ? currentSession.value.messages : []
  })

  /**
   * 创建新对话
   */
  const createNewSession = () => {
    // 添加新对话
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
    }
    chatSessions.value.push(newSession)

    // 更新id
    currentSessionId.value = newSessionId
  }

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
  }

  return {
    chatSessions,
    currentSessionId,
    currentSession,
    createNewSession,
    addMessage,
    getAllChatIdAndTitle,
    getCurrentMessages,
    selectedIndex,
    removeSession,
  }
})
