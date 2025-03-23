<template>
  <div id="header">
    <div class="logo-wrapper">
      <a-image
        :height="headerStyleHeight / 2"
        class="logo"
        :preview="false"
        src="https://reactnative.cn/img/header_logo.svg"
      />
    </div>

    <div class="tags-container" v-show="route.path === '/chat-function'">
      <div
        class="tags-wrapper"
        ref="tagsWrapper"
        @mousedown.left="handleMouseDown"
        @scroll="handleTagsScroll"
      >
        <a-checkable-tag
          v-for="(tag, index) in getAllChatIdAndTitle"
          :key="tag.id"
          :checked="selectedIndex === index"
          class="chat-tag"
          @change="() => handleTagChange(tag.id)"
        >
          <span class="tag-title">{{ tag.title }}</span>
          <a-button type="text" size="small" class="close-btn" @click.stop="removeTag(tag.id)">
            <template #icon><CloseOutlined /></template>
          </a-button>
        </a-checkable-tag>
      </div>
      <div class="tags-arrows" v-if="showArrows">
        <a-button
          type="text"
          size="small"
          :disabled="scrollLeft <= 0"
          @click="handleScroll('left')"
        >
          <template #icon><LeftOutlined /></template>
        </a-button>
        <a-button
          type="text"
          size="small"
          :disabled="scrollLeft >= maxScrollLeft"
          @click="handleScroll('right')"
        >
          <template #icon><RightOutlined /></template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useChatDataStore } from '@/stores/chatData'
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'

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

const tagsWrapper = ref<HTMLElement | null>(null)
const showArrows = ref(false)
const scrollLeft = ref(0)
const maxScrollLeft = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startScrollLeft = ref(0)

// 处理鼠标移动事件
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !tagsWrapper.value) return

  e.preventDefault()
  const x = e.pageX - (tagsWrapper.value.offsetLeft || 0)
  const walk = startX.value - x

  // 计算新的滚动位置
  let newScrollLeft = startScrollLeft.value + walk

  // 严格限制滚动范围
  newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft.value))

  // 应用新的滚动位置
  tagsWrapper.value.scrollLeft = newScrollLeft
  scrollLeft.value = newScrollLeft
}

// 处理鼠标按下事件
const handleMouseDown = (e: MouseEvent) => {
  if (!tagsWrapper.value) return

  isDragging.value = true
  startX.value = e.pageX
  startScrollLeft.value = tagsWrapper.value.scrollLeft

  // 添加全局事件监听
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)

  // 添加禁止选择类
  document.body.classList.add('no-select')
}

// 处理鼠标松开事件
const handleMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)

  // 移除禁止选择类
  document.body.classList.remove('no-select')
}

// 修改按钮滚动处理
const handleScroll = (direction: 'left' | 'right') => {
  if (!tagsWrapper.value) return
  const scrollAmount = 200
  const newScrollLeft =
    direction === 'left'
      ? Math.max(0, scrollLeft.value - scrollAmount)
      : Math.min(maxScrollLeft.value, scrollLeft.value + scrollAmount)

  tagsWrapper.value.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth',
  })
}

// 更新滚动状态
const updateScrollState = () => {
  if (!tagsWrapper.value) return
  const { clientWidth, scrollLeft: currentScrollLeft } = tagsWrapper.value

  // 获取最后一个标签
  const lastTag = tagsWrapper.value.lastElementChild as HTMLElement
  if (!lastTag) {
    showArrows.value = false
    maxScrollLeft.value = 0
    scrollLeft.value = 0
    return
  }

  // 计算最后一个标签的右边界位置
  const lastTagRight = lastTag.offsetLeft + lastTag.offsetWidth

  // 只在聊天功能页面且内容超出时显示箭头
  showArrows.value = route.path === '/chat-function' && lastTagRight > clientWidth

  // 计算最大滚动距离，确保最后一个标签完全可见
  maxScrollLeft.value = Math.max(0, lastTagRight - clientWidth + 20)
  scrollLeft.value = currentScrollLeft

  // 如果当前滚动位置超出范围，立即调整
  if (scrollLeft.value < 0) {
    tagsWrapper.value.scrollLeft = 0
  } else if (scrollLeft.value > maxScrollLeft.value) {
    tagsWrapper.value.scrollLeft = maxScrollLeft.value
  }
}

