<template>
  <div class="chat-wrapper">
    <div class="chat-messages" id="chatMessages" ref="messagesContainer">
      <Chat :chatMessageList="getCurrentMessages"></Chat>
    </div>

    <div class="chat-input-area">
      <!-- 上传区域 -->
      <div class="upload-area" :class="{ 'upload-area-active': showUpload }">
        <a-upload-dragger
          class="custom-upload-dragger"
          v-model:fileList="fileList"
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
          @drop="handleDrop"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p class="ant-upload-hint">支持单次或批量上传，严禁上传公司数据或其他违禁文件</p>
        </a-upload-dragger>
      </div>

      <!-- 输入区域 -->
      <div class="input-wrapper">
        <a-textarea
          class="custom-textarea input-textarea"
          v-model:value="userInputText"
          placeholder="输入问题..."
          :rows="2"
          :disabled="isLoading"
          @keydown="handlePressEnter"
        />
        <div class="input-actions">
          <a-button
            class="custom-btn upload-btn"
            :type="showUpload ? 'primary' : 'default'"
            shape="circle"
            :icon="h(UploadOutlined)"
            @click="toggleUpload"
          />
          <a-button
            class="custom-btn send-btn"
            type="primary"
            shape="circle"
            :icon="h(ArrowUpOutlined)"
            :loading="isLoading"
            :disabled="isEmptyText"
            @click="handleSendMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, useTemplateRef, onMounted, nextTick, watch, computed } from 'vue'
import { ArrowUpOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons-vue'
import Chat from '@/components/Chat.vue'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { useChatDataStore } from '@/stores/chatData'
import type { UploadChangeParam } from 'ant-design-vue'
import { nanoid } from 'nanoid'

const chatDataStore = useChatDataStore()
const { getCurrentMessages, getCurrentFileList } = storeToRefs(chatDataStore)
const { createNewSession, addMessage, updateFileList } = chatDataStore

const userInputText = ref('')
const isLoading = ref(false)
const messagesContainerDOM = useTemplateRef('messagesContainer')
const showUpload = ref(false)
const fileList = ref<any[]>([])

// 监听 store 中的文件列表变化
watch(
  getCurrentFileList,
  (newFileList) => {
    fileList.value = newFileList
  },
  { immediate: true },
)

/**
 * 检查文本是否为空
 */
const isEmptyText = computed(() => {
  return !userInputText.value || !userInputText.value.trim()
})

/**
 * 检查文本是否包含危险内容
 */
const hasDangerousContent = (text: string): boolean => {
  // 检查常见的XSS攻击模式
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // <script>标签
    /javascript:/gi, // javascript:协议
    /on\w+\s*=/gi, // onclick等事件处理程序
    /data:/gi, // data:协议
    /<iframe/gi, // iframe标签
    /<img[^>]+src[^>]*/gi, // img标签
  ]

  return dangerousPatterns.some((pattern) => pattern.test(text))
}

/**
 * 净化用户输入
 */
const sanitizeInput = (text: string): string => {
  // 使用 JSON.stringify 进行字符串化，去掉首尾的引号
  return JSON.stringify(text).slice(1, -1)
}

/**
 * 切换上传区域显示
 */
const toggleUpload = () => {
  showUpload.value = !showUpload.value
}

/**
 * 处理文件上传
 */
