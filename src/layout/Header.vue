<!-- 
顶部导航栏组件
提供以下功能：
1. 显示应用程序Logo
2. 显示聊天会话标签列表（仅在聊天功能页面显示）
3. 支持标签的滚动和拖拽
4. 标签的选择、关闭等操作
-->
<template>
  <!-- 头部容器 -->
  <div id="header">
    <!-- Logo区域 -->
    <div class="logo-wrapper">
      <a-image
        :height="headerStyleHeight / 2"
        class="logo"
        :preview="false"
        src="https://reactnative.cn/img/header_logo.svg"
      />
    </div>

    <!-- 聊天标签容器 - 仅在聊天功能页面显示 -->
    <div class="tags-container" v-show="route.path === '/chat-function'">
      <!-- 标签列表包装器 - 支持滚动和拖拽 -->
      <div
        class="tags-wrapper"
        ref="tagsWrapper"
        @mousedown.left="handleMouseDown"
        @scroll="handleTagsScroll"
      >
        <!-- 可选中的标签列表 -->
        <a-checkable-tag
          v-for="(tag, index) in getAllChatIdAndTitle"
          :key="tag.id"
          :checked="selectedIndex === index"
          class="chat-tag"
          @change="() => handleTagChange(tag.id)"
        >
          <span class="tag-title">{{ tag.title }}</span>
          <!-- 关闭按钮 -->
          <a-button type="text" size="small" class="close-btn" @click.stop="removeTag(tag.id)">
            <template #icon><CloseOutlined /></template>
          </a-button>
        </a-checkable-tag>
      </div>
      <!-- 滚动箭头 - 当标签溢出时显示 -->
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
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { useChatDataStore } from '@/stores/chatData'
import { storeToRefs } from 'pinia'

// 定义组件属性
defineProps({
  /** 头部高度 */
  headerStyleHeight: {
    type: Number,
    required: true,
  },
})

// 路由实例
const route = useRoute()
// 聊天数据存储
const chatDataStore = useChatDataStore()
// 从存储中获取聊天相关的状态
const { getAllChatIdAndTitle, selectedIndex, currentSessionId } = storeToRefs(chatDataStore)
const { removeSession } = chatDataStore

// 标签容器引用和状态
const tagsWrapper = ref<HTMLElement | null>(null)
const showArrows = ref(false)
const scrollLeft = ref(0)
const maxScrollLeft = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startScrollLeft = ref(0)

/**
 * 更新滚动状态
 * 计算是否需要显示箭头和最大滚动距离
 */
const updateScrollState = () => {
  if (!tagsWrapper.value) return
  const { clientWidth, scrollLeft: currentScrollLeft } = tagsWrapper.value

  const lastTag = tagsWrapper.value.lastElementChild as HTMLElement
  if (!lastTag) {
    showArrows.value = false
    maxScrollLeft.value = 0
    scrollLeft.value = 0
    return
  }

  const lastTagRight = lastTag.offsetLeft + lastTag.offsetWidth

  showArrows.value = route.path === '/chat-function' && lastTagRight > clientWidth

  maxScrollLeft.value = Math.max(0, lastTagRight - clientWidth + 20)
  scrollLeft.value = currentScrollLeft

  if (scrollLeft.value < 0) {
    tagsWrapper.value.scrollLeft = 0
  } else if (scrollLeft.value > maxScrollLeft.value) {
    tagsWrapper.value.scrollLeft = maxScrollLeft.value
  }
}

/**
 * 处理鼠标移动事件
 * 实现标签列表的拖拽滚动
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !tagsWrapper.value) return

  e.preventDefault()
  const x = e.pageX - (tagsWrapper.value.offsetLeft || 0)
  const walk = startX.value - x

  let newScrollLeft = startScrollLeft.value + walk
  newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft.value))

  tagsWrapper.value.scrollLeft = newScrollLeft
  scrollLeft.value = newScrollLeft
}

/**
 * 处理鼠标按下事件
 * 初始化拖拽状态
 */
