<!-- 
产品介绍组件
用于展示产品相关信息
-->
<template>
  <div class="product-introduction">
    <div class="content-container">
      <!-- 产品概览部分 -->
      <section class="product-overview">
        <div class="content-wrapper">
          <h1>产品介绍</h1>
          <div class="product-grid">
            <div class="product-image">
              <div class="image-placeholder">产品图片</div>
            </div>
            <div class="product-info">
              <h2>智能解决方案</h2>
              <p class="description">
                我们的产品采用最新技术，为企业提供全方位的智能化解决方案。通过深度学习和人工智能技术，
                帮助企业实现数字化转型，提升运营效率。
              </p>
              <div class="tags">
                <span class="tag">AI驱动</span>
                <span class="tag">云原生</span>
                <span class="tag">高可用</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 产品特点部分 -->
      <section class="product-features">
        <div class="content-wrapper">
          <h2>产品特点</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🚀</div>
              <h3>高性能</h3>
              <p>采用分布式架构，确保系统高性能运行</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🛡️</div>
              <h3>安全可靠</h3>
              <p>多重安全防护，数据加密存储</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <h3>快速部署</h3>
              <p>支持一键部署，快速上线</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔄</div>
              <h3>灵活扩展</h3>
              <p>模块化设计，支持灵活扩展</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术规格部分 -->
      <section class="product-specs">
        <div class="content-wrapper">
          <h2>技术规格</h2>
          <div class="specs-grid">
            <div class="spec-card">
              <h3>系统要求</h3>
              <ul>
                <li>操作系统：Windows/Linux/MacOS</li>
                <li>处理器：Intel i5 或更高</li>
                <li>内存：8GB 或更高</li>
                <li>存储空间：50GB 可用空间</li>
              </ul>
            </div>
            <div class="spec-card">
              <h3>支持功能</h3>
              <ul>
                <li>多用户协同</li>
                <li>实时数据同步</li>
                <li>自动化部署</li>
                <li>性能监控</li>
              </ul>
            </div>
            <div class="spec-card">
              <h3>技术架构</h3>
              <ul>
                <li>微服务架构</li>
                <li>容器化部署</li>
                <li>分布式存储</li>
                <li>负载均衡</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.product-introduction {
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

/* 产品概览部分 */
.product-overview {
  padding: 20px 0;
  background-color: var(--header-bg);
}

.product-overview h1 {
  font-size: 2.5em;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.product-image {
  aspect-ratio: 16/9;
  background-color: var(--content-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: var(--text-secondary);
  background: linear-gradient(135deg, var(--header-bg) 0%, var(--content-bg) 100%);
}

.product-info h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.description {
  font-size: 1.1em;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.tags {
  display: flex;
  gap: 10px;
}

.tag {
  padding: 6px 12px;
  background-color: var(--brand-color);
  color: white;
  border-radius: 20px;
  font-size: 0.9em;
}

/* 产品特点部分 */
.product-features {
  padding: 80px 0;
  background-color: var(--content-bg);
}

.product-features h2 {
  text-align: center;
  font-size: 2em;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-item {
  padding: 30px;
  background-color: var(--header-bg);
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.feature-item h3 {
  font-size: 1.3em;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.feature-item p {
  color: var(--text-secondary);
}

/* 技术规格部分 */
.product-specs {
  padding: 80px 0;
  background-color: var(--header-bg);
}

.product-specs h2 {
  text-align: center;
  font-size: 2em;
  margin-bottom: 40px;
  color: var(--text-primary);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.spec-card {
  background-color: var(--content-bg);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.spec-card h3 {
  font-size: 1.3em;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.spec-card ul {
  list-style: none;
  padding: 0;
}

.spec-card li {
  color: var(--text-secondary);
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
}

.spec-card li::before {
  content: '•';
  color: var(--brand-color);
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .product-overview h1 {
    font-size: 2em;
  }

  .product-info h2 {
    font-size: 1.8em;
  }

  .features-grid,
  .specs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
