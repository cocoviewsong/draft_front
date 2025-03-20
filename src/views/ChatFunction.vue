<template>
  <div class="chat-wrapper">
    <div class="chat-messages" id="chatMessages" ref="messagesContainer">
      <Chat :chatMessageList="getCurrentMessages"></Chat>
    </div>

    <div class="chat-input">
      <a-textarea
        class="input-textarea"
        v-model:value="userInputText"
        placeholder="输入问题..."
        :rows="2"
        :disabled="isLoading"
        @keydown="handlePressEnter"
      />
      <a-tooltip title="发送">
        <a-button
          class="input-btn"
          type="primary"
          shape="circle"
          :icon="h(ArrowUpOutlined)"
          :loading="isLoading"
          :disabled="!userInputText.trim()"
          @click="handleSendMessage"
        >
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, useTemplateRef, onMounted, nextTick } from 'vue'
import { ArrowUpOutlined } from '@ant-design/icons-vue'
import Chat from '@/components/Chat.vue'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { useChatDataStore } from '@/stores/chatData'

const chatDataStore = useChatDataStore()
const { getCurrentMessages } = storeToRefs(chatDataStore)
const { createNewSession, addMessage } = chatDataStore

const userInputText = ref('')
const isLoading = ref(false)
const messagesContainerDOM = useTemplateRef('messagesContainer')

/**
 * 处理文本框事件
 *
 * Ctrl+Enter 换行
 *
 * Enter 发送
 */
const handlePressEnter = (e: { key: string; ctrlKey: any; preventDefault: () => void }) => {
  if (e.key === 'Enter') {
    if (e.ctrlKey) {
      userInputText.value += '\n'
    } else {
      e.preventDefault()
      handleSendMessage()
    }
  }
}

/**
 * 处理要发送的用户文本
 */
const handleSendMessage = async () => {
  try {
    // 如果用户输入不合格或者正在加载消息则不允许再发送消息
    if (isLoading.value) return

    // 显示加载状态
    isLoading.value = true

    addMessage({
      id: '666',
      type: 'text',
      sender: 'user',
      avatar: '/user-avatar.png',
      content: userInputText.value,
    })
  } catch {
    message.error('请求失败，请稍后再试')
  } finally {
    isLoading.value = false
    userInputText.value = ''
    await nextTick()
    scrollToBottom()
  }
}

/**
 * 滚动到对话框底部
 */
const scrollToBottom = () => {
  if (messagesContainerDOM.value) {
    messagesContainerDOM.value.scrollTop = messagesContainerDOM.value.scrollHeight
  }
}

onMounted(() => {})
</script>

<style scoped>
/* 聊天容器 */
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #f7f7f7;
  border-radius: 15px 0 0 15px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  padding: 10px;
  background: #f7f7f7;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow-y: auto; /* 超出部分出现垂直滚动条 */
}

/* 输入区域 */
.chat-input {
  position: relative;
  height: 64px;
  margin-bottom: 10px;

  :deep(.ant-input) {
    resize: none;
  }

  .input-textarea {
    height: 100%;
    resize: none;
  }

  .input-btn {
    display: inline-block;
    position: absolute;
    bottom: 5px;
    right: 5px;
    z-index: 10;
  }
}
</style>
