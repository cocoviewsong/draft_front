<template>
  <div
    style="
      width: 200px;
      height: 100%;
      background-color: var(--sider-bg);
      border-inline-end: 1px solid var(--border-color);
    "
  >
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      :style="menuStyle"
      :inline-collapsed="state.collapsed"
      :items="items"
      @click="(currentItem: MenuItemClickEvent) => handleCurrentItem(currentItem)"
    ></a-menu>
  </div>
</template>

<script setup lang="ts">
import { reactive, h, watch, computed } from 'vue'
import {
  PieChartOutlined,
  DesktopOutlined,
  InboxOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import type { MenuItemClickEvent } from './Sider.types'
import { useRouter, useRoute } from 'vue-router'
import { useChatDataStore } from '@/stores/chatData'

const chatDataStore = useChatDataStore()
const { createNewSession } = chatDataStore

const router = useRouter()
const route = useRoute()

const state = reactive({
  collapsed: false,
  selectedKeys: [''],
})

// 菜单样式
const menuStyle = computed(() => ({
  backgroundColor: 'var(--sider-bg)',
  borderInlineEnd: 'none',
  color: 'var(--text-secondary)',
}))

const items = reactive([
  {
    key: '/home',
    icon: () => h(PieChartOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/chat-function',
    icon: () => h(PieChartOutlined),
    label: '功能',
    title: '功能',
  },
  {
    key: '/company-introduction',
    icon: () => h(DesktopOutlined),
    label: '公司介绍',
    title: '公司介绍',
  },
  {
    key: '/product-introduction',
    icon: () => h(InboxOutlined),
    label: '产品介绍',
    title: '产品介绍',
  },
  {
    key: '/customer-service',
    icon: () => h(InboxOutlined),
    label: '客服',
    title: '客服',
  },
  {
    key: '/account',
    icon: () => h(UserOutlined),
    label: '我的账号',
    title: '我的账号',
  },
  {
    key: '/setting',
    icon: () => h(SettingOutlined),
    label: '设置',
    title: '设置',
  },
])

/**
 * 处理侧边栏点击事件
 */
const handleCurrentItem = (currentItem: MenuItemClickEvent) => {
  // 新建对话
  if (currentItem.key === items[1].key) {
    createNewSession()
  }
  // 路由跳转
  if (route.path !== currentItem.key) {
    router.push(currentItem.key)
  }
}

watch(
  () => route.path,
  (newPath) => {
    state.selectedKeys = [newPath]
  },
)
</script>

<style scoped>
/* 菜单项样式优化 */
:deep(.ant-menu) {
  /* 菜单整体样式 */
  border-inline-end: none !important;
}

:deep(.ant-menu-item) {
  /* 默认状态 */
  color: var(--text-secondary) !important;
}

:deep(.ant-menu-item .anticon) {
  /* 图标颜色 */
  color: var(--text-secondary) !important;
}

:deep(.ant-menu-item:hover) {
  /* 悬停状态 */
  color: var(--brand-color) !important;
  background-color: var(--hover-bg) !important;
}

:deep(.ant-menu-item:hover .anticon) {
  /* 悬停状态的图标 */
  color: var(--brand-color) !important;
}

:deep(.ant-menu-item-selected) {
  /* 选中状态 */
  background-color: var(--brand-color-light) !important;
  color: var(--brand-color) !important;
}

:deep(.ant-menu-item-selected .anticon) {
  /* 选中状态的图标 */
  color: var(--brand-color) !important;
}

:deep(.ant-menu-item-selected:hover) {
  /* 选中项的悬停状态 */
  background-color: var(--brand-color-light) !important;
  color: var(--brand-color-hover) !important;
}

:deep(.ant-menu-item-selected:hover .anticon) {
  /* 选中项悬停状态的图标 */
  color: var(--brand-color-hover) !important;
}

/* 菜单项文字 */
:deep(.ant-menu-title-content) {
  color: inherit;
}

/* 禁用状态 */
:deep(.ant-menu-item-disabled) {
  color: var(--text-disabled) !important;
}

:deep(.ant-menu-item-disabled .anticon) {
  color: var(--text-disabled) !important;
}
</style>
