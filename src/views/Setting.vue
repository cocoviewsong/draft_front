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
            <div class="preview-header" style="height: 20px"></div>
            <div style="display: flex; flex: 1">
              <div class="preview-sidebar" style="width: 40px"></div>
              <div class="preview-content" style="flex: 1"></div>
            </div>
          </div>
          <span>浅色主题</span>
        </div>

        <div
          class="theme-option"
          :class="{ active: themeStore.theme === 'dark' && !themeStore.isSystemTheme }"
          @click="themeStore.setTheme('dark')"
        >
          <div class="theme-preview dark">
            <div class="preview-header" style="height: 20px"></div>
            <div style="display: flex; flex: 1">
              <div class="preview-sidebar" style="width: 40px"></div>
              <div class="preview-content" style="flex: 1"></div>
            </div>
          </div>
          <span>深色主题</span>
        </div>

        <div
          class="theme-option"
          :class="{ active: themeStore.isSystemTheme }"
          @click="followSystem"
        >
          <div class="theme-preview" :class="getSystemTheme()">
            <div class="preview-header" style="height: 20px"></div>
            <div style="display: flex; flex: 1">
              <div class="preview-sidebar" style="width: 40px"></div>
              <div class="preview-content" style="flex: 1"></div>
            </div>
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

/* 主题切换器容器 */
.theme-switcher {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 12px;
  border-radius: 12px;
  background: var(--card-bg);
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: 100%;
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
  width: 100%;

  &:hover {
    background: var(--header-accent);
  }

  &.active {
    border-color: var(--brand-color);
    background: var(--brand-color-light);
  }

  span {
    color: var(--text-primary);
    font-size: 14px;
  }
}

.theme-preview {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);

  /* 浅色主题预览 */
  &.light {
    .preview-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
    }

    .preview-sidebar {
      background-color: #ffffff;
      border-right: 1px solid #e5e7eb;
    }

    .preview-content {
      background-color: #f3f4f6;
    }
  }

  /* 深色主题预览 */
  &.dark {
    .preview-header {
      background-color: #1a1b26;
      border-bottom: 1px solid #24283b;
    }

    .preview-sidebar {
      background-color: #24283b;
      border-right: 1px solid #24283b;
    }

    .preview-content {
      background-color: #1a1b26;
    }
  }
}

/* 移除原有的预览样式 */
.preview-header,
.preview-sidebar,
.preview-content {
  transition: all 0.3s ease;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .theme-switcher {
    grid-template-columns: 1fr;
  }

  .theme-preview {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
