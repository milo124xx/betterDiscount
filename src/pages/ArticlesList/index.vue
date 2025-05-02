<template>
  <q-page class="articles-list-page">
    <div class="container">
      <div class="page-header">
        <h1 class="text-h4">优惠资讯列表</h1>
        <p class="text-subtitle1 q-mt-sm">实时掌握最新优惠动态</p>
      </div>

      <!-- 文章列表区域 -->
      <div class="articles-section q-mt-md">
        <div v-if="loading" class="loading-container flex flex-center">
          <div class="text-center">
            <q-spinner color="primary" size="3em" />
            <div class="text-grey q-mt-sm">加载文章中...</div>
          </div>
        </div>

        <template v-else-if="articles.length > 0">
          <q-card flat bordered class="articles-list-card">
            <q-list separator>
              <q-item v-for="article in articles" :key="article.id" clickable v-ripple :to="`/article/${article.id}`"
                class="article-item">
                <q-item-section side top v-if="article.image" class="article-image-section">
                  <q-img :src="article.image" :ratio="1" class="article-thumbnail" />
                </q-item-section>

                <q-item-section class="q-py-sm q-px-md">
                  <q-item-label class="text-weight-bold article-title text-primary">{{ article.title }}</q-item-label>
                  <q-item-label caption lines="1" class="article-description q-mt-xs">
                    {{ article.description }}
                  </q-item-label>
                  <div class="article-meta q-mt-sm">
                    <q-badge color="primary" v-if="article.category" class="q-mr-sm">{{ article.category }}</q-badge>
                    <span class="text-grey-7 q-mr-md">
                      <q-icon name="event" size="xs" class="q-mr-xs" /> {{ formatDate(article.publish_date) }}
                    </span>
                    <span class="text-grey-7">
                      <q-icon name="visibility" size="xs" class="q-mr-xs" /> {{ article.views }} 浏览
                    </span>
                  </div>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="arrow_forward_ios" color="primary" size="sm" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <!-- 分页控件 -->
          <div class="pagination-container" v-if="totalPages > 1">
            <q-pagination v-model="currentPage" :max="totalPages" :max-pages="6" boundary-numbers direction-links
              boundary-links color="primary" @update:model-value="handlePageChange" class="q-mt-md" />
            <div class="pagination-info text-grey-7 text-center q-mt-sm">
              共 {{ totalArticles }} 篇文章，当前第 {{ currentPage }}/{{ totalPages }} 页
            </div>
          </div>
        </template>

        <div v-else class="no-articles flex flex-center">
          <div class="text-center">
            <q-icon name="article" size="5em" color="grey-4" />
            <p class="text-h6 text-grey-7 q-mt-md">暂无文章</p>
            <p class="text-grey-6">我们正在准备更多精彩内容，请稍后再来查看</p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// 添加组件名称
defineOptions({
  name: 'ArticlesListPage'
})

import { ref, computed, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { useHead } from '@vueuse/head'
import { generateSeoMeta } from 'src/utils/seo'
import { articleApi } from 'src/api/articles'

const $q = useQuasar()
const { formatDate: qFormatDate } = date

// SEO配置
useHead(
  generateSeoMeta({
    title: '优惠资讯文章列表 - 掌握最新优惠动态',
    description: '浏览最新优惠资讯文章，了解各大电商平台的优惠活动、折扣信息、购物技巧和省钱攻略，让您的网购更加划算。',
    keywords: '优惠资讯,折扣信息,购物技巧,省钱攻略,优惠券使用,电商活动,淘宝优惠,京东促销,拼多多特价',
    url: '/articles'
  })
)

// 状态变量
const loading = ref(false)
const articles = ref([])
const currentPage = ref(1)
const perPage = ref(15) // 每页显示的文章数，调整为15篇
const totalArticles = ref(0)

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(totalArticles.value / perPage.value)
})

// 获取文章列表数据
async function fetchArticles() {
  loading.value = true
  try {
    const response = await articleApi.getArticles({
      status: 'published',
      sort: 'newest', // 按添加日期降序排列
      limit: perPage.value,
      offset: (currentPage.value - 1) * perPage.value
    })

    console.log('文章列表页API返回数据:', response)

    // 适配API返回格式
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        articles.value = response
        totalArticles.value = response.length
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        articles.value = response.data
        totalArticles.value = response.total || response.data.length
      } else {
        articles.value = []
        totalArticles.value = 0
      }
    } else {
      articles.value = []
      totalArticles.value = 0
    }

    console.log('处理后的articles数据:', articles.value)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    $q.notify({
      type: 'negative',
      message: '获取文章数据失败'
    })
    articles.value = []
    totalArticles.value = 0
  } finally {
    loading.value = false
  }
}

// 格式化日期 - 修改为简短格式
function formatDate(dateString) {
  if (!dateString) return '未知日期'
  try {
    return qFormatDate(new Date(dateString), 'MM-DD')
  } catch {
    return dateString
  }
}

// 页面变化处理
function handlePageChange(page) {
  currentPage.value = page
  fetchArticles()
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 页面加载时获取数据
onMounted(() => {
  fetchArticles()
})
</script>

<style lang="scss" scoped>
.articles-list-page {
  padding: 20px 0;

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .page-header {
    margin-bottom: 16px;

    h1 {
      font-weight: 600;
      margin: 0;
      color: #333;
      font-size: 1.6rem;

      @media (max-width: 599px) {
        font-size: 1.3rem;
      }
    }

    p {
      color: var(--q-primary);
      margin: 0;
      font-size: 0.9rem;
    }
  }

  .articles-section {
    min-height: 400px;
  }

  .articles-list-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  }

  .article-item {
    padding: 0;
    transition: background-color 0.2s ease;
    min-height: 80px;

    &:hover {
      background-color: #f7f7f7;
    }

    .article-title {
      font-size: 1rem;
      line-height: 1.3;
      margin-bottom: 2px;

      @media (max-width: 599px) {
        font-size: 0.9rem;
      }
    }

    .article-description {
      margin-top: 2px;
      color: #666;
      font-size: 0.85rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;

      @media (max-width: 599px) {
        font-size: 0.8rem;
      }
    }

    .article-image-section {
      padding: 8px 0 8px 8px;
      min-width: 90px;
      max-width: 90px;
      height: 100%;
      display: flex;
      align-items: flex-start;

      @media (max-width: 599px) {
        min-width: 70px;
        max-width: 70px;
      }

      .article-thumbnail {
        width: 80px;
        height: 80px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        object-fit: cover;

        @media (max-width: 599px) {
          width: 60px;
          height: 60px;
        }
      }
    }

    .article-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.75rem;
      margin-top: 4px;

      @media (max-width: 599px) {
        font-size: 0.7rem;
      }
    }
  }

  .loading-container,
  .no-articles {
    min-height: 300px;
  }

  .pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24px;

    @media (max-width: 599px) {
      .q-pagination {
        font-size: 0.8rem;
      }
    }
  }

  .pagination-info {
    font-size: 0.8rem;
    margin-top: 8px;

    @media (max-width: 599px) {
      font-size: 0.7rem;
    }
  }
}
</style>
