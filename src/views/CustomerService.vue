<!-- 
客服服务页面
提供用户支持和帮助服务
-->
<template>
  <div class="customer-service">
    <!-- 头部区域 -->
    <div class="hero-section">
      <h1>需要帮助？</h1>
      <p class="subtitle">我们随时为您提供支持</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 快速联系卡片 -->
      <div class="contact-cards">
        <div class="contact-card">
          <MessageOutlined class="card-icon" />
          <h3>在线客服</h3>
          <p>工作时间: 09:00 - 18:00</p>
          <a-button type="primary">立即咨询</a-button>
        </div>

        <div class="contact-card">
          <MailOutlined class="card-icon" />
          <h3>邮件支持</h3>
          <p>24小时内回复</p>
          <a-button type="primary">发送邮件</a-button>
        </div>

        <div class="contact-card">
          <PhoneOutlined class="card-icon" />
          <h3>电话支持</h3>
          <p>+86-10086</p>
          <a-button type="primary">拨打电话</a-button>
        </div>
      </div>

      <!-- 常见问题区域 -->
      <div class="faq-section">
        <h2>常见问题</h2>
        <a-collapse v-model:activeKey="activeKey" :bordered="false">
          <a-collapse-panel key="1" header="如何修改账户信息？">
            <p>
              您可以在"账户设置"中修改个人信息，包括用户名、头像等。如需修改绑定手机或邮箱，请在"账户安全"中操作。
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="忘记密码怎么办？">
            <p>点击登录页面的"忘记密码"，通过绑定的手机号或邮箱进行身份验证后重置密码。</p>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="如何确保账户安全？">
            <p>建议您开启双重认证，定期更改密码，并确保账户绑定手机号和邮箱。</p>
          </a-collapse-panel>
        </a-collapse>
      </div>

      <!-- 社区支持区域 -->
      <div class="community-section">
        <h2>加入我们的社区</h2>
        <div class="community-cards">
          <div class="community-card">
            <WechatOutlined class="community-icon" />
            <div class="community-info">
              <h3>微信社区</h3>
              <p>扫码加入官方微信群</p>
            </div>
            <RightOutlined />
          </div>

          <div class="community-card">
            <QqOutlined class="community-icon" />
            <div class="community-info">
              <h3>QQ 社区</h3>
              <p>QQ群：888888888</p>
            </div>
            <RightOutlined />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  MessageOutlined,
  MailOutlined,
  PhoneOutlined,
  WechatOutlined,
  QqOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'

const activeKey = ref(['1'])
</script>

<style scoped>
.customer-service {
  height: 100%;
  overflow-y: auto;
  background-color: var(--content-bg);
}

/* 头部区域样式 */
.hero-section {
  padding: 48px 24px;
  text-align: center;
  background: linear-gradient(135deg, var(--brand-color) 0%, var(--brand-color-hover) 100%);
  color: white;
}

.hero-section h1 {
  font-size: 2.5em;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

/* 内容区域样式 */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* 联系卡片样式 */
.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.contact-card {
  padding: 32px;
  background: var(--card-bg);
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  font-size: 32px;
  color: var(--brand-color);
  margin-bottom: 16px;
}

.contact-card h3 {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.contact-card p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

/* FAQ 区域样式 */
.faq-section {
  margin-bottom: 48px;
}

.faq-section h2 {
  color: var(--text-primary);
  margin-bottom: 24px;
  font-size: 1.5em;
}

:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-collapse-item) {
  background: var(--card-bg);
  border-radius: 8px !important;
  margin-bottom: 16px;
  border: 1px solid var(--border-color-light) !important;
}

:deep(.ant-collapse-header) {
  color: var(--text-primary) !important;
}

:deep(.ant-collapse-content) {
  color: var(--text-secondary);
  background: var(--card-bg);
}

/* 按钮样式覆盖 */
:deep(.ant-btn) {
  border-radius: 6px;
  height: 36px;
  padding: 0 20px;
  transition: all 0.3s ease;
}

:deep(.ant-btn-primary) {
  background-color: var(--brand-color);
  border-color: var(--brand-color);
}

:deep(.ant-btn-primary:hover) {
  background-color: var(--brand-color-hover);
  border-color: var(--brand-color-hover);
}

:deep(.ant-btn-primary:active) {
  background-color: var(--brand-color-pressed);
  border-color: var(--brand-color-pressed);
}

:deep(.ant-btn-default) {
  border-color: var(--border-color);
  color: var(--text-secondary);
  background: var(--card-bg);
}

:deep(.ant-btn-default:hover) {
  color: var(--brand-color);
  border-color: var(--brand-color);
  background: var(--brand-color-light);
}

:deep(.ant-btn-default:active) {
  color: var(--brand-color-pressed);
  border-color: var(--brand-color-pressed);
  background: var(--brand-color-light);
}

/* 社区支持区域样式 */
.community-section h2 {
  color: var(--text-primary);
  margin-bottom: 24px;
  font-size: 1.5em;
}

.community-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.community-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.community-card:hover {
  background: var(--hover-bg);
  transform: translateX(4px);
}

.community-icon {
  font-size: 24px;
  color: var(--brand-color);
  margin-right: 16px;
}

.community-info {
  flex: 1;
}

.community-info h3 {
  color: var(--text-primary);
  margin-bottom: 4px;
}

.community-info p {
  color: var(--text-secondary);
  margin: 0;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .hero-section {
    padding: 32px 16px;
  }

  .hero-section h1 {
    font-size: 2em;
  }

  .content-container {
    padding: 24px 16px;
  }

  .contact-card,
  .community-card {
    padding: 24px;
  }
}
</style>
