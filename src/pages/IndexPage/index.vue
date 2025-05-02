<template>
  <q-page class="home-page">
    <!-- 搜索区域 -->

    <!-- 主要内容区域 -->
    <div class="main-content q-pt-lg">
      <!-- 分类导航入口 -->
      <div class="categories-section container page-section">
        <div class="section-content">
          <h2 class="section-title">
            <span class="text-primary">精选分类</span>
            <small>探索精心策划的购物分类</small>
          </h2>
          <div class="row q-col-gutter-xl">
            <div class="col-md col-sm-6 col-xs-12" v-for="category in categories" :key="category.id">
              <CategoryCard :category="category" class="card-component" />
            </div>
          </div>
        </div>
      </div>

      <!-- 商品展示区 -->
      <div class="products-section container page-section has-background">
        <div class="section-content">
          <div class="section-header">
            <h2 class="section-title">
              <span class="text-primary">今日特惠</span>
              <small>精选实时优惠，助您轻松购物</small>
            </h2>
            <q-btn flat rounded color="primary" class="q-px-md" label="查看全部" icon-right="arrow_forward" @click="goToTodayDeals" />
          </div>
          <div class="row q-col-gutter-md">
            <div v-if="loading.products" class="col-12 loading-container">
              <q-spinner color="primary" size="3em" />
              <div class="loading-text q-mt-sm">加载商品中...</div>
            </div>
            <template v-else>
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12" v-for="product in displayedProducts" :key="product.id">
                <ProductCard :product="formatProductForCard(product)" class="card-component" />
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 优惠文章导航 -->
      <div class="articles-section container page-section">
        <div class="section-content">
          <div class="section-header">
            <h2 class="section-title">
              <span class="text-primary">精选优惠资讯</span>
              <small>实时掌握最新优惠动态</small>
            </h2>
            <q-btn flat rounded color="primary" class="q-px-md" label="浏览全部" icon-right="arrow_forward" @click="goToArticlesList" />
          </div>

          <div class="row q-col-gutter-md">
            <div v-if="loading.articles" class="col-12 loading-container">
              <q-spinner color="primary" size="3em" />
              <div class="loading-text q-mt-sm">加载文章中...</div>
            </div>
            <template v-else>
              <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" v-for="article in displayedArticles" :key="article.id">
                <ArticleCard :article="formatArticleForCard(article)" class="card-component" />
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 管理员入口 -->
      <div class="admin-entry">
        <q-btn flat color="grey-7" label="管理员入口" icon="admin_panel_settings" @click="goToAdmin" />
      </div>
    </div>

    <!-- 管理员登录对话框 -->
    <AdminLoginDialog v-model="showAdminDialog" @login="handleAdminLogin" />
  </q-page>
</template>

<script setup>
// 添加组件名称，解决 ESLint 错误
defineOptions({
  name: 'IndexPageComponent'
})

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import ProductCard from 'components/ProductCard.vue'
import CategoryCard from './components/CategoryCard.vue'
import ArticleCard from './components/ArticleCard.vue'
import AdminLoginDialog from './components/AdminLoginDialog.vue'
import { productApi } from 'src/api/products'
import { articleApi } from 'src/api/articles'

const router = useRouter()
const $q = useQuasar()


// 加载状态
const loading = ref({
  products: false,
  articles: false
})

// 分类数据 - 目前没有后端API支持，仍使用前端硬编码数据
const categories = ref([
  {
    id: 1,
    title: '生活用品',
    description: '精选日常必备',
    icon: 'home',
    color: 'indigo'
  },
  {
    id: 2,
    title: '个护美妆',
    description: '焕发自然光彩',
    icon: 'spa',
    color: 'deep-purple'
  },
  {
    id: 3,
    title: '健康食品',
    description: '营养均衡生活',
    icon: 'restaurant_menu',
    color: 'teal'
  },
  {
    id: 4,
    title: '电子数码',
    description: '智能科技体验',
    icon: 'devices',
    color: 'blue-grey'
  },
  {
    id: 5,
    title: '宠物用品',
    description: '关爱毛绒伙伴',
    icon: 'pets',
    color: 'amber-9'
  }
])

