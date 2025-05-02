<template>
  <q-page class="admin-page q-pa-md">
    <div class="container q-my-sm">
      <q-tabs v-model="activeTab" dense align="left" class="q-mb-sm">
        <q-tab name="products" icon="inventory_2" label="商品管理" />
        <q-tab name="articles" icon="article" label="文章管理" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated transition-prev="fade" transition-next="fade">
        <!-- 商品管理面板 -->
        <q-tab-panel name="products" class="q-px-none q-py-sm">
          <div class="panel-header">
            <div class="row justify-between items-center">
              <h3>商品列表</h3>
              <q-btn color="primary" flat class="action-buttons" icon="add" label="添加商品" @click="openProductDialog()">
                <q-tooltip anchor="bottom middle" self="top middle">添加新商品</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-table
            :rows="products"
            :columns="productColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :loading="loading.products"
            flat
            bordered
          >
            <template v-slot:loading>
              <q-inner-loading showing>
                <q-spinner color="primary" size="30px" />
              </q-inner-loading>
            </template>

            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <q-img
                  v-if="props.row.imageUrl"
                  :src="props.row.imageUrl"
                  class="product-image"
                />
                <div v-else class="image-placeholder flex flex-center">
                  <q-icon name="image" size="18px" color="grey-6" />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-platform="props">
              <q-td :props="props">
                <div :class="['platform-chip', `platform-chip--${props.row.platform}`]">
                  <q-icon :name="getPlatformIcon(props.row.platform)" />
                  <span v-if="props.row.platform === 'jd'">京东</span>
                  <span v-else-if="props.row.platform === 'taobao'">淘宝</span>
                  <span v-else-if="props.row.platform === 'pdd'">拼多多</span>
                  <span v-else-if="props.row.platform === 'tmall'">天猫</span>
                  <span v-else>{{ props.row.platform }}</span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-price="props">
              <q-td :props="props">
                <div class="price-display">
                  <div v-if="props.row.originalPrice" class="original-price">
                    ¥{{ formatPrice(props.row.originalPrice) }}
                  </div>
                  <div :class="['final-price', props.row.originalPrice ? 'final-price--discount' : '']">
                    ¥{{ formatPrice(props.row.finalPrice) }}
                  </div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-addDate="props">
              <q-td :props="props">
                <div class="date-chip">
                  <q-icon name="event" />
                  {{ props.row.addDate }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="row justify-center">
                  <q-btn flat round dense class="action-btn action-btn--edit" icon="edit" @click="editProduct(props.row)">
                    <q-tooltip>编辑商品</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense class="action-btn action-btn--delete" icon="delete" @click="confirmDeleteProduct(props.row)">
                    <q-tooltip>删除商品</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="empty-state row flex-center column">
                <q-icon name="sentiment_dissatisfied" size="36px" class="empty-state__icon" />
                <div class="empty-state__text">暂无商品数据</div>
                <q-btn color="primary" flat class="action-buttons" icon="add" label="添加首个商品" @click="openProductDialog()" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- 文章管理面板 -->
        <q-tab-panel name="articles" class="q-px-none q-py-sm">
          <div class="panel-header">
            <div class="row justify-between items-center">
              <h3>文章列表</h3>
              <q-btn color="primary" flat class="action-buttons" icon="add" label="添加文章" @click="openArticleDialog()">
                <q-tooltip anchor="bottom middle" self="top middle">添加新文章</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-table
            :rows="articles"
            :columns="articleColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :loading="loading.articles"
            flat
            bordered
          >
            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <q-img :src="props.row.image" class="article-image" />
              </q-td>
            </template>

            <template v-slot:body-cell-category="props">
              <q-td :props="props">
                <div class="status-chip">
                  {{ props.row.category }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-date="props">
              <q-td :props="props">
                <div class="date-chip">
                  <q-icon name="event" />
                  {{ props.row.date }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="row justify-center">
                  <q-btn flat round dense class="action-btn action-btn--edit" icon="edit" @click="editArticle(props.row)">
                    <q-tooltip>编辑文章</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense class="action-btn action-btn--delete" icon="delete" @click="confirmDeleteArticle(props.row)">
                    <q-tooltip>删除文章</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="empty-state row flex-center column">
                <q-icon name="sentiment_dissatisfied" size="36px" class="empty-state__icon" />
                <div class="empty-state__text">暂无文章数据</div>
                <q-btn color="primary" flat class="action-buttons" icon="add" label="添加首篇文章" @click="openArticleDialog()" />
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- 商品表单对话框 -->
    <ProductForm
      v-model="dialogs.product"
      :productData="currentProduct"
      :loading="loading.saveProduct"
      @save="saveProduct"
      @cancel="closeProductDialog"
    />

    <!-- 文章表单对话框 -->
    <ArticleForm
      v-model="dialogs.article"
      :articleData="currentArticle"
      :loading="loading.saveArticle"
      @save="saveArticle"
      @cancel="closeArticleDialog"
    />
  </q-page>
</template>

<script setup>
// 添加组件名称，解决 ESLint 错误
defineOptions({
  name: 'AdminPageComponent'
})

import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { productApi } from 'src/api/products'
import { articleApi } from 'src/api/articles'
import ProductForm from './components/ProductForm.vue'
import ArticleForm from './components/ArticleForm.vue'

// 初始化 Quasar 的 $q 对象
const $q = useQuasar()

// 页面状态管理
const activeTab = ref('products')

// 对话框状态管理
const dialogs = reactive({
  product: false,
  article: false
})

// 加载状态管理
const loading = reactive({
  products: false,
  saveProduct: false,
  deleteProduct: false,
  articles: false,
  saveArticle: false,
  deleteArticle: false
})

// 商品相关
const products = ref([])
const currentProduct = ref({})

// 文章相关
const articles = ref([])
const currentArticle = ref({})

// 表格列定义
const productColumns = [
  { name: 'image', label: '商品图片', field: 'imageUrl', align: 'center' },
  { name: 'title', label: '商品名称', field: 'title', align: 'left' },
  { name: 'price', label: '价格', field: 'finalPrice', align: 'right', sortable: true },
  { name: 'platform', label: '销售平台', field: 'platform', align: 'center' },
  { name: 'addDate', label: '添加日期', field: 'addDate', align: 'center', sortable: true },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' }
]

const articleColumns = [
  { name: 'image', label: '封面图片', field: 'image', align: 'center' },
  { name: 'title', label: '文章标题', field: 'title', align: 'left' },
  { name: 'category', label: '分类', field: 'category', align: 'center' },
  { name: 'date', label: '发布日期', field: 'publish_date', align: 'center', sortable: true },
  { name: 'actions', label: '操作', field: 'actions', align: 'center' }
]

// 初始化
onMounted(() => {
  fetchProducts()
  fetchArticles()
})

// 商品相关方法
// 获取商品列表
async function fetchProducts() {
  loading.products = true
  try {
    console.log('管理页面开始获取商品列表')
    const response = await productApi.getProducts()
    console.log('管理页面获取的商品数据:', response)

    // 适配新的API返回格式
    let productsList = []
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        productsList = response
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        productsList = response.data
      }
    }

    console.log('处理前的商品列表:', productsList)

    // 处理数据，确保图片和优惠券信息正确解析
    products.value = productsList.map(product => {
      let imageUrls = []
      let qrCodeUrls = []
      let coupon = {}

      try {
        // 解析图片和二维码数据
        imageUrls = typeof product.images === 'string'
          ? JSON.parse(product.images || '[]')
          : (Array.isArray(product.images) ? product.images : [])

        qrCodeUrls = typeof product.qr_code_images === 'string'
          ? JSON.parse(product.qr_code_images || '[]')
          : (Array.isArray(product.qr_code_images) ? product.qr_code_images : [])

        // 解析优惠券信息
        coupon = typeof product.coupon_info === 'string'
          ? JSON.parse(product.coupon_info || '{}')
          : (product.coupon_info || {})
      } catch (error) {
        console.error('数据解析错误:', error)
      }

      // 返回处理后的商品对象，包含表格显示需要的字段
      return {
        ...product,
        imageUrls,
        qrCodeUrls,
        imageUrl: imageUrls[0] || '',
        coupon,
        // 为表格中的字段赋别名，保持原有模板的兼容性
        originalPrice: Number(product.original_price || 0),
        finalPrice: Number(product.final_price || 0),
        isDirectSale: Boolean(product.is_direct_sale),
        addDate: product.add_date
      }
    })

    console.log('处理后的商品列表:', products.value)
  } catch (error) {
    console.error('获取商品列表失败:', error)
    $q.notify({
      type: 'negative',
      message: '获取商品列表失败'
    })
    products.value = []
  } finally {
    loading.products = false
  }
}

// 打开商品对话框(新增)
function openProductDialog() {
  currentProduct.value = {}
  dialogs.product = true
}

// 编辑商品
function editProduct(product) {
  try {
    currentProduct.value = { ...product }
    dialogs.product = true
  } catch (error) {
    console.error('编辑商品失败:', error)
    $q.notify({
      type: 'negative',
      message: '加载商品数据失败',
      caption: error.message
    })
  }
}

// 确认删除商品
function confirmDeleteProduct(product) {
  $q.dialog({
    title: '确认删除',
    message: `确定要删除商品"${product.title}"吗？`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteProduct(product.id)
  })
}

// 删除商品
async function deleteProduct(id) {
  loading.deleteProduct = true
  try {
    // 调用API删除商品
    await productApi.deleteProduct(id)

    // 从本地列表中移除该商品
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }

    // 显示成功提示
    $q.notify({
      type: 'positive',
      message: '商品已成功删除',
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    console.error('删除商品失败:', error)

    // 显示错误提示
    $q.notify({
      type: 'negative',
      message: '删除商品失败',
      caption: error.response?.data?.message || error.message || '请稍后重试',
      position: 'top',
      timeout: 3000
    })
  } finally {
    loading.deleteProduct = false
  }
}

// 保存商品
async function saveProduct({ productId, formData }) {
  loading.saveProduct = true
  try {
    // 发送请求
    if (productId) {
      // 更新现有商品
      await productApi.updateProduct(productId, formData)
    } else {
      // 创建新商品
      await productApi.createProduct(formData)
    }

    // 重新获取商品列表
    await fetchProducts()

    // 关闭对话框
    closeProductDialog()

    $q.notify({
      type: 'positive',
      message: `商品${productId ? '更新' : '添加'}成功`
    })
  } catch (error) {
    console.error('保存商品失败:', error)
    $q.notify({
      type: 'negative',
      message: '保存失败，请重试',
      caption: error.message
    })
  } finally {
    loading.saveProduct = false
  }
}

// 关闭商品对话框
function closeProductDialog() {
  dialogs.product = false
  currentProduct.value = {}
}

// 格式化价格显示
function formatPrice(price) {
  return Number(price).toFixed(2)
}

// 获取平台图标
function getPlatformIcon(platform) {
  const icons = {
    'jd': 'shopping_bag',
    'taobao': 'storefront',
    'pdd': 'groups',
    'tmall': 'store',
    'amazon': 'local_shipping',
    'other': 'shopping_cart'
  }
  return icons[platform] || icons.other
}

// 以下函数被模板中的 :class 使用
// eslint-disable-next-line no-unused-vars
function getPlatformColor(platform) {
  const colors = {
    'jd': 'red',
    'taobao': 'orange',
    'pdd': 'pink',
    'tmall': 'deep-orange',
    'amazon': 'blue',
    'other': 'grey'
  }
  return colors[platform] || colors.other
}

// 文章相关方法
// 获取文章列表
async function fetchArticles() {
  loading.articles = true
  try {
    console.log('管理页面开始获取文章列表')
    const response = await articleApi.getArticles()
    console.log('管理页面获取的文章数据:', response)

    // 适配新的API返回格式
    let articlesList = []
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        articlesList = response
      } else if (response.data && Array.isArray(response.data)) {
        // 如果返回带分页信息的对象
        articlesList = response.data
      }
    }

    console.log('处理前的文章列表:', articlesList)

    // 处理数据，确保兼容性
    articles.value = articlesList.map(article => {
      return {
        ...article,
        // 为表格中的字段赋别名，保持模板兼容性
        date: article.publish_date,
        views: Number(article.views || 0)
      }
    })

    console.log('处理后的文章列表:', articles.value)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    $q.notify({
      type: 'negative',
      message: '获取文章列表失败'
    })
    articles.value = []
  } finally {
    loading.articles = false
  }
}

