<template>
  <div class="article-detail-page">
    <div class="container q-py-lg">
      <!-- 加载中状态 -->
      <div v-if="loading" class="row justify-center q-py-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md text-center full-width">正在加载文章内容...</div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="row justify-center q-py-xl">
        <div class="error-container text-center">
          <q-icon name="error_outline" color="negative" size="3em" />
          <h5 class="text-negative q-mt-md q-mb-sm">加载文章失败</h5>
          <p class="text-grey">{{ error }}</p>
          <q-btn color="primary" label="返回首页" to="/" class="q-mt-md" />
        </div>
      </div>

      <!-- 文章内容 -->
      <div v-else-if="article" class="article-layout">
        <!-- 文章主体内容 -->
        <div class="article-main">
          <div class="article-main-content">
            <!-- 文章标题和分类 -->
            <div class="article-header">
              <div class="category-tag">{{ article.category }}</div>
              <h1 class="article-title">{{ article.title }}</h1>
              <div class="article-meta">
                <div class="article-date">
                  <q-icon name="event" size="sm" />
                  <span>{{ formatDate(article.publish_date || article.date) }}</span>
                </div>
                <div v-if="article.author" class="article-author">
                  <q-icon name="person" size="sm" />
                  <span>{{ article.author }}</span>
                </div>
              </div>
            </div>

            <!-- 文章图片 -->
            <q-img v-if="article.image" :src="article.image" class="article-main-image q-mb-lg" :ratio="16 / 9">
              <template v-slot:error>
                <div class="image-error">
                  <q-icon name="image_not_supported" size="3em" color="grey-6" />
                  <div class="q-mt-sm">图片加载失败</div>
                </div>
              </template>
            </q-img>

            <!-- 文章内容 -->
            <div class="article-content" v-html="formatContent(article.content)"></div>

            <!-- 分享按钮 -->
            <div class="article-share q-mt-lg">
              <p class="text-h6">分享文章</p>
              <div class="share-buttons">
                <q-btn flat round class="share-btn wechat-btn" @click="shareToWeChat">
                  <q-icon name="img:/icons/wechat-logo.png" size="24px" />
                  <q-tooltip>分享到微信</q-tooltip>
                </q-btn>
                <q-btn flat round class="share-btn weibo-btn" @click="shareToWeibo">
                  <q-icon name="img:/icons/Weibo_logo.png" size="24px" />
                  <q-tooltip>分享到微博</q-tooltip>
                </q-btn>
                <q-btn flat round class="share-btn toutiao-btn" @click="shareToToutiao">
                  <q-icon name="img:/icons/toutiao-logo.png" size="24px" />
                  <q-tooltip>分享到今日头条</q-tooltip>
                </q-btn>
                <q-btn flat round class="share-btn link-btn" @click="copyArticleLink">
                  <q-icon name="content_copy" size="24px" />
                  <q-tooltip>复制链接</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- 相关文章 -->
            <div v-if="relatedArticles.length > 0" class="related-articles q-mt-xl">
              <h2 class="section-title">相关推荐</h2>
              <div class="row q-col-gutter-md">
                <div v-for="article in relatedArticles" :key="article.id" class="col-xs-12 col-sm-6 col-md-4 q-mb-md">
                  <ArticleCard :article="article" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧栏 -->
        <div class="article-sidebar">
          <div class="sidebar-sticky">
            <!-- 今日推荐商品 -->
            <div class="recommended-products">
              <h2 class="section-title">今日推荐</h2>
              <div v-if="recommendedProducts.length > 0" class="recommended-products-grid">
                <div v-for="product in recommendedProducts" :key="product.id" class="product-item">
                  <ProductCard :product="product" />
                </div>
              </div>
              <div v-else class="no-products-placeholder q-pa-md text-center">
                <q-icon name="shopping_bag" size="2em" color="grey-5" />
                <p class="q-mt-sm text-grey-8">暂无推荐商品</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { generateArticleSeoMeta } from 'src/utils/seo'
import { articleApi } from 'src/api/articles'
import { productApi } from 'src/api/products'
import ArticleCard from 'src/pages/IndexPage/components/ArticleCard.vue'
import ProductCard from 'src/components/ProductCard.vue'
import { Notify } from 'quasar'

// 定义组件名称
defineOptions({
  name: 'ArticleDetailPage'
})

const route = useRoute()

// 状态管理
const article = ref(null)
const relatedArticles = ref([])
const recommendedProducts = ref([])
const loading = ref(true)
const error = ref(null)