// 商品数据 - 从API获取
const products = ref([])
const displayedProducts = computed(() => {
  // 防止products.value为undefined的情况下调用slice方法
  return products.value?.length ? products.value.slice(0, 12) : [];
})

// 文章数据 - 从API获取
const articles = ref([])
const displayedArticles = computed(() => {
  // 防止articles.value为undefined的情况下调用slice方法
  return articles.value?.length ? articles.value.slice(0, 8) : [];
})

// 格式化商品数据，以符合ProductCard组件的需求
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
    id: product.id || generateTempId(),
    title: product.title || '未命名产品',
    currentPrice: typeof product.final_price === 'number'
      ? product.final_price
      : (parseFloat(product.final_price) || 0),
    originalPrice: typeof product.original_price === 'number'
      ? product.original_price
      : (parseFloat(product.original_price) || 0),
    image: imageUrl || 'https://placehold.co/300x200/e0e0e0/cccccc?text=暂无图片',
    platform: product.platform || 'other'
  };

  console.log('格式化后的商品数据:', formattedProduct);

  return formattedProduct;
}

// 格式化文章数据，确保符合ArticleCard组件的需求
function formatArticleForCard(article) {
  if (!article) return null;

  // 确保所有必要的字段都有默认值
  return {
    ...article,
    id: article.id || generateTempId(),
    title: article.title || '未命名文章',
    description: article.description || '暂无描述',
    image: article.image || 'https://placehold.co/600x400/e0e0e0/cccccc?text=暂无图片',
    category: article.category || '未分类',
    publish_date: article.publish_date || article.date || new Date().toISOString().split('T')[0],
    views: article.views || 0
  };
}

// 生成临时ID
function generateTempId() {
  return 'temp-' + Math.random().toString(36).substring(2, 10);
}

// 获取商品数据
async function fetchProducts() {
  loading.value.products = true
  try {
    console.log('首页开始获取商品数据');
    const response = await productApi.getProducts({
      status: 'active',
      sort: 'newest',
      limit: 12
    })

    console.log('首页商品API返回数据:', response);

    // 适配新的API返回格式
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        products.value = response;
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        products.value = response.data;
      } else {
        products.value = [];
      }
    } else {
      products.value = [];
    }

    console.log('首页处理后的products数据:', products.value);
  } catch (error) {
    console.error('获取商品失败:', error)
    $q.notify({
      type: 'negative',
      message: '获取商品数据失败'
    })
    products.value = []
  } finally {
    loading.value.products = false
  }
}

// 获取文章数据
async function fetchArticles() {
  loading.value.articles = true
  try {
    console.log('首页开始获取文章数据');
    const response = await articleApi.getArticles({
      status: 'published',
      sort: 'newest',
      limit: 8
    })

    console.log('首页文章API返回数据:', response);

    // 适配新的API返回格式
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        articles.value = response;
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        articles.value = response.data;
      } else {
        articles.value = [];
      }
    } else {
      articles.value = [];
    }

    console.log('首页处理后的articles数据:', articles.value);
  } catch (error) {
    console.error('获取文章失败:', error)
    $q.notify({
      type: 'negative',
      message: '获取文章数据失败'
    })
    articles.value = []
  } finally {
    loading.value.articles = false
  }
}

const showAdminDialog = ref(false)

function goToAdmin() {
  showAdminDialog.value = true
}

function goToTodayDeals() {
  router.push('/today-deals')
}

function goToArticlesList() {
  router.push('/articles')
}

function handleAdminLogin(password) {
  if (password === 'admin123') {
    localStorage.setItem('isAdmin', 'true')  // 设置管理员状态
    showAdminDialog.value = false  // 关闭对话框
    router.push('/admin')  // 跳转到后台管理页面
  } else {
    $q.notify({
      type: 'negative',
      message: '密码错误'
    })
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchProducts()
  fetchArticles()
})
</script>

<style lang="scss" scoped>
@import './styles/IndexPage.scss';
</style>
