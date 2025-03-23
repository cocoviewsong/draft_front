// src/main.ts
import 'normalize.css'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()
themeStore.listenSystemTheme()

app.mount('#app')
