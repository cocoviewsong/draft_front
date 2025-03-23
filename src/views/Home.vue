<template>
  <div class="home">
    <!-- 导航栏 -->
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <h2>Logo</h2>
        </div>
        <a-menu mode="horizontal" v-model:selectedKeys="selectedKeys">
          <a-menu-item key="home">首页</a-menu-item>
          <a-menu-item key="services">服务</a-menu-item>
          <a-menu-item key="about">关于我们</a-menu-item>
          <a-menu-item key="contact">联系我们</a-menu-item>
        </a-menu>
      </div>
    </a-layout-header>

    <!-- 可滚动的内容区域 -->
    <div class="content-container">
      <!-- Hero区域 -->
      <div class="hero">
        <div class="hero-content">
          <h1>欢迎来到我们的平台</h1>
          <p>这里是一个专业的服务平台，为您提供最优质的解决方案</p>
          <a-button type="primary" size="large" class="home-button"> 立即开始 </a-button>
        </div>
      </div>

      <!-- 特色区域 -->
      <div class="features">
        <div class="feature-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <a-layout-footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>关于我们</h3>
            <p>我们致力于为客户提供最优质的服务</p>
          </div>
          <div class="footer-section">
            <h3>联系方式</h3>
            <p>邮箱：contact@example.com</p>
            <p>电话：123-456-7890</p>
          </div>
          <div class="footer-section">
            <h3>关注我们</h3>
            <div class="social-links">
              <a href="#"><WechatOutlined /></a>
              <a href="#"><WeiboOutlined /></a>
              <a href="#"><GithubOutlined /></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 您的公司名称. 保留所有权利</p>
        </div>
      </a-layout-footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  WechatOutlined,
  WeiboOutlined,
  GithubOutlined,
  CloudServerOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons-vue'

const selectedKeys = ref(['home'])

const features = [
  {
    icon: CloudServerOutlined,
    title: '云服务',
    description: '提供稳定可靠的云计算服务',
  },
  {
    icon: SafetyCertificateOutlined,
    title: '安全保障',
    description: '全方位的数据安全保护',
  },
  {
    icon: TeamOutlined,
    title: '团队协作',
    description: '高效的团队协作解决方案',
  },
  {
    icon: CustomerServiceOutlined,
    title: '客户支持',
    description: '24/7全天候技术支持',
  },
]
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: var(--header-bg);
  box-shadow: 0 2px 8px var(--shadow-color);
  width: 100%;
  z-index: 1000;
  flex-shrink: 0;
}

/* 菜单样式 */
:deep(.ant-menu) {
  background: transparent;
  border-bottom: none;
  color: var(--text-primary);
}

:deep(.ant-menu-item) {
  color: var(--text-secondary);
}

:deep(.ant-menu-item:hover) {
  color: var(--brand-color) !important;
}

:deep(.ant-menu-item-selected) {
  color: var(--brand-color) !important;
}

:deep(.ant-menu-horizontal > .ant-menu-item) {
  border-bottom: 2px solid transparent;
}

:deep(.ant-menu-horizontal > .ant-menu-item-selected::after),
:deep(.ant-menu-horizontal > .ant-menu-item:hover::after) {
  border-bottom-color: var(--brand-color) !important;
}

:deep(.ant-menu-horizontal > .ant-menu-item:not(.ant-menu-item-selected):not(:hover)::after) {
  border-bottom: none !important;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo h2 {
  margin: 0;
  color: var(--brand-color);
}

/* 添加一个内容容器来处理滚动 */
.content-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* 重要：确保 flex 子项可以正确滚动 */
}

.hero {
  padding: 60px 20px 80px;
  background: linear-gradient(135deg, var(--brand-color) 0%, var(--brand-color-hover) 100%);
  color: white;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;

  .home-button {
    background-color: var(--brand-color);
    border-color: var(--brand-color);
  }

  .home-button:hover {
    background-color: var(--brand-color-hover);
    border-color: var(--brand-color-hover);
  }
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: white;
}

.hero p {
  font-size: 1.2em;
  margin-bottom: 30px;
  opacity: 0.9;
}

.features {
  padding: 80px 20px;
  background: var(--header-bg);
}

.feature-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.feature-card {
  background: var(--content-bg);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5em;
  color: var(--brand-color);
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
}

.footer {
  background: var(--header-bg);
  color: var(--text-primary);
  padding: 60px 20px 20px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h3 {
  color: var(--text-primary);
  margin-bottom: 20px;
}

.footer-section p {
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-links a {
  color: var(--text-secondary);
  font-size: 24px;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--brand-color);
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.footer-bottom p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2em;
  }

  .hero p {
    font-size: 1em;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
