<template>
  <q-page class="product-deals-page">
    <div class="container">
      <!-- 加载指示器 -->
      <div v-if="loading" class="loading-container">
        <q-spinner-dots color="primary" size="40px" />
        <div class="q-mt-sm">加载优惠信息中...</div>
      </div>

      <!-- 错误信息 -->
      <div v-else-if="error" class="error-container">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="q-mt-sm">{{ error }}</div>
        <q-btn label="重试" color="primary" class="q-mt-md" @click="fetchProductDeals" />
      </div>

      <!-- 成功加载数据 -->
      <template v-else>
        <!-- 合并的内容块 -->
        <div class="unified-product-section">
          <div class="breadcrumbs">
            <q-breadcrumbs separator=">" class="text-grey-8">
              <q-breadcrumbs-el label="首页" icon="home" to="/" />
              <q-breadcrumbs-el label="优惠详情" />
            </q-breadcrumbs>
          </div>

          <div class="product-header">
            <h1 class="product-title">{{ product.title }}</h1>
          </div>

          <div class="product-content-grid">
            <!-- 商品图片 -->
            <div class="product-image-container">
              <q-img
                :src="product.image"
                class="product-image"
                :ratio="1"
              >
                <template v-slot:error>
                  <div class="text-center full-height flex flex-center column">
                    <q-icon name="image_not_supported" size="48px" color="grey-6" />
                    <div class="text-caption q-mt-sm">图片加载失败</div>
                  </div>
                </template>
              </q-img>
            </div>

            <div class="product-details-container">
              <!-- 价格信息 -->
              <div class="price-section">
                <div class="current-price">
                  <span class="label">价格:</span>
                  <span class="price-value">¥{{ formatPrice(product.currentPrice) }}</span>
                  <span class="original-price-inline" v-if="product.originalPrice">
                    <span class="text-line-through">¥{{ formatPrice(product.originalPrice) }}</span>
                  </span>
                </div>
                <!-- 平台标记移到价格下方 -->
                <div class="platform-badge-container">
                  <div class="platform-badge" :class="product.platform">
                    <q-icon :name="getPlatformIcon(product.platform)" size="18px" class="q-mr-xs" />
                    {{ getPlatformLabel(product.platform) }}
                  </div>
                </div>
              </div>

              <!-- 通用优惠信息 -->
              <div class="deal-section">
                <div class="deal-item" v-if="product.dealInfo">
                  <q-icon name="local_offer" color="accent" size="20px" class="q-mr-sm" />
                  <div>{{ product.dealInfo }}</div>
                </div>

                <div class="deal-item" v-if="product.discountInfo">
                  <q-icon name="percent" color="accent" size="20px" class="q-mr-sm" />
                  <div>{{ product.discountInfo }}</div>
                </div>

                <!-- 有效期 -->
                <div class="deal-item" v-if="product.dealExpiry">
                  <q-icon name="schedule" color="blue-grey" size="20px" class="q-mr-sm" />
                  <div>
                    <span class="label">活动有效期:</span>
                    <span class="value">{{ formatDealExpiry(product.dealExpiry) }}</span>
                  </div>
                </div>
              </div>

              <!-- 京东特有字段 -->
              <div v-if="product.platform === 'jd'" class="platform-deals">
                <div class="platform-header">
                  <q-icon name="inventory_2" color="red" size="22px" class="q-mr-sm" />
                  <div class="platform-title">京东特惠</div>
                </div>

                <div class="deal-item" v-if="product.jdCoupon">
                  <q-icon name="card_giftcard" color="red" size="20px" class="q-mr-sm" />
                  <div>京东优惠券: {{ product.jdCoupon }}</div>
                </div>

                <div class="deal-item" v-if="product.jdPlus">
                  <q-icon name="workspace_premium" color="red" size="20px" class="q-mr-sm" />
                  <div>PLUS会员特惠: {{ product.jdPlus }}</div>
                </div>

                <div class="deal-item" v-if="product.jdSecKill">
                  <q-icon name="bolt" color="red" size="20px" class="q-mr-sm" />
                  <div>秒杀活动: {{ product.jdSecKill }}</div>
                </div>

                <div class="deal-item" v-if="product.jdJingBean">
                  <q-icon name="monetization_on" color="red" size="20px" class="q-mr-sm" />
                  <div>京豆返利: {{ product.jdJingBean }}</div>
                </div>
              </div>

              <!-- 淘宝/天猫特有字段 -->
              <div v-if="product.platform === 'taobao' || product.platform === 'tmall'" class="platform-deals">
                <div class="platform-header">
                  <q-icon :name="product.platform === 'taobao' ? 'storefront' : 'store'"
                          :color="product.platform === 'taobao' ? 'orange' : 'red'"
                          size="22px"
                          class="q-mr-sm" />
                  <div class="platform-title">{{ product.platform === 'taobao' ? '淘宝' : '天猫' }}特惠</div>
                </div>

                <div class="deal-item" v-if="product.tbCoupon">
                  <q-icon name="card_giftcard" color="orange" size="20px" class="q-mr-sm" />
                  <div>优惠券: {{ product.tbCoupon }}</div>
                </div>

                <div class="deal-item" v-if="product.tbRedPacket">
                  <q-icon name="redeem" color="orange" size="20px" class="q-mr-sm" />
                  <div>红包优惠: {{ product.tbRedPacket }}</div>
                </div>

                <div class="deal-item" v-if="product.tbUseCoupon">
                  <q-icon name="confirmation_number" color="orange" size="20px" class="q-mr-sm" />
                  <div>领券折扣: {{ product.tbUseCoupon }}</div>
                </div>

                <div class="deal-item" v-if="product.tbMjzs">
                  <q-icon name="local_offer" color="orange" size="20px" class="q-mr-sm" />
                  <div>满减折扣: {{ product.tbMjzs }}</div>
                </div>
              </div>

              <!-- 拼多多特有字段 -->
              <div v-if="product.platform === 'pdd'" class="platform-deals">
                <div class="platform-header">
                  <q-icon name="local_mall" color="deep-orange" size="22px" class="q-mr-sm" />
                  <div class="platform-title">拼多多特惠</div>
                </div>

                <div class="deal-item" v-if="product.pddGroupPrice">
                  <q-icon name="group" color="deep-orange" size="20px" class="q-mr-sm" />
                  <div>拼团价: {{ product.pddGroupPrice }}</div>
                </div>

                <div class="deal-item" v-if="product.pddCoupon">
                  <q-icon name="card_giftcard" color="deep-orange" size="20px" class="q-mr-sm" />
                  <div>多多券: {{ product.pddCoupon }}</div>
                </div>

                <div class="deal-item" v-if="product.pddTeamBuy">
                  <q-icon name="people" color="deep-orange" size="20px" class="q-mr-sm" />
                  <div>团购优惠: {{ product.pddTeamBuy }}</div>
                </div>

                <div class="deal-item" v-if="product.pddNewUser">
                  <q-icon name="person_add" color="deep-orange" size="20px" class="q-mr-sm" />
                  <div>新人专享: {{ product.pddNewUser }}</div>
                </div>
              </div>

              <!-- 其他平台特有字段 -->
              <div v-if="product.platform === 'other'" class="platform-deals">
                <div class="platform-header">
                  <q-icon name="shopping_bag" color="grey-7" size="22px" class="q-mr-sm" />
                  <div class="platform-title">其他平台优惠</div>
                </div>

                <div class="deal-item" v-if="product.otherCoupon">
                  <q-icon name="card_giftcard" color="grey-7" size="20px" class="q-mr-sm" />
                  <div>优惠券: {{ product.otherCoupon }}</div>
                </div>

                <div class="deal-item" v-if="product.otherDiscount">
                  <q-icon name="percent" color="grey-7" size="20px" class="q-mr-sm" />
                  <div>折扣信息: {{ product.otherDiscount }}</div>
                </div>
              </div>

              <!-- 商品描述 -->
              <div class="product-description" v-if="product.description">
                <div class="description-header">商品描述</div>
                <div class="description-content" v-html="product.description"></div>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <q-btn
                  unelevated
                  rounded
                  color="accent"
                  class="shop-btn"
                  icon="shopping_cart"
                  label="去购买"
                  @click="goToProductLink"
                />
                <q-btn
                  outline
                  rounded
                  color="primary"
                  class="share-btn q-ml-md"
                  icon="share"
                  label="分享优惠"
                  @click="showShareDialog = true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 商品推荐内容块 -->
        <div class="recommended-products-section">
          <div class="section-header">
            <h2 class="section-title">
              <q-icon name="recommend" size="24px" class="q-mr-sm" />
              {{ getRecommendationTitle() }}
            </h2>
          </div>
          <div class="products-grid">
            <template v-if="recommendedProducts.length > 0">
              <ProductCard
                v-for="item in recommendedProducts"
                :key="item.id"
                :product="item"
                class="product-card-item"
              />
            </template>
            <!-- 没有推荐商品时的提示 -->
            <div v-else class="no-recommendations">
              暂无相关推荐商品
            </div>
          </div>
        </div>

        <!-- 广告位 -->
        <div class="ad-section">
          <div class="ad-content">
            <q-banner class="text-center ad-placeholder">
              <div class="ad-placeholder-text">广告位预留</div>
            </q-banner>
          </div>
        </div>
      </template>
    </div>

    <!-- 分享对话框 -->
    <q-dialog v-model="showShareDialog">
      <q-card class="share-dialog">
        <q-card-section class="text-center">
          <div class="text-h6">分享优惠</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-md justify-center">
            <div class="col-4 share-option" @click="shareProduct('wechat')">
              <q-avatar size="50px" color="light-green-1" text-color="light-green" icon="wechat" />
              <div class="q-mt-sm">微信</div>
            </div>
            <div class="col-4 share-option" @click="shareProduct('weibo')">
              <q-avatar size="50px" color="red-1" text-color="red" icon="mood" />
              <div class="q-mt-sm">微博</div>
            </div>
            <div class="col-4 share-option" @click="shareProduct('link')">
              <q-avatar size="50px" color="blue-1" text-color="blue" icon="link" />
              <div class="q-mt-sm">复制链接</div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="取消" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi } from 'src/api/products'