// 监听滚动事件
const handleTagsScroll = () => {
  if (!tagsWrapper.value) return
  scrollLeft.value = tagsWrapper.value.scrollLeft
}

// 滚动到选中的标签
const scrollToActiveTag = () => {
  if (!tagsWrapper.value) return

  nextTick(() => {
    const wrapperEl = tagsWrapper.value
    if (!wrapperEl) return

    const activeTag = wrapperEl.querySelector('.ant-tag-checkable-checked') as HTMLElement
    if (!activeTag) return

    const containerWidth = wrapperEl.offsetWidth
    const { offsetLeft, offsetWidth } = activeTag
    const currentScrollLeft = wrapperEl.scrollLeft

    // 计算目标滚动位置
    let targetScrollLeft = currentScrollLeft

    // 如果标签在可视区域右侧外
    if (offsetLeft + offsetWidth > currentScrollLeft + containerWidth) {
      targetScrollLeft = offsetLeft + offsetWidth - containerWidth + 20 // 20px作为缓冲
    }
    // 如果标签在可视区域左侧外
    else if (offsetLeft < currentScrollLeft) {
      targetScrollLeft = offsetLeft - 20 // 20px作为缓冲
    }

    // 平滑滚动到目标位置
    wrapperEl.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
  })
}

// 监听标签变化
watch(
  getAllChatIdAndTitle,
  async () => {
    await nextTick()
    updateScrollState()
  },
  { deep: true },
)

// 监听当前会话ID变化
watch(currentSessionId, () => {
  scrollToActiveTag()
})

// 监听路由变化
watch(
  () => route.path,
  () => {
    nextTick(() => {
      updateScrollState()
    })
  },
)

// 监听窗口大小变化
watch(() => window.innerWidth, updateScrollState)

const handleTagChange = (sessionId: string) => {
  currentSessionId.value = sessionId
  scrollToActiveTag()
}

const removeTag = (sessionId: string) => {
  const currentIndex = getAllChatIdAndTitle.value.findIndex((tag) => tag.id === sessionId)
  const isCurrentSession = sessionId === currentSessionId.value

  // 删除会话
  removeSession(sessionId)

  // 如果删除的是当前会话，且还有其他会话
  if (isCurrentSession && getAllChatIdAndTitle.value.length > 0) {
    // 选择前一个会话，如果没有前一个则选择第一个
    const newIndex = Math.max(0, currentIndex - 1)
    currentSessionId.value = getAllChatIdAndTitle.value[newIndex].id
  }
}

onMounted(() => {
  updateScrollState()
  // 初始滚动到选中标签
  scrollToActiveTag()
})

// 清理事件监听
onUnmounted(() => {
  // 移除可能未清除的鼠标事件监听
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
#header {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 24px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  display: block;
  vertical-align: middle;
}

.tags-container {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.tags-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  transition: all 0.3s ease;
}

.tags-wrapper::-webkit-scrollbar {
  display: none;
}

.tags-wrapper:active {
  cursor: grabbing;
}

.tags-arrows {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 8px;
  border-left: 1px solid var(--border-color);
  height: 32px; /* 与tag高度保持一致 */
}

:deep(.chat-tag) {
  margin: 0;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  line-height: 1;
}

:deep(.tag-title) {
  display: inline-block;
  line-height: 30px; /* 32px - 2px (border) */
}

:deep(.chat-tag:hover) {
  background: var(--hover-bg);
  border-color: var(--border-color-dark);
}

:deep(.chat-tag.ant-tag-checkable-checked) {
  background: var(--brand-color-light);
  border-color: var(--brand-color);
  color: var(--brand-color);
}

:deep(.close-btn) {
  padding: 2px;
  height: 20px;
  width: 20px;
  min-width: 20px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.close-btn:hover) {
  color: var(--text-primary);
  background: var(--hover-bg);
}

:deep(.ant-btn-text) {
  color: var(--text-secondary);
}

:deep(.ant-btn-text:hover:not(:disabled)) {
  color: var(--text-primary);
  background: var(--hover-bg);
}

:deep(.ant-btn-text:disabled) {
  color: var(--text-disabled);
}

:deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

:deep(.ant-image) {
  display: flex;
  align-items: center;
}

:deep(.ant-image-img) {
  vertical-align: middle;
}

/* 添加全局样式 */
:global(.no-select) {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  cursor: grabbing !important;
}
</style>
