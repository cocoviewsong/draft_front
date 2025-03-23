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
import '@/assets/styles/theme.css'

// 头部高度
const headerStyleHeight = 64

// 定义颜色变量
const colors = {
  // 主色调
  header: 'var(--header-bg)',
  headerAccent: 'var(--header-accent)',
  sider: 'var(--sider-bg)',
  content: 'var(--content-bg)',

  // 阴影
  shadow: 'var(--shadow-color)',

  // 边框
  border: 'var(--border-color)',

  // 品牌色
  primary: 'var(--brand-color)',
  primaryHover: 'var(--brand-color-hover)',

  // 文字
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
}

// Header 样式
const headerStyle: CSSProperties = {
  height: headerStyleHeight + 'px',
  backgroundColor: colors.header,
  borderBottom: `1px solid ${colors.border}`,
  boxShadow: `0 1px 0 ${colors.shadow}`,
  padding: '0 24px',
  position: 'relative',
  zIndex: 1000,
}

// 内层布局样式 (Sider + Content)
const innerLayoutStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  backgroundColor: colors.content,
  position: 'relative',
}

// Sider 样式
const siderStyle: CSSProperties = {
  backgroundColor: colors.sider,
  borderRight: `1px solid ${colors.border}`,
  position: 'relative',
  zIndex: 2,
}

// Content 样式
const contentStyle: CSSProperties = {
  flex: 1,
  backgroundColor: colors.content,
  color: colors.textPrimary,
  position: 'relative',
}
</script>

<style scoped>
/* Sider 内容区域样式 */
.ant-layout-sider-children {
  background-color: var(--sider-bg);
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-auto-track);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-auto-thumb);
  border-radius: 8px;
  border: 2px solid var(--scrollbar-auto-track);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-auto-thumb);
}

/* 全局过渡效果 */
.ant-layout-header,
.ant-layout-sider,
.ant-layout-content {
  transition: all 0.3s ease;
}

/* 选中效果 */
::selection {
  background-color: var(--brand-color);
  color: white;
}

/* 布局阴影优化 */
.ant-layout-header {
  box-shadow: var(--shadow-sm);
}

.ant-layout-sider {
  box-shadow: var(--shadow-sm);
}
</style>