import { useQuasar } from 'quasar'
import ProductCard from 'src/components/ProductCard.vue'

defineOptions({
  name: 'ProductDealsPage'
})

// 初始化
const route = useRoute()
/* eslint-disable-next-line no-unused-vars */
const router = useRouter()
const $q = useQuasar()

// 状态
const loading = ref(true)
const error = ref(null)
const product = ref({})
const showShareDialog = ref(false)
const recommendedProducts = ref([])
const loadingRecommendations = ref(false)

// 获取商品ID
const productId = computed(() => route.params.id)

// 获取商品详情和优惠信息
async function fetchProductDeals() {
  if (!productId.value) {
    error.value = '找不到商品信息'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const result = await productApi.getProductDeals(productId.value)
    if (result) {
      product.value = result
      // 获取商品详情后，加载推荐商品
      fetchRecommendedProducts()
    } else {
      error.value = '获取商品优惠信息失败'
    }
  } catch (err) {
    console.error('获取商品优惠信息出错:', err)
    error.value = '获取商品优惠信息时发生错误'
  } finally {
    loading.value = false
  }
}

// 获取推荐商品
async function fetchRecommendedProducts() {
  console.log('开始获取推荐商品');

  // 检查商品信息是否有平台信息
  if (!product.value || !product.value.platform) {
    console.warn('商品平台信息缺失，无法获取推荐', product.value);
    return;
  }

  loadingRecommendations.value = true;
  try {
    // 构建基本查询参数
    const baseParams = {
      limit: 6,
      offset: 0
    };

    // 按平台筛选
    baseParams.platform = product.value.platform;

    // 如果有分类信息，也按分类筛选
    if (product.value.category) {
      baseParams.category = product.value.category;
      console.log('将按平台和分类查询:', baseParams);
    } else {
      console.log('仅按平台查询:', baseParams);
    }

    // 获取推荐商品
    const result = await productApi.getProducts(baseParams);
    console.log('API返回结果:', result);

    if (result && result.data) {
      // 过滤掉当前正在查看的商品
      recommendedProducts.value = result.data
        .filter(item => item.id !== productId.value)
        .map(item => ({
          id: item.id,
          title: item.title,
          currentPrice: item.final_price || item.currentPrice || 0,
          originalPrice: item.original_price || item.originalPrice,
          image: item.images && item.images.length > 0 ? item.images[0] : (item.image || ''),
          platform: item.platform,
          category: item.category
        }));

      console.log('获取到的推荐商品:', recommendedProducts.value);

      // 如果推荐商品不足2个，尝试只按热门度推荐
      if (recommendedProducts.value.length < 2) {
        console.log('推荐商品不足2个，尝试获取热门商品');

        const popularParams = {
          sort: 'popular', // 假设API支持按热门度排序
          limit: 6,
          offset: 0
        };

        console.log('热门商品查询:', popularParams);
        const popularResult = await productApi.getProducts(popularParams);
        console.log('热门推荐API返回结果:', popularResult);

        if (popularResult && popularResult.data) {
          // 合并结果，确保不重复且不包含当前商品
          const moreProducts = popularResult.data
            .filter(item =>
              item.id !== productId.value &&
              !recommendedProducts.value.some(p => p.id === item.id)
            )
            .map(item => ({
              id: item.id,
              title: item.title,
              currentPrice: item.final_price || item.currentPrice || 0,
              originalPrice: item.original_price || item.originalPrice,
              image: item.images && item.images.length > 0 ? item.images[0] : (item.image || ''),
              platform: item.platform,
              category: item.category
            }));

          console.log('找到热门推荐商品:', moreProducts);

          recommendedProducts.value = [...recommendedProducts.value, ...moreProducts].slice(0, 4);
          console.log('最终推荐商品列表:', recommendedProducts.value);
        }
      }
    }
  } catch (err) {
    console.error('获取推荐商品出错:', err);
  } finally {
    loadingRecommendations.value = false;
    console.log('推荐商品获取完成，数量:', recommendedProducts.value.length);
  }
}

