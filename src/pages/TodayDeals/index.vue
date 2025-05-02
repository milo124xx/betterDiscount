<template>
  <q-page class="today-deals-page">
    <div class="container">
      <div class="page-header q-py-md">
        <h1 class="text-h4">今日特惠</h1>
        <p class="text-subtitle1 q-mt-sm">精选实时优惠，助您轻松购物</p>
      </div>

      <!-- 商品列表 -->
      <div class="products-section">
        <div v-if="loading" class="loading-container q-pa-xl flex flex-center">
          <q-spinner color="primary" size="3em" />
          <div class="loading-text q-ml-md">加载商品中...</div>
        </div>

        <template v-else>
          <div v-if="products.length === 0" class="no-results q-pa-xl text-center">
            <q-icon name="sentiment_dissatisfied" size="4rem" color="grey-5" />
            <p class="text-h6 q-mt-md">暂无特惠商品</p>
            <p class="text-body1 q-mt-sm">请稍后再来查看</p>
          </div>

          <div v-else class="row q-col-gutter-md">
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12" v-for="product in products" :key="product.id">
              <ProductCard :product="formatProductForCard(product)" class="card-component" />
            </div>
          </div>

          <!-- 分页控件 -->
          <div class="pagination-container q-py-md q-mt-md flex justify-center">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="5"
              boundary-links
              direction-links
              color="primary"
            />
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// 添加组件名称
defineOptions({
  name: 'TodayDealsPage'
})

import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import ProductCard from 'components/ProductCard.vue'
import { productApi } from 'src/api/products'

const $q = useQuasar()

// 数据状态
const loading = ref(false)
const products = ref([])
const totalItems = ref(0)
const pageSize = ref(12)
const currentPage = ref(1)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value) || 1
})

// 格式化商品数据，以符合ProductCard组件的需求
function formatProductForCard(product) {
  if (!product) return null;

  let imageUrl = '';

  // 尝试获取图片URL
  try {
    // 对于后端API返回的数据，images可能是字符串或数组
    const images = typeof product.images === 'string'
      ? JSON.parse(product.images || '[]')
      : (Array.isArray(product.images) ? product.images : []);

    imageUrl = images[0] || '';
  } catch (error) {
    console.error('图片解析错误:', error);
  }

  // 确保所有必要的字段都有默认值
  return {
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
}

// 生成临时ID
function generateTempId() {
  return 'temp-' + Math.random().toString(36).substring(2, 10);
}

// 获取商品数据
async function fetchProducts() {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value;

    const response = await productApi.getProducts({
      status: 'active',
      sort: 'newest', // 按日期降序排列
      limit: pageSize.value,
      offset: offset
    })

    // 适配API返回格式
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        products.value = response;
        totalItems.value = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        products.value = response.data;
        totalItems.value = response.total || response.data.length;
      } else {
        products.value = [];
        totalItems.value = 0;
      }
    } else {
      products.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error('获取今日特惠商品失败:', error)
    $q.notify({
      type: 'negative',
      message: '获取商品数据失败'
    })
    products.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

// 监听分页变化
watch(currentPage, () => {
  fetchProducts()
})

// 页面加载时获取数据
onMounted(() => {
  fetchProducts()
})
</script>

<style lang="scss" scoped>
@import './styles/TodayDeals.scss';
</style>
