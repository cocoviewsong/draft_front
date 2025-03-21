<template>
  <div id="header">
    <a-image
      :height="headerStyleHeight / 2"
      class="ant-header-left logo"
      :preview="false"
      src="https://reactnative.cn/img/header_logo.svg"
    />

    <a-space :size="[0, 8]" wrap v-show="route.path === '/chat-function'">
      <a-checkable-tag
        v-for="(tag, index) in getAllChatIdAndTitle"
        :key="tag.id"
        :checked="selectedIndex === index"
        @change="() => handleTagChange(tag.id)"
      >
        {{ tag.title }}
        <a @click.stop="removeTag(tag.id)"><CloseOutlined /></a>
      </a-checkable-tag>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { CloseOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useChatDataStore } from '@/stores/chatData'

defineProps({
  headerStyleHeight: {
    type: Number,
    required: true,
  },
})

const route = useRoute()
const chatDataStore = useChatDataStore()
const { getAllChatIdAndTitle, selectedIndex, currentSessionId } = storeToRefs(chatDataStore)
const { removeSession } = chatDataStore

/**
 * 处理tag标签的改变
 */
const handleTagChange = (sessionId: string) => {
  currentSessionId.value = sessionId
}

/**
 * 移除tag标签
 */
const removeTag = (sessionId: string) => {
  removeSession(sessionId)
}
</script>

<style>
#header {
  display: flex;
  gap: 12px;
}

#header .ant-header-right {
  flex: 1;
  border: none;
}
</style>
