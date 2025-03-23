<!-- 
账户信息页面
用于展示和管理用户的个人信息
-->
<template>
  <div class="account-container">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <a-avatar :size="120" class="user-avatar">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </div>

      <!-- 用户信息区域 -->
      <div class="user-info">
        <div class="info-row">
          <span class="label">用户名</span>
          <span class="value">USER</span>
          <a-button type="link" size="small">
            <template #icon><EditOutlined /></template>
            编辑
          </a-button>
        </div>
        <div class="info-row">
          <span class="label">账号</span>
          <span class="value">user@gmail.com</span>
        </div>
        <div class="info-row">
          <span class="label">注册时间</span>
          <span class="value">2025-03-22</span>
        </div>
      </div>

      <!-- 账户安全区域 -->
      <div class="security-section">
        <h3>账户安全</h3>
        <div class="security-items">
          <div class="security-item">
            <div class="security-info">
              <LockOutlined class="security-icon" />
              <span>修改密码</span>
            </div>
            <a-button type="link">设置</a-button>
          </div>
          <div class="security-item">
            <div class="security-info">
              <MobileOutlined class="security-icon" />
              <span>手机绑定</span>
            </div>
            <a-button type="link">绑定</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, EditOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.account-container {
  height: 100%;
  padding: 24px;
  background-color: var(--content-bg);
  overflow-y: auto;
}

.user-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

/* 头像区域样式 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.user-avatar {
  background: var(--brand-color-light);
  color: var(--brand-color);
  margin-bottom: 16px;
}

/* 用户信息区域样式 */
.user-info {
  padding: 24px 0;
  border-top: 1px solid var(--border-color-light);
  border-bottom: 1px solid var(--border-color-light);
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  width: 80px;
  color: var(--text-secondary);
}

.value {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
}

/* 安全设置区域样式 */
.security-section {
  padding-top: 24px;
}

.security-section h3 {
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 500;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--header-bg);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.security-item:hover {
  background: var(--hover-bg);
}

.security-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
}

.security-icon {
  color: var(--brand-color);
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .account-container {
    padding: 16px;
  }

  .user-card {
    padding: 24px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .label {
    width: auto;
  }
}

/* 按钮样式覆盖 */
:deep(.ant-btn) {
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.ant-btn-link) {
  color: var(--brand-color);
  padding: 4px 8px;
  height: auto;
}

:deep(.ant-btn-link:hover) {
  color: var(--brand-color-hover);
  background: var(--brand-color-light);
}

:deep(.ant-btn-link:active) {
  color: var(--brand-color-pressed);
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
</style>