// 根据推荐类型返回标题
function getRecommendationTitle() {
  if (!product.value || !product.value.platform) return '相关推荐'

  const platformName = getPlatformLabel(product.value.platform)
  return `来自${platformName}的相关优惠`
}

// 跳转到商品链接
function goToProductLink() {
  if (product.value && product.value.productUrl) {
    window.open(product.value.productUrl, '_blank')
  } else {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: '商品链接不可用',
      icon: 'error'
    })
  }
}

// 分享功能
function shareProduct(platform) {
  const productTitle = product.value.title
  const productPrice = `￥${formatPrice(product.value.currentPrice)}`
  const shareUrl = `${window.location.origin}/product-deals/${productId.value}`

  let message = ''

  switch (platform) {
    case 'wechat':
      message = '已复制分享信息，请打开微信分享'
      navigator.clipboard.writeText(`【优惠分享】${productTitle} ${productPrice} ${shareUrl}`)
      break
    case 'weibo':
      message = '已复制分享信息，请打开微博分享'
      navigator.clipboard.writeText(`【优惠分享】${productTitle} 现售 ${productPrice} 快来购买吧！${shareUrl}`)
      break
    case 'link':
      navigator.clipboard.writeText(shareUrl)
      message = '链接已复制到剪贴板'
      break
  }

  showShareDialog.value = false

  $q.notify({
    color: 'positive',
    position: 'top',
    message,
    icon: 'done'
  })
}

// 平台相关函数
function getPlatformLabel(platform) {
  const platformMap = {
    jd: '京东',
    taobao: '淘宝',
    pdd: '拼多多',
    tmall: '天猫',
    other: '其他'
  }
  return platformMap[platform] || platform
}

function getPlatformIcon(platform) {
  const iconMap = {
    jd: 'inventory_2',
    taobao: 'storefront',
    pdd: 'local_mall',
    tmall: 'store',
    other: 'shopping_bag'
  }
  return iconMap[platform] || 'shopping_bag'
}

// 价格格式化
function formatPrice(price) {
  if (typeof price !== 'number') {
    price = Number(price) || 0
  }
  return price.toFixed(2)
}

// 格式化优惠有效期
function formatDealExpiry(expiry) {
  if (!expiry) return '永久有效'

  try {
    const expiryDate = new Date(expiry)
    return expiryDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    // 忽略错误，不使用错误变量
    void e; // 使用 void 运算符明确表示我们知道这个变量但不使用它
    return expiry // 如果解析失败，直接返回原始字符串
  }
}

// 生命周期钩子
onMounted(() => {
  fetchProductDeals()
})
</script>

<style lang="scss" src="./styles/ProductDeals.scss"></style>
