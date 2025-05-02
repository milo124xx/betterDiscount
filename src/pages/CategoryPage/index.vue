<template>
  <q-page class="category-page">
    <!-- 分类页面头部 -->
    <div class="category-header">
      <div class="container">
        <div class="category-title-wrapper">
          <h1 class="category-title">
            <q-icon :name="categoryIcon" size="sm" class="q-mr-sm" :color="categoryColor" />
            {{ categoryName }}
          </h1>
        </div>
      </div>
    </div>

    <!-- 分类产品展示区 -->
    <div class="category-content">
      <div class="container">
        <!-- 结果统计区域 -->
        <div class="results-info q-mb-lg">
          找到 <span class="text-primary">{{ totalProducts }}</span> 个商品
        </div>

        <!-- 筛选器区域 -->
        <div class="filter-wrapper q-mb-lg">
          <div class="row q-col-gutter-md">
            <!-- 平台筛选 -->
            <div class="col-md-8 col-sm-12 col-xs-12">
              <PlatformFilter
                :platform-options="platformOptions"
                :selected-platform="selectedPlatform"
                @update:platform="platformChanged"
              />
            </div>

            <!-- 排序选项 -->
            <div class="col-md-4 col-sm-12 col-xs-12 text-right">
              <q-select
                v-model="sortOption"
                :options="sortOptions"
                label="排序方式"
                outlined
                dense
                emit-value
                map-options
                class="sort-select"
                @update:model-value="handleSortChange"
              />
            </div>
          </div>
        </div>

        <!-- 产品列表 -->
        <div class="row q-col-gutter-md">
          <div v-if="loading" class="col-12 text-center q-py-lg">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-sm">加载商品中...</div>
          </div>

          <template v-else-if="products.length > 0">
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12"
                 v-for="product in products"
                 :key="product.id">
              <ProductCard
                :product="formatProductForCard(product)"
                class="category-product-card"
              />
            </div>
          </template>

          <div v-else class="col-12 text-center q-py-xl">
            <q-icon name="search_off" size="4rem" color="grey-5" />
            <p class="text-h6 text-grey-7 q-mt-md">没有找到该分类的商品</p>
            <p class="text-grey-7">请稍后再来查看或尝试浏览其他分类</p>
          </div>
        </div>

        <!-- 分页控制区 -->
        <div v-if="totalProducts > 0" class="pagination-section text-center q-py-md">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :max-pages="6"
            :boundary-links="true"
            :boundary-numbers="false"
            direction-links
            @update:model-value="handlePageChange"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import ProductCard from 'components/ProductCard.vue'
import PlatformFilter from './components/PlatformFilter.vue'
import { productApi } from 'src/api/products'

// 组件名称定义
defineOptions({
  name: 'CategoryPageComponent'
})

const $q = useQuasar()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 分页相关数据
const pageSize = 16 // 每页显示的商品数量
const currentPage = ref(1)
const totalProducts = ref(0)
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize))

// 平台筛选相关 - 只保留三个平台
const selectedPlatform = ref('all')
const platformOptions = [
  { label: '全部平台', value: 'all', activeColor: 'primary', textColor: 'primary' },
  { label: '淘宝', value: 'taobao', activeColor: 'orange-8', textColor: 'orange-9' },
  { label: '京东', value: 'jd', activeColor: 'red-8', textColor: 'red-8' },
  { label: '拼多多', value: 'pdd', activeColor: 'orange', textColor: 'orange-8' }
]

// 排序选项 - 移除了折扣力度选项
const sortOption = ref('newest')
const sortOptions = [
  { label: '最新上架', value: 'newest' },
  { label: '价格从低到高', value: 'price_asc' },
  { label: '价格从高到低', value: 'price_desc' }
]

// 商品数据
const products = ref([])

// 分类信息
const categoryId = computed(() => route.params.id)
const categoryName = ref('')
const categoryIcon = ref('category')
const categoryColor = ref('primary')

