<template>
  <div style="width: 200px">
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="light"
      :inline-collapsed="state.collapsed"
      :items="items"
      @click="(currentItem: MenuItemClickEvent) => handleCurrentItem(currentItem)"
    ></a-menu>
  </div>
</template>

<script setup lang="ts">
import { reactive, h, watch } from 'vue'
import {
  PieChartOutlined,
  DesktopOutlined,
  InboxOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import type { MenuItemClickEvent } from './Sider.types'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const state = reactive({
  collapsed: false,
  selectedKeys: [''],
})

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

const handleCurrentItem = (currentItem: MenuItemClickEvent) => {
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
