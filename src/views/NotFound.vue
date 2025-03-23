<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">
        <span class="digit">4</span>
        <div class="planet-container">
          <div class="planet">
            <div class="crater"></div>
            <div class="crater"></div>
            <div class="crater"></div>
          </div>
        </div>
        <span class="digit">4</span>
      </div>
      <h1>迷失在数字宇宙中</h1>
      <p>抱歉，您要访问的页面可能已经穿越到平行宇宙了</p>
      <router-link to="/home" class="back-btn">
        <span>返回首页</span>
        <div class="stars">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--content-bg), var(--header-bg));
  overflow: hidden;
  position: relative;
}

.content {
  text-align: center;
  z-index: 1;
}

.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.digit {
  font-size: 120px;
  font-weight: bold;
  color: var(--brand-color);
  text-shadow: 0 0 20px var(--brand-color-hover);
  animation: pulse 2s infinite;
}

.planet-container {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 6s ease-in-out infinite;
}

.planet {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--brand-color), var(--brand-color-hover));
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 60px rgba(124, 92, 255, 0.3);
  animation: rotate 20s linear infinite;
}

.crater {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(2px);
}

.crater:nth-child(1) {
  width: 30px;
  height: 30px;
  top: 20px;
  left: 25px;
}

.crater:nth-child(2) {
  width: 20px;
  height: 20px;
  top: 50px;
  right: 20px;
}

.crater:nth-child(3) {
  width: 25px;
  height: 25px;
  bottom: 15px;
  left: 40px;
}

h1 {
  font-size: 32px;
  color: var(--text-primary);
  margin-bottom: 16px;
}

p {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: var(--brand-color);
  color: white;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.back-btn:hover {
  background: var(--brand-color-hover);
  transform: translateY(-2px);
}

.back-btn span {
  position: relative;
  z-index: 1;
}

.stars {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  position: relative;
  z-index: 1;
}

.stars span {
  display: inline-block;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  margin-right: 3px;
  opacity: 0;
  animation: twinkle 1.5s infinite;
}

.stars span:nth-child(2) {
  animation-delay: 0.5s;
}

.stars span:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .digit {
    font-size: 80px;
  }

  .planet-container {
    width: 80px;
    height: 80px;
  }

  .planet {
    width: 70px;
    height: 70px;
  }

  h1 {
    font-size: 24px;
  }

  p {
    font-size: 16px;
  }
}
</style>