// 动态SEO配置
const seoMetaData = computed(() => {
  if (!article.value) {
    return generateArticleSeoMeta({
      title: '文章加载中',
      summary: '正在加载文章内容，请稍候...',
      tags: '优惠,折扣,文章',
      id: route.params.id
    })
  }

  // 从文章内容生成摘要
  let summary = article.value.summary || article.value.description
  if (!summary && article.value.content) {
    // 如果没有摘要，从内容中提取前150个字符作为摘要
    summary = article.value.content
      .replace(/<[^>]+>/g, '') // 去除HTML标签
      .replace(/\s+/g, ' ') // 将多个空白符替换为单个空格
      .trim()
      .substring(0, 150) + '...'
  }

  return generateArticleSeoMeta({
    title: article.value.title,
    summary: summary,
    tags: article.value.tags || article.value.category || '优惠资讯',
    id: article.value.id,
    coverImage: article.value.image
  })
})

// 应用SEO配置
useHead(seoMetaData)

// 获取文章详情
async function fetchArticleDetail() {
  loading.value = true
  error.value = null

  try {
    const articleId = route.params.id
    if (!articleId) {
      throw new Error('文章ID无效')
    }

    // 获取文章详情
    const articleData = await articleApi.getArticle(articleId)
    article.value = articleData

    // 获取相关文章（相同分类的其他文章）
    if (articleData.category) {
      const relatedData = await articleApi.getArticles({
        category: articleData.category,
        limit: 6,
        // 排除当前文章
        exclude: articleId
      })

      // 处理API可能返回的不同格式
      if (Array.isArray(relatedData)) {
        relatedArticles.value = relatedData.filter(a => a.id !== articleId).slice(0, 3)
      } else if (relatedData.data) {
        relatedArticles.value = relatedData.data.filter(a => a.id !== articleId).slice(0, 3)
      }
    }

    // 获取推荐商品
    const productsData = await productApi.getProducts({
      limit: 4,
      sort: 'popular'
    })

    // 处理API可能返回的不同格式
    if (Array.isArray(productsData)) {
      recommendedProducts.value = productsData.slice(0, 4).map(formatProductForCard);
    } else if (productsData.data) {
      recommendedProducts.value = productsData.data.slice(0, 4).map(formatProductForCard);
    }

  } catch (err) {
    console.error('加载文章失败:', err)
    error.value = err.message || '加载文章失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

// 格式化文章内容，处理HTML内容安全性和样式
function formatContent(content) {
  if (!content) return ''
  // 这里可以添加内容处理逻辑，如安全过滤、样式增强等
  return content
}

// 格式化商品数据，参考首页实现
function formatProductForCard(product) {
  if (!product) return null;

  console.log('格式化前的商品数据:', product);

  let imageUrl = '';

  // 尝试获取图片URL
  try {
    // 对于后端API返回的数据，images可能是字符串或数组
    const images = typeof product.images === 'string'
      ? JSON.parse(product.images || '[]')
      : (Array.isArray(product.images) ? product.images : []);

    imageUrl = images[0] || '';
    console.log('解析后的图片URL:', imageUrl);
  } catch (error) {
    console.error('图片解析错误:', error);
  }

  // 确保所有必要的字段都有默认值
  const formattedProduct = {
    id: product.id || 'temp-' + Math.random().toString(36).substring(2, 10),
    title: product.title || '未命名产品',
    currentPrice: typeof product.final_price === 'number'
      ? product.final_price
      : (parseFloat(product.final_price) || 0),
    originalPrice: typeof product.original_price === 'number'
      ? product.original_price
      : (parseFloat(product.original_price) || 0),
    image: imageUrl || product.image || 'https://placehold.co/300x200/e0e0e0/cccccc?text=暂无图片',
    platform: product.platform || 'other'
  };

  console.log('格式化后的商品数据:', formattedProduct);

  return formattedProduct;
}

// 复制文章链接
function copyArticleLink() {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    Notify.create({
      message: '文章链接已复制到剪贴板',
      color: 'positive',
      icon: 'content_copy',
      position: 'top'
    })
  }).catch(err => {
    console.error('复制失败:', err)
    Notify.create({
      message: '复制链接失败',
      color: 'negative',
      icon: 'error',
      position: 'top'
    })
  })
}

// 分享到微信
function shareToWeChat() {
  Notify.create({
    message: '分享到微信功能暂未实现',
    color: 'info',
    icon: 'info',
    position: 'top'
  })
}

// 分享到微博
function shareToWeibo() {
  Notify.create({
    message: '分享到微博功能暂未实现',
    color: 'info',
    icon: 'info',
    position: 'top'
  })
}

// 分享到今日头条
function shareToToutiao() {
  Notify.create({
    message: '分享到今日头条功能暂未实现',
    color: 'info',
    icon: 'info',
    position: 'top'
  })
}

// 日期格式化函数
function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString // 如果日期无效，返回原始字符串

    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Intl.DateTimeFormat('zh-CN', options).format(date)
  } catch (error) {
    console.error('日期格式化错误:', error)
    return dateString
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchArticleDetail()
})
</script>

<style lang="scss">
@import './styles/ArticleDetail.scss';
</style>
