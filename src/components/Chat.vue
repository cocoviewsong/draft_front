<!-- 
聊天组件
用于展示聊天消息列表，支持以下功能：
1. 显示机器人和用户的聊天消息
2. 支持文本、文件和组合类型的消息
3. 消息点赞和不喜欢反馈
4. 文件预览功能
5. 图片预览功能
-->
<template>
  <!-- 聊天消息列表 -->
  <a-list class="comment-list" item-layout="horizontal" :data-source="chatMessageList">
    <template #renderItem="{ item, index }">
      <!-- 机器人消息 -->
      <a-list-item v-if="item.sender === 'bot'" class="chat-bot">
        <a-comment>
          <template #avatar>
            <a-avatar :src="item.avatar" :alt="item.sender + '头像'">
              {{ item.avatar ?? item.sender.slice(0, 1) }}
            </a-avatar>
          </template>
          <template #author>
            <a>{{ item.sender }}</a>
          </template>
          <template #content>
            <div>
              <div v-if="item.type === 'text'" v-html="item.content"></div>
              <div v-else-if="item.type === 'file'" class="file-message">
                <FileReference
                  :file="{
                    url: item.fileUrl || '',
                    name: item.content as string,
                    type: item.fileType || '',
                  }"
                  @click="handleFileClick"
                />
              </div>
              <div v-else-if="item.type === 'combined'" class="combined-message">
                <!-- 文本内容 -->
                <div v-if="item.content.text" class="text-content">
                  {{ item.content.text }}
                </div>
                <!-- 文件列表 -->
                <div v-if="item.content.files?.length" class="files-list">
                  <FileReference
                    v-for="file in item.content.files"
                    :key="file.url"
                    :file="file"
                    @click="handleFileClick"
                  />
                </div>
              </div>
            </div>
          </template>

          <span key="comment-basic-like">
            <a-tooltip title="喜欢">
              <template v-if="getReaction(index).action === 'liked'">
                <LikeFilled @click="like(index)" />
              </template>
              <template v-else>
                <LikeOutlined @click="like(index)" />
              </template>
            </a-tooltip>
          </span>

          <span key="comment-basic-dislike">
            <a-tooltip title="不喜欢">
              <template v-if="getReaction(index).action === 'disliked'">
                <DislikeFilled @click="dislike(index)" />
              </template>
              <template v-else>
                <DislikeOutlined @click="dislike(index)" />
              </template>
            </a-tooltip>
          </span>
        </a-comment>
      </a-list-item>

      <a-list-item v-else-if="item.sender === 'user'" class="chat-user">
        <a-comment>
          <template #avatar>
            <a-avatar
              :src="item.avatar"
              :alt="item.sender + '头像'"
              style="background-color: #228be6"
            >
              {{ item.avatar ?? item.sender.slice(0, 1) }}
            </a-avatar>
          </template>
          <template #author>
            <a>{{ item.sender }}</a>
          </template>
          <template #content>
            <div class="user-message">
              <!-- 文本内容 -->
              <div v-if="item.type === 'combined' && item.content.text" class="message-text">
                {{ item.content.text }}
              </div>
              <!-- 文件列表 -->
              <div
                v-if="item.type === 'combined' && item.content.files?.length"
                class="message-files"
              >
                <FileReference
                  v-for="file in item.content.files"
                  :key="file.url"
                  :file="file"
                  @click="handleFileClick"
                />
              </div>
            </div>
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>

  <!-- 文件预览组件 -->
  <FilePreview v-model:visible="previewVisible" :file="currentFile" @close="closePreview" />

  <!-- 图片预览组件 -->
  <a-image
    :style="{ display: 'none' }"
    :preview="{
      visible: imagePreviewVisible,
      onVisibleChange: setImagePreviewVisible,
      src: currentImageUrl,
      toolbarRender: () => null,
    }"
  />
</template>

<script setup lang="ts">
// 导入所需的组件和工具
import { ref, reactive } from 'vue'
import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from '@ant-design/icons-vue'
import FileReference from '@/components/chat/FileReference.vue'
import FilePreview from '@/components/chat/FilePreview.vue'

// 文件信息接口定义
interface FileInfo {
  url: string
  name: string
  type: string
  size?: number
  sender?: 'user' | 'bot'
}

// 消息内容接口定义
interface MessageContent {
  text?: string
  files?: FileInfo[]
}

// 聊天消息接口定义
interface ChatMessage {
  id: string
  type: 'text' | 'file' | 'combined'
  sender: 'bot' | 'user'
  avatar: string
  content: string | MessageContent
  fileUrl?: string
  fileType?: string
  fileSize?: number
}

// 组件属性接口定义
interface Props {
  chatMessageList: ChatMessage[]
}

defineProps<Props>()

// 消息反馈状态管理
const reactions = reactive(new Map())

/**
 * 获取指定消息的反馈状态
 * @param id 消息ID
 * @returns 反馈状态对象
 */
