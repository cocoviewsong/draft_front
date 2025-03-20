<template>
  <a-layout :style="{ height: '100vh', display: 'flex', flexDirection: 'column' }">
    <a-layout-header :style="headerStyle">
      <Header :headerStyleHeight="headerStyleHeight"></Header>
    </a-layout-header>
    <a-layout :style="innerLayoutStyle">
      <a-layout-sider theme="light" :style="siderStyle">
        <Sider></Sider>
      </a-layout-sider>
      <a-layout-content :style="contentStyle">
        <RouterView></RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Header from '@/layout/Header.vue'
import Sider from '@/layout/Sider.vue'
import type { CSSProperties } from 'vue'

// 头部高度
const headerStyleHeight = 64

// 公共样式
const baseStyle: CSSProperties = {
  color: '#fff',
}

// Header 样式
const headerStyle: CSSProperties = {
  ...baseStyle,
  height: headerStyleHeight + 'px',
  backgroundColor: '#fff',
}

// 内层布局样式 (Sider + Content)
const innerLayoutStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
}

// Sider 样式
const siderStyle: CSSProperties = {
  ...baseStyle,
  width: '200px',
}

// Content 样式
const contentStyle: CSSProperties = {
  ...baseStyle,
  flex: 1,
  color: '#333',
  backgroundColor: '',
}
</script>