function openArticleDialog() {
  currentArticle.value = {}
  dialogs.article = true
}

function editArticle(article) {
  currentArticle.value = { ...article }
  dialogs.article = true
}

function confirmDeleteArticle(article) {
  $q.dialog({
    title: '确认删除',
    message: `确定要删除文章"${article.title}"吗？`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteArticle(article.id)
  })
}

async function deleteArticle(id) {
  loading.deleteArticle = true
  try {
    // 调用API删除文章
    await articleApi.deleteArticle(id)

    // 从本地列表中移除该文章
    const index = articles.value.findIndex(a => a.id === id)
    if (index > -1) {
      articles.value.splice(index, 1)
    }

    // 显示成功提示
    $q.notify({
      type: 'positive',
      message: '文章已成功删除',
      position: 'top',
      timeout: 2000
    })
  } catch (error) {
    console.error('删除文章失败:', error)

    // 显示错误提示
    $q.notify({
      type: 'negative',
      message: '删除文章失败',
      caption: error.response?.data?.message || error.message || '请稍后重试',
      position: 'top',
      timeout: 3000
    })
  } finally {
    loading.deleteArticle = false
  }
}

async function saveArticle({ articleId, formData }) {
  loading.saveArticle = true
  try {
    // 发送请求
    if (articleId) {
      // 更新现有文章
      await articleApi.updateArticle(articleId, formData)
    } else {
      // 创建新文章
      await articleApi.createArticle(formData)
    }

    // 重新获取文章列表
    await fetchArticles()

    // 关闭对话框
    closeArticleDialog()

    $q.notify({
      type: 'positive',
      message: `文章${articleId ? '更新' : '添加'}成功`
    })
  } catch (error) {
    console.error('保存文章失败:', error)
    $q.notify({
      type: 'negative',
      message: '保存失败，请重试',
      caption: error.message
    })
  } finally {
    loading.saveArticle = false
  }
}

