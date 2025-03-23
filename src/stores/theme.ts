import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light')
  const isSystemTheme = ref(true) // 添加标志来表示是否跟随系统

  // 初始化主题
  const initTheme = () => {
    // 获取当前文档的主题（由 index.html 中的脚本设置）
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
    // 检查是否有用户设置的主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isSystemTheme.value = false
    }
    // 只更新 store 中的状态，不重复设置 DOM 属性
    theme.value = currentTheme || 'light'
  }

  // 切换主题
  const setTheme = (newTheme: 'light' | 'dark', system = false) => {
    theme.value = newTheme
    isSystemTheme.value = system
    applyTheme(newTheme)
    if (!system) {
      localStorage.setItem('theme', newTheme)
    } else {
      localStorage.removeItem('theme')
    }
  }

  // 应用主题
  const applyTheme = (currentTheme: string) => {
    document.documentElement.setAttribute('data-theme', currentTheme)
  }

  // 监听系统主题变化
  const listenSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // 只有在跟随系统时才改变主题
      if (isSystemTheme.value) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme, true)
      }
    })
  }

  // 监听主题变化
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    isSystemTheme,
    setTheme,
    initTheme,
    listenSystemTheme,
  }
})