const getReaction = (id: any) => {
  if (!reactions.has(id)) {
    reactions.set(id, { likes: 0, dislikes: 0, action: '' })
  }
  return reactions.get(id)
}

/**
 * 处理消息点赞
 * @param id 消息ID
 */
const like = (id: any) => {
  const reaction = getReaction(id)
  const isLiked = reaction.action === 'liked'
  reaction.likes = isLiked ? 0 : 1
  reaction.dislikes = 0
  reaction.action = isLiked ? '' : 'liked'

  // checkpoint 优化AI回复,用户喜欢此类型回复
}

/**
 * 处理消息不喜欢
 * @param id 消息ID
 */
const dislike = (id: any) => {
  const reaction = getReaction(id)
  const isDisliked = reaction.action === 'disliked'
  reaction.dislikes = isDisliked ? 0 : 1
  reaction.likes = 0
  reaction.action = isDisliked ? '' : 'disliked'

  // checkpoint 优化AI回复,用户不喜欢此类型回复
}

// 文件预览状态管理
const previewVisible = ref(false)
const currentFile = ref<FileInfo | null>(null)
const imagePreviewVisible = ref(false)
const currentImageUrl = ref('')

/**
 * 关闭文件预览
 */
const closePreview = () => {
  previewVisible.value = false
  currentFile.value = null
}

/**
 * 设置图片预览可见性
 */
const setImagePreviewVisible = (value: boolean) => {
  imagePreviewVisible.value = value
}

/**
 * 处理文件点击事件
 * 根据文件类型选择不同的预览方式
 */
const handleFileClick = (file: FileInfo) => {
  const type = file.type?.toLowerCase() || ''
  // 图片文件使用 a-image 预览
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
    currentImageUrl.value = file.url
    setImagePreviewVisible(true)
  } else {
    // 其他文件使用 FilePreview 组件
    currentFile.value = {
      url: file.url,
      name: file.name,
      type: file.type,
      size: file.size,
      sender: file.sender,
    }
    previewVisible.value = true
  }
}
</script>

<style scoped>
/* 聊天消息基础样式 */
.chat-bot,
.chat-user {
  display: flex;
  align-items: flex-start;
  padding: 2px 0;

  .ant-comment {
    width: 100%;
  }

  .ant-comment-inner {
    display: flex;
    align-items: flex-start;
    padding: 0;
  }

  .ant-comment-content {
    flex: 1;
  }

  .ant-comment-content-author {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  .ant-comment-content-detail {
    color: var(--text-primary);
    line-height: 1.4;
  }

  .ant-comment-avatar {
    margin: 0 16px 0 0;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}

/* 用户消息特定样式 - 靠右对齐 */
.chat-user {
  justify-content: flex-end;

  .ant-comment {
    display: flex;
    flex-direction: row-reverse;
  }

  .ant-comment-inner {
    flex-direction: row-reverse;
  }

  .ant-comment-content {
    margin-right: 16px;
    margin-left: 0;
  }

  .ant-comment-content-detail {
    text-align: right;
  }

  :deep(.ant-comment-inner) {
    display: flex;
    flex-direction: row-reverse;
    align-self: flex-end;
  }
}

/* 消息作者对齐样式 */
:deep(.chat-user .ant-comment-content-author) {
  justify-content: flex-end;
}

:deep(.chat-bot .ant-comment-content-author) {
  justify-content: flex-start;
}

:deep(.ant-comment-nested) {
  display: flex;
  gap: 5px;
}

/* 文件消息样式 */
.file-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color-light);
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 文件消息悬停效果 */
.file-message:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
}

/* 文件图标样式 */
.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--brand-color-light);
  border-radius: 8px;
  color: var(--brand-color);
  font-size: 20px;
}

/* 文件信息样式 */
.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  color: var(--text-secondary);
  font-size: 12px;
  display: flex;
  gap: 8px;
}

/* 文件下载按钮样式 */
.file-download {
  padding: 8px;
  color: var(--text-secondary);
  transition: all 0.3s ease;

  &:hover {
    color: var(--brand-color);
    background: var(--brand-color-light);
  }
}

/* 链接按钮样式 */
:deep(.ant-btn-link) {
  color: var(--text-secondary);

  &:hover {
    color: var(--brand-color);
  }
}

/* 组合消息样式 */
.combined-message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 文本内容样式 */
.text-content {
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 4px;
}

/* 文件列表样式 */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* 用户消息样式 */
.user-message {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: right;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

/* 图片预览样式优化 */
:deep(.ant-image-preview-img) {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 预览操作栏样式 */
:deep(.ant-image-preview-operations) {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

/* 预览切换按钮样式 */
:deep(.ant-image-preview-switch-left),
:deep(.ant-image-preview-switch-right) {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

:deep(.ant-image-preview-switch-left:hover),
:deep(.ant-image-preview-switch-right:hover) {
  background: rgba(0, 0, 0, 0.4);
}

/* 预览层级设置 */
:deep(.ant-image-preview-wrap) {
  z-index: 1100;
}
</style>