function closeArticleDialog() {
  dialogs.article = false
  currentArticle.value = {}
}
</script>

<style lang="scss" scoped>
@import './styles/AdminPage.scss';

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.article-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.platform-chip {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.platform-chip--jd {
  background-color: #e53935;
  color: #fff;
}

.platform-chip--taobao {
  background-color: #ff9800;
  color: #fff;
}

.platform-chip--pdd {
  background-color: #e91e63;
  color: #fff;
}

.platform-chip--tmall {
  background-color: #ff5722;
  color: #fff;
}

.platform-chip--other {
  background-color: #9e9e9e;
  color: #fff;
}

.price-display {
  display: flex;
  flex-direction: column;
}

.original-price {
  text-decoration: line-through;
  color: #9e9e9e;
}

.final-price {
  font-weight: bold;
  color: #4caf50;
}

.final-price--discount {
  color: #e53935;
}

.date-chip {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: #f5f5f5;
  font-size: 14px;
}

.status-chip {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: #e0f7fa;
  font-size: 14px;
}

.status-chip--small {
  font-size: 12px;
}

.action-btn {
  margin: 0 4px;
}

.action-btn--edit {
  color: #4caf50;
}

.action-btn--delete {
  color: #e53935;
}

.empty-state {
  text-align: center;
}

.empty-state__icon {
  color: #9e9e9e;
}

.empty-state__text {
  color: #9e9e9e;
  font-size: 16px;
  margin-top: 8px;
}

.action-buttons {
  font-size: 14px;
}

.dialog-card {
  max-width: 600px;
  width: 100%;
}

.dialog-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header__title {
  font-size: 18px;
  font-weight: bold;
}

.dialog-content {
  padding: 16px;
}
</style>
