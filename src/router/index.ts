import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const viewModules = import.meta.glob('@/views/*.vue')

const routes: RouteRecordRaw[] = Object.keys(viewModules)
  .map((path) => {
    const matchResult = path.match(/\/([^/]+)\.vue$/)

    if (!matchResult || !matchResult[1]) {
      console.warn(`路由生成警告: 无法解析文件路径 "${path}"`)
      return null
    }

    const name = matchResult[1]
    const routePath =
      name === 'Home'
        ? '/home'
        : `/${name
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .substring(1)}`

    return {
      path: routePath,
      name: name,
      component: async () => {
        try {
          return await viewModules[path]()
        } catch (err) {
          console.error(`加载组件失败: ${path}`, err)
          return {
            template: `
                <div class="error-component">
                  <h2>组件加载失败</h2>
                  <p>很抱歉，页面加载出现问题。请尝试刷新或返回首页。</p>
                </div>
              `,
          }
        }
      },
    } as RouteRecordRaw
  })
  .filter((route): route is RouteRecordRaw => route !== null)

routes.unshift({
  path: '/',
  redirect: '/home',
} as RouteRecordRaw)

routes.push({
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: async () => {
    try {
      return await import('@/views/NotFound.vue')
    } catch (error) {
      console.error('404 页面加载失败:', error)
      return {
        template: `
          <div style="text-align: center; padding: 50px;">
            <h1>页面未找到</h1>
            <p>并且 404 页面组件也加载失败了</p>
          </div>`,
      }
    }
  },
} as RouteRecordRaw)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.onError((error) => {
  console.error('路由错误:', error)
})

export default router
