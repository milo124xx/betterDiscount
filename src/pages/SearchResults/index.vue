<template>
    <q-page class="search-results-page">
        <!-- 主要内容区域 -->
        <div class="main-content q-py-lg">
            <div class="container">
                <div class="search-header q-mb-lg">
                    <h2 class="section-title">
                        <span class="text-primary">搜索结果</span>
                        <small>"{{ searchQuery }}" (共 {{ products?.length || 0 }} 个结果)</small>
                    </h2>
                </div>

                <!-- 筛选条件栏 -->
                <FilterSection
                    :selectedPlatform="selectedPlatform"
                    :sortBy="sortBy"
                    :platformOptions="platformOptions"
                    :sortOptions="sortOptions"
                    @update:platform="handlePlatformChange"
                    @update:sort="handleSortChange"
                />

                <!-- 商品展示区 -->
                <div class="products-section">
                    <div v-if="loading" class="loading-container q-py-xl text-center">
                        <q-spinner color="primary" size="3em" />
                        <div class="q-mt-sm">正在加载搜索结果...</div>
                    </div>
                    <div v-else-if="filteredProducts.length > 0" class="row q-col-gutter-lg">
                        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12" v-for="product in filteredProducts" :key="product.id">
                            <ProductCard :product="formatProductForCard(product)" class="card-component" />
                        </div>
                    </div>

                    <!-- 无结果显示 -->
                    <NoResults v-if="!loading && filteredProducts.length === 0" />
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
// 添加组件名称，解决 ESLint 错误
defineOptions({
  name: 'SearchResultsComponent'
})

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import ProductCard from 'components/ProductCard.vue'
import FilterSection from './components/FilterSection.vue'
import NoResults from './components/NoResults.vue'
import { productApi } from 'src/api/products'

const route = useRoute()
const $q = useQuasar()
const searchQuery = computed(() => route.query.q || '')
const loading = ref(false)

// 商品数据
const products = ref([])

// 筛选和排序状态
const selectedPlatform = ref('all')
const sortBy = ref('default')

// 排序选项
const sortOptions = [
    { label: '默认排序', value: 'default' },
    { label: '价格从低到高', value: 'price_asc' },
    { label: '价格从高到低', value: 'price_desc' }
]

// 平台选项配置
const platformOptions = [
    {
        label: '全部平台',
        value: 'all',
        textColor: 'primary',
        activeColor: 'primary'
    },
    {
        label: '京东',
        value: 'jd',
        textColor: 'red-8',
        activeColor: 'red-8'
    },
    {
        label: '淘宝',
        value: 'taobao',
        textColor: 'orange-8',
        activeColor: 'orange-8'
    },
    {
        label: '拼多多',
        value: 'pdd',
        textColor: 'pink-8',
        activeColor: 'pink-8'
    }
]

// 格式化商品数据以符合 ProductCard 组件的需求
function formatProductForCard(product) {
  if (!product) return null

  let imageUrl = ''

  // 尝试获取图片URL
  try {
    const images = typeof product.images === 'string'
      ? JSON.parse(product.images || '[]')
      : (product.images || [])

    imageUrl = images[0] || ''
  } catch (error) {
    console.error('图片解析错误:', error)
  }

  // 确保所有必要的字段都有默认值
  return {
    id: product.id || generateTempId(),
    title: product.title || '未命名产品',
    currentPrice: typeof product.final_price === 'undefined' ? 0 : Number(product.final_price),
    originalPrice: typeof product.original_price === 'undefined' ? 0 : Number(product.original_price),
    image: imageUrl || 'https://placehold.co/300x200/e0e0e0/cccccc?text=暂无图片',
    platform: product.platform || 'other'
  }
}

// 生成临时ID
function generateTempId() {
  return 'temp-' + Math.random().toString(36).substring(2, 10)
}

// 根据平台和排序条件筛选和排序商品
const filteredProducts = computed(() => {
    // 先按平台筛选
    const result = selectedPlatform.value === 'all'
        ? products.value
        : products.value.filter(product => product.platform === selectedPlatform.value)

    return result
})

// 处理平台筛选变化
function handlePlatformChange(platform) {
    selectedPlatform.value = platform
}

// 处理排序变化
function handleSortChange(sort) {
    sortBy.value = sort
    fetchSearchResults()
}

// 获取搜索结果
async function fetchSearchResults() {
    if (!searchQuery.value) {
        products.value = [];
        return;
    }

    loading.value = true;
    try {
        console.log('开始获取搜索结果，关键词:', searchQuery.value);
        const sortOption = sortBy.value !== 'default' ? sortBy.value : 'newest';
        const platformOption = selectedPlatform.value !== 'all' ? selectedPlatform.value : undefined;

        const options = {
            sort: sortOption,
            platform: platformOption
        };

        console.log('搜索选项:', options);

        // 使用productApi.searchProducts调用，确保参数传递正确
        const response = await productApi.searchProducts(searchQuery.value, options);
        console.log('搜索结果原始数据:', response);

        // 处理不同格式的响应数据
        if (response && typeof response === 'object') {
            // 检查是否是带有data字段的对象
            if (Array.isArray(response.data)) {
                products.value = response.data;
            }
            // 检查是否直接是数组
            else if (Array.isArray(response)) {
                products.value = response;
            }
            else {
                products.value = [];
            }
        } else {
            products.value = [];
        }

        console.log('处理后的搜索结果数据:', products.value);
    } catch (error) {
        console.error('搜索失败:', error);
        $q.notify({
            type: 'negative',
            message: '获取搜索结果失败，请稍后重试'
        });
        products.value = [];
    } finally {
        loading.value = false;
    }
}

// 监听搜索关键词变化，重新搜索
watch(searchQuery, () => {
    fetchSearchResults()
})

// 初始加载
onMounted(() => {
    fetchSearchResults()
})
</script>

<style lang="scss" scoped>
@import './styles/SearchResults.scss';

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