const handleMouseDown = (e: MouseEvent) => {
  if (!tagsWrapper.value) return

  isDragging.value = true
  startX.value = e.pageX
  startScrollLeft.value = tagsWrapper.value.scrollLeft

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  document.body.classList.add('no-select')
}

/**
 * 处理鼠标松开事件
 * 清理拖拽状态
 */
const handleMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  document.body.classList.remove('no-select')
}

/**
 * 处理滚动按钮点击
 * @param direction 滚动方向
 */
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

/**
 * 处理标签容器滚动事件
 */
const handleTagsScroll = () => {
  if (!tagsWrapper.value) return
  scrollLeft.value = tagsWrapper.value.scrollLeft
}

/**
 * 滚动到当前激活的标签
 */
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

    let targetScrollLeft = currentScrollLeft

    if (offsetLeft + offsetWidth > currentScrollLeft + containerWidth) {
      targetScrollLeft = offsetLeft + offsetWidth - containerWidth + 20
    } else if (offsetLeft < currentScrollLeft) {
      targetScrollLeft = offsetLeft - 20
    }

    wrapperEl.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
  })
}

// 监听标签列表变化
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

/**
 * 处理标签切换
 * @param sessionId 会话ID
 */
const handleTagChange = (sessionId: string) => {
  currentSessionId.value = sessionId
  scrollToActiveTag()
}

/**
 * 移除标签
 * @param sessionId 要移除的会话ID
 */
const removeTag = (sessionId: string) => {
  const currentIndex = getAllChatIdAndTitle.value.findIndex((tag) => tag.id === sessionId)
  const isCurrentSession = sessionId === currentSessionId.value

  removeSession(sessionId)

  if (isCurrentSession && getAllChatIdAndTitle.value.length > 0) {
    const newIndex = Math.max(0, currentIndex - 1)
    currentSessionId.value = getAllChatIdAndTitle.value[newIndex].id
  }
}

// 生命周期钩子
onMounted(() => {
  updateScrollState()
  scrollToActiveTag()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
/* 头部容器样式 */
#header {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 24px;
}

/* Logo包装器样式 */
.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Logo样式 */
.logo {
  display: block;
}

/* 标签容器样式 */
.tags-container {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

/* 标签列表包装器样式 */
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

/* 隐藏滚动条 */
.tags-wrapper::-webkit-scrollbar {
  display: none;
}

/* 拖拽时的光标样式 */
.tags-wrapper:active {
  cursor: grabbing;
}

/* 滚动箭头容器样式 */
.tags-arrows {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 8px;
  border-left: 1px solid var(--border-color);
  height: 32px;
}

/* 聊天标签样式 */
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

/* 标签标题样式 */
:deep(.tag-title) {
  display: inline-block;
  line-height: 30px;
}

/* 标签悬停效果 */
:deep(.chat-tag:hover) {
  background: var(--hover-bg);
  border-color: var(--border-color-dark);
}

/* 选中标签样式 */
:deep(.chat-tag.ant-tag-checkable-checked) {
  background: var(--brand-color-light);
  border-color: var(--brand-color);
  color: var(--brand-color);
}

/* 关闭按钮样式 */
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

/* 关闭按钮悬停效果 */
:deep(.close-btn:hover) {
  color: var(--text-primary);
  background: var(--hover-bg);
}

/* 文本按钮样式 */
:deep(.ant-btn-text) {
  color: var(--text-secondary);
}

/* 文本按钮悬停效果 */
:deep(.ant-btn-text:hover:not(:disabled)) {
  color: var(--text-primary);
  background: var(--hover-bg);
}

/* 禁用状态的按钮样式 */
:deep(.ant-btn-text:disabled) {
  color: var(--text-disabled);
}

/* 图标样式 */
:deep(.anticon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* 图片组件样式 */
:deep(.ant-image) {
  display: flex;
  align-items: center;
}

/* 图片样式 */
:deep(.ant-image-img) {
  vertical-align: middle;
}

/* 禁止选择文本的全局样式 */
:global(.no-select) {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  cursor: grabbing !important;
}
</style>
