<!-- App.vue - 应用程序的根组件 -->
<template>
  <!-- 使用 a-layout 作为最外层容器，设置全屏高度和flex布局 -->
  <a-layout :style="{ height: '100vh', display: 'flex', flexDirection: 'column' }">
    <!-- 顶部导航栏 -->
    <a-layout-header :style="headerStyle">
      <Header :headerStyleHeight="headerStyleHeight"></Header>
    </a-layout-header>

    <!-- 主要内容区域 - 包含侧边栏和内容区 -->
    <a-layout :style="innerLayoutStyle">
      <!-- 侧边栏 - 使用light主题 -->
      <a-layout-sider theme="light" :style="siderStyle">
        <Sider></Sider>
      </a-layout-sider>

      <!-- 内容区域 - 用于显示路由组件 -->
      <a-layout-content :style="contentStyle">
        <RouterView></RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
// 导入必要的组件和样式
import Header from '@/layout/Header.vue'
import Sider from '@/layout/Sider.vue'
import type { CSSProperties } from 'vue'
import '@/assets/styles/theme.css'

// 定义布局常量
const headerStyleHeight = 64

// 定义布局样式
// 头部样式：固定高度、背景色、边框和阴影
const headerStyle: CSSProperties = {
  height: `${headerStyleHeight}px`,
  backgroundColor: 'var(--header-bg)',
  borderBottom: '1px solid var(--border-color)',
  boxShadow: '0 1px 0 var(--shadow-color)',
  padding: '0 24px',
  position: 'relative',
  zIndex: 1000,
}

// 内部布局样式：使用flex布局，占满剩余空间
const innerLayoutStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  backgroundColor: 'var(--content-bg)',
  position: 'relative',
}

// 侧边栏样式：设置背景色和边框
const siderStyle: CSSProperties = {
  backgroundColor: 'var(--sider-bg)',
  borderRight: '1px solid var(--border-color)',
  position: 'relative',
  zIndex: 2,
}

// 内容区样式：占满剩余空间，设置背景色和文字颜色
const contentStyle: CSSProperties = {
  flex: 1,
  backgroundColor: 'var(--content-bg)',
  color: 'var(--text-primary)',
  position: 'relative',
}
</script>

<style scoped>
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

/* 布局过渡效果 */
.ant-layout-header,
.ant-layout-sider,
.ant-layout-content {
  transition: all 0.3s ease;
}

/* 文本选中效果 */
::selection {
  background-color: var(--brand-color);
  color: white;
}

/* 布局阴影效果 */
.ant-layout-header,
.ant-layout-sider {
  box-shadow: var(--shadow-sm);
}
</style>
