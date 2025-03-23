<template>
  <a-list class="comment-list" item-layout="horizontal" :data-source="chatMessageList">
    <template #renderItem="{ item, index }">
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
                <div class="file-icon">
                  <FileOutlined />
                </div>
                <div class="file-info">
                  <div class="file-name">{{ item.content }}</div>
                  <div class="file-meta">
                    <span>{{ formatFileSize(item.fileSize) }}</span>
                    <span>{{ item.fileType }}</span>
                  </div>
                </div>
                <a-button type="link" :href="item.fileUrl" target="_blank" class="file-download">
                  <DownloadOutlined />
                </a-button>
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
            <div style="text-align: justify; white-space: normal">
              {{ item.content }}
            </div>
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import {
  LikeFilled,
  LikeOutlined,
  DislikeFilled,
  DislikeOutlined,
  FileOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue'

const props = defineProps(['chatMessageList'])
onMounted(() => {
  // console.log('dddddddddddddddddd', props)
})

const reactions = reactive(new Map())

const getReaction = (id: any) => {
  if (!reactions.has(id)) {
    reactions.set(id, { likes: 0, dislikes: 0, action: '' })
  }
  return reactions.get(id)
}

const like = (id: any) => {
  const reaction = getReaction(id)
  const isLiked = reaction.action === 'liked'
  reaction.likes = isLiked ? 0 : 1
  reaction.dislikes = 0
  reaction.action = isLiked ? '' : 'liked'
}

const dislike = (id: any) => {
  const reaction = getReaction(id)
  const isDisliked = reaction.action === 'disliked'
  reaction.dislikes = isDisliked ? 0 : 1
  reaction.likes = 0
  reaction.action = isDisliked ? '' : 'disliked'
}

/**
 * 格式化文件大小
 */
const formatFileSize = (size?: number) => {
  if (!size) return '未知大小'
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  let fileSize = size

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024
    index++
  }

  return `${fileSize.toFixed(2)} ${units[index]}`
}
</script>

<style scoped>
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

.file-message:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
}

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

.file-download {
  padding: 8px;
  color: var(--text-secondary);
  transition: all 0.3s ease;

  &:hover {
    color: var(--brand-color);
    background: var(--brand-color-light);
  }
}

:deep(.ant-btn-link) {
  color: var(--text-secondary);

  &:hover {
    color: var(--brand-color);
  }
}
</style>
