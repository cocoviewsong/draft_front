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
        :checked="selectIndex === index"
        @change="() => handleTagChange(index, tag.id)"
      >
        {{ tag.title }}
        <a @click.stop="removeTag(tag.id)"><CloseOutlined /></a>
      </a-checkable-tag>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
const { getAllChatIdAndTitle, currentSessionId, getCurrentMessages } = storeToRefs(chatDataStore)
const { removeMessage } = chatDataStore

const selectIndex = ref(0) // 默认选中第一个

const handleTagChange = (index: number, key: string) => {
  currentSessionId.value = key
  selectIndex.value = index // 让 selectIndex 变为点击的索引
  console.log('getCurrentMessages.value', getCurrentMessages.value)
}

// 移除 tag
const removeTag = (tagId: string) => {
  // 找到索引
  const tagIndex = chatDataStore.chatSessions.findIndex((session) => session.id === tagId)
  if (tagIndex === -1) return // 没找到就返回

  // 删除该对话
  chatDataStore.chatSessions.splice(tagIndex, 1)

  // 更新选中状态
  if (selectIndex.value === tagIndex) {
    selectIndex.value = chatDataStore.chatSessions.length > 0 ? 0 : -1
  } else if (selectIndex.value > tagIndex) {
    selectIndex.value -= 1
  }
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
