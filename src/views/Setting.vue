<template>
  <div class="settings-container">
    <h1 class="settings-title">设置</h1>

    <div class="settings-section">
      <h2 class="section-title">主题设置</h2>

      <div class="theme-switcher">
        <div
          class="theme-option"
          :class="{ active: themeStore.theme === 'light' && !themeStore.isSystemTheme }"
          @click="themeStore.setTheme('light')"
        >
          <div class="theme-preview light">
            <div class="preview-header"></div>
            <div class="preview-sidebar"></div>
            <div class="preview-content"></div>
          </div>
          <span>浅色主题</span>
        </div>

        <div
          class="theme-option"
          :class="{ active: themeStore.theme === 'dark' && !themeStore.isSystemTheme }"
          @click="themeStore.setTheme('dark')"
        >
          <div class="theme-preview dark">
            <div class="preview-header"></div>
            <div class="preview-sidebar"></div>
            <div class="preview-content"></div>
          </div>
          <span>深色主题</span>
        </div>

        <div
          class="theme-option"
          :class="{ active: themeStore.isSystemTheme }"
          @click="followSystem"
        >
          <div class="theme-preview" :class="getSystemTheme()">
            <div class="preview-header"></div>
            <div class="preview-sidebar"></div>
            <div class="preview-content"></div>
          </div>
          <span>跟随系统</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 获取系统主题
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 跟随系统主题
const followSystem = () => {
  themeStore.setTheme(getSystemTheme(), true)
}
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.settings-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  color: var(--text-primary);
}

.settings-section {
  background: var(--header-bg);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.theme-switcher {
  display: flex;
  gap: 20px;
}

.theme-option {
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.theme-option:hover {
  background: var(--header-accent);
}

.theme-option.active {
  border-color: var(--brand-color);
}

.theme-option span {
  color: var(--text-primary);
  font-size: 14px;
}

.theme-preview {
  width: 200px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
}

.preview-header {
  height: 20px;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}

.preview-sidebar {
  width: 40px;
  background-color: var(--sider-bg);
  border-right: 1px solid var(--border-color);
}

.preview-content {
  flex: 1;
  background-color: var(--content-bg);
}
</style>
