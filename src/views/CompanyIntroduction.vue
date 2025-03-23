<!-- 
公司介绍组件
用于展示公司相关信息
-->
<template>
  <div class="company-introduction">
    <!-- 内容容器 -->
    <div class="content-container">
      <!-- 公司简介部分 -->
      <section class="hero-section">
        <div class="content-wrapper">
          <h1>关于我们</h1>
          <p class="subtitle">创新科技，引领未来</p>
        </div>
      </section>

      <!-- 核心价值观部分 -->
      <section class="values-section">
        <div class="content-wrapper">
          <h2>核心价值观</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="icon">💡</div>
              <h3>创新</h3>
              <p>持续创新，突破技术边界</p>
            </div>
            <div class="value-card">
              <div class="icon">🤝</div>
              <h3>诚信</h3>
              <p>诚信为本，信守承诺</p>
            </div>
            <div class="value-card">
              <div class="icon">🎯</div>
              <h3>专注</h3>
              <p>专注品质，追求卓越</p>
            </div>
            <div class="value-card">
              <div class="icon">🌱</div>
              <h3>成长</h3>
              <p>持续成长，共创价值</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 公司历程部分 -->
      <section class="history-section">
        <div class="content-wrapper">
          <h2>发展历程</h2>
          <div class="timeline">
            <div class="timeline-item">
              <div class="year">2020</div>
              <div class="event">
                <h3>公司成立</h3>
                <p>开启创新科技之旅</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="year">2021</div>
              <div class="event">
                <h3>技术突破</h3>
                <p>成功研发核心技术</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="year">2022</div>
              <div class="event">
                <h3>市场扩张</h3>
                <p>业务版图持续扩大</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="year">2023</div>
              <div class="event">
                <h3>行业领先</h3>
                <p>成为行业标杆企业</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.company-introduction {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 滚动条样式 */
.content-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.content-container::-webkit-scrollbar-track {
  background: var(--scrollbar-auto-track);
  border-radius: 8px;
}

.content-container::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-auto-thumb);
  border-radius: 8px;
  border: 2px solid var(--scrollbar-auto-track);
}

.content-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-auto-thumb);
}

/* 内容容器样式 */
.content-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域样式 */
.hero-section {
  padding: 60px 0;
  background: linear-gradient(135deg, var(--brand-color) 0%, var(--brand-color-hover) 100%);
  color: white;
  text-align: center;
}

.hero-section h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

/* 价值观部分样式 */
.values-section {
  padding: 80px 0;
  background-color: var(--header-bg);
}

.values-section h2 {
  text-align: center;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.value-card {
  background-color: var(--content-bg);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-card .icon {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.value-card h3 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

.value-card p {
  color: var(--text-secondary);
}

/* 历程部分样式 */
.history-section {
  padding: 80px 0;
  background-color: var(--content-bg);
}

.history-section h2 {
  text-align: center;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  margin-bottom: 30px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 100px;
  top: 0;
  bottom: -30px;
  width: 2px;
  background-color: var(--brand-color);
}

.timeline-item:last-child::before {
  display: none;
}

.year {
  width: 100px;
  font-weight: bold;
  color: var(--brand-color);
}

.event {
  flex: 1;
  background-color: var(--header-bg);
  padding: 20px;
  border-radius: 8px;
  margin-left: 20px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.event h3 {
  color: var(--text-primary);
  margin-bottom: 10px;
}

.event p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2em;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .timeline-item {
    flex-direction: column;
  }

  .timeline-item::before {
    left: 0;
  }

  .year {
    margin-bottom: 10px;
  }

  .event {
    margin-left: 0;
  }
}
</style>