const handleChange = (info: UploadChangeParam) => {
  // 更新文件列表到 store
  updateFileList(info.fileList as any[])

  if (info.file.status === 'done') {
    message.success(`${info.file.name} 上传成功`)
    // 添加文件消息到聊天
    addMessage({
      id: nanoid(),
      type: 'file',
      sender: 'user',
      avatar: '/user-avatar.png',
      content: info.file.name,
      fileUrl: info.file.response.url,
      fileType: info.file.type,
      fileSize: info.file.size,
    })
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`)
  }
}

/**
 * 处理拖拽
 */
const handleDrop = (e: DragEvent) => {
  console.log(e)
}

/**
 * 处理按键事件
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
 * 处理发送消息
 */
const handleSendMessage = async () => {
  try {
    if (isLoading.value || isEmptyText.value) return

    // 检查危险内容
    if (hasDangerousContent(userInputText.value)) {
      message.error('消息包含不安全的内容，已被阻止发送')
      return
    }

    isLoading.value = true

    // 净化用户输入
    const sanitizedText = sanitizeInput(userInputText.value)

    addMessage({
      id: nanoid(),
      type: 'text',
      sender: 'user',
      avatar: '/user-avatar.png',
      content: sanitizedText,
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
 * 滚动到底部
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
  background: var(--content-bg);
  padding: 16px;
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 5px;
  margin-bottom: 20px;
  overflow-y: auto;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color-light);

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbar-auto-track);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-auto-thumb);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--brand-color);
  }
}

/* 输入区域 */
.chat-input-area {
  position: relative;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
}

/* 上传区域 */
.upload-area {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--card-bg);
  border-radius: 12px 12px 0 0;
  border-bottom: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
}

.upload-area-active {
  max-height: 400px;
  padding: 16px;
  overflow-y: auto;
  border-bottom: 1px solid var(--border-color-light);
  opacity: 1;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbar-auto-track);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-auto-thumb);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--brand-color);
  }

  :deep(.custom-upload-dragger) {
    .ant-upload-drag {
      padding: 16px;
      background-color: var(--card-bg);
      border-color: var(--border-color);
      border-radius: 8px;
      transition: all 0.3s ease;
      margin-bottom: 0;

      &:hover {
        border-color: var(--brand-color);
        background-color: var(--hover-bg);
      }

      &:active {
        background-color: var(--active-bg);
      }

      .ant-upload-text {
        color: var(--text-primary);
        margin: 8px 0 4px;
      }

      .ant-upload-hint {
        color: var(--text-secondary);
        font-size: 12px;
      }

      .anticon {
        color: var(--brand-color);
        transition: transform 0.3s ease;
        font-size: 28px;

        &:hover {
          transform: scale(1.1);
          color: var(--brand-color-hover);
        }
      }
    }

    .ant-upload-list {
      margin-top: 12px;
      padding: 0;
      border-radius: 8px;
      background: transparent;

      .ant-upload-list-item {
        margin: 8px 0;
        padding: 8px 12px;
        background: var(--card-bg);
        border: 1px solid var(--border-color-light);
        border-radius: 6px;
        transition: all 0.3s ease;

        &:first-child {
          margin-top: 0;
        }

        &:hover {
          background: var(--hover-bg);
          border-color: var(--border-color);
          transform: translateX(4px);
        }

        .ant-upload-list-item-name {
          color: var(--text-primary);
          font-weight: 500;
          padding-right: 8px;
        }

        .ant-upload-list-item-card-actions {
          opacity: 0;
          transition: opacity 0.3s;

          .anticon {
            color: var(--text-secondary);

            &:hover {
              color: var(--brand-color);
            }
          }
        }

        &:hover .ant-upload-list-item-card-actions {
          opacity: 1;
        }
      }

      .ant-upload-list-item-progress {
        padding: 0 12px;
        margin-top: 4px;

        .ant-progress-bg {
          background: var(--brand-color);
        }
      }
    }
  }
}

/* 输入区域 */
.input-wrapper {
  position: relative;
  min-height: 64px;
  display: flex;
  padding: 12px;
  gap: 12px;
}

.input-textarea {
  flex: 1;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  padding: 8px 12px;
  border-radius: 8px;
}

.input-actions {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding-bottom: 4px;
}

/* 聊天消息样式 */
:deep(.chat-bot) {
  .ant-comment-content-detail {
    border-radius: 0 12px 12px 12px;
    color: var(--chat-bot-text);
    margin-top: 8px;
  }

  .ant-comment-content-author-name {
    color: var(--text-primary);
    font-weight: 500;
  }
}

:deep(.chat-user) {
  .ant-comment-content-detail {
    border-radius: 12px 0 12px 12px;
    color: var(--chat-user-text);
    margin-top: 8px;
  }

  .ant-comment-content-author-name {
    color: var(--brand-color);
    font-weight: 500;
  }
}

/* 输入框样式 */
:deep(.custom-textarea) {
  &.ant-input {
    background-color: var(--input-bg) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color);

    &:hover {
      border-color: var(--brand-color);
      background-color: var(--hover-bg) !important;
    }

    &:focus {
      border-color: var(--brand-color);
      background-color: var(--input-bg) !important;
      box-shadow: 0 0 0 2px var(--brand-color-light);
    }

    &::placeholder {
      color: var(--text-placeholder);
    }

    &:disabled {
      background-color: var(--active-bg) !important;
      color: var(--text-disabled) !important;
    }
  }
}

/* 按钮样式 */
:deep(.custom-btn) {
  &.ant-btn {
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);

    .anticon {
      color: inherit;
    }

    &:not(.ant-btn-primary) {
      color: var(--text-secondary);

      &:hover {
        color: var(--brand-color);
        border-color: var(--brand-color);
        background: var(--brand-color-light);
      }
    }

    &.ant-btn-primary {
      background: var(--brand-color);
      border-color: var(--brand-color);
      color: #fff;

      &:hover {
        background: var(--brand-color-hover);
        border-color: var(--brand-color-hover);
      }

      &:active {
        background: var(--brand-color-pressed);
        border-color: var(--brand-color-pressed);
      }

      .anticon {
        color: #fff;
      }
    }

    &:disabled {
      &:hover {
        color: var(--text-disabled);
        border-color: var(--border-color);
        background: var(--card-bg);
      }

      .anticon {
        color: var(--text-disabled);
      }
    }

    &.upload-btn {
      &:hover {
        color: var(--brand-color);
        border-color: var(--brand-color);
        background: var(--brand-color-light);
      }

      &.ant-btn-primary {
        background: var(--brand-color);
        border-color: var(--brand-color);
        color: #fff;

        &:hover {
          background: var(--brand-color-hover);
          border-color: var(--brand-color-hover);
        }

        .anticon {
          color: #fff;
        }
      }
    }
  }
}
</style>