// 分类映射表 - 从首页复制过来的分类信息
const categoryMap = {
  '1': {
    name: '生活用品',
    icon: 'home',
    color: 'indigo',
    value: 'daily' // 数据库中实际使用的分类值
  },
  '2': {
    name: '个护美妆',
    icon: 'spa',
    color: 'deep-purple',
    value: 'beauty' // 数据库中实际使用的分类值
  },
  '3': {
    name: '健康食品',
    icon: 'restaurant_menu',
    color: 'teal',
    value: 'food' // 数据库中实际使用的分类值
  },
  '4': {
    name: '电子数码',
    icon: 'devices',
    color: 'blue-grey',
    value: 'digital' // 数据库中实际使用的分类值
  },
  '5': {
    name: '宠物用品',
    icon: 'pets',
    color: 'amber-9',
    value: 'pet' // 数据库中实际使用的分类值
  }
}

// 根据分类ID获取分类信息
function updateCategoryInfo() {
  const id = categoryId.value
  if (categoryMap[id]) {
    categoryName.value = categoryMap[id].name
    categoryIcon.value = categoryMap[id].icon
    categoryColor.value = categoryMap[id].color
  } else {
    categoryName.value = '未知分类'
    categoryIcon.value = 'help_outline'
    categoryColor.value = 'grey'
  }
}

// 平台变化处理
function platformChanged(platform) {
  selectedPlatform.value = platform
  currentPage.value = 1 // 切换平台时，重置为第一页
  fetchCategoryProducts()
}

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

// 获取分类商品
async function fetchCategoryProducts() {
  if (!categoryId.value) return;

  loading.value = true;

  try {
    const id = categoryId.value;
    // 从映射表中获取对应的数据库分类值
    const categoryValue = categoryMap[id]?.value;

    if (!categoryValue) {
      console.error(`未找到分类ID ${id} 对应的数据库分类值`);
      $q.notify({
        type: 'negative',
        message: '无效的分类'
      });
      products.value = [];
      totalProducts.value = 0;
      loading.value = false;
      return;
    }

    // 在控制台输出调试信息
    console.log(`开始获取分类 ${id} (${categoryName.value}) 的商品数据，对应数据库分类值: ${categoryValue}`);

    const options = {
      limit: pageSize,
      offset: (currentPage.value - 1) * pageSize,
      sort: sortOption.value
    };

    // 添加平台筛选参数
    if (selectedPlatform.value !== 'all') {
      options.platform = selectedPlatform.value;
    }

    // 使用真实的数据库分类值查询
    const params = {
      category: categoryValue,
      status: 'active',
      ...options
    };

    console.log('发送请求参数:', params);

    // 直接使用通用API进行查询
    const response = await productApi.getProducts(params);
    console.log('分类商品响应数据:', response);

    // 判断响应格式并处理数据
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        products.value = response;
        totalProducts.value = response.length;
        console.log(`成功获取分类商品数据，共 ${products.value.length} 条记录(数组格式)`);
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        products.value = response.data;
        totalProducts.value = response.total || response.data.length;
        console.log(`成功获取分类商品数据，共 ${products.value.length}/${totalProducts.value} 条记录(分页对象格式)`);
      } else {
        products.value = [];
        totalProducts.value = 0;
        console.warn('响应数据格式异常，无法解析商品数据');
      }
    } else {
      products.value = [];
      totalProducts.value = 0;
      console.warn('响应数据无效');
    }

    // 打印每个查询到的商品的分类信息，验证是否匹配
    if (products.value.length > 0) {
      console.log('商品分类检查:');
      products.value.forEach((product, index) => {
        console.log(`商品 ${index+1}: ID=${product.id}, 标题=${product.title}, 分类=${product.category}`);
      });
    } else {
      console.warn(`未找到分类 ${categoryValue} 的商品`);
    }
  } catch (error) {
    console.error('获取分类商品失败:', error);
    $q.notify({
      type: 'negative',
      message: '获取商品数据失败'
    });
    products.value = [];
    totalProducts.value = 0;
  } finally {
    loading.value = false;
  }
}

// 排序变化处理
function handleSortChange() {
  currentPage.value = 1; // 重置为第一页
  fetchCategoryProducts();
}

// 页码变化处理
function handlePageChange() {
  fetchCategoryProducts();
  // 滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 监听路由参数变化，更新分类信息和重新获取商品
watch(() => route.params.id, () => {
  updateCategoryInfo();
  currentPage.value = 1; // 重置页码
  selectedPlatform.value = 'all'; // 重置平台筛选
  fetchCategoryProducts();
});

// 页面加载
onMounted(() => {
  updateCategoryInfo();
  fetchCategoryProducts();
});
</script>

<style lang="scss">
@import './styles/CategoryPage.scss';
</style>
