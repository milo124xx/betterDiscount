<template>
  <q-card class="product-card" flat v-ripple clickable @click="navigateToProduct">
    <!-- 平台标签 -->
    <div :class="['platform-tag', product.platform]">
      {{ getPlatformLabel(product.platform) }}
    </div>

    <!-- 折扣徽章 - 改进视觉效果 -->
    <div v-if="discountPercentage" class="discount-badge">
      <span class="discount-label">省</span>
      <span class="discount-value">{{ discountPercentage }}%</span>
    </div>

    <!-- 商品图片 -->
    <q-img :src="productImage" class="product-image" :ratio="1" no-spinner no-transition>
      <template v-slot:loading>
        <q-skeleton type="rect" />
      </template>
      <template v-slot:error>
        <div class="image-error">
          <q-icon name="image_not_supported" size="32px" color="grey-6" />
          <div class="text-caption q-mt-sm">图片加载失败</div>
        </div>
      </template>
    </q-img>

    <!-- 商品信息 -->
    <div class="product-content">
      <div class="product-title">{{ product.title }}</div>
      <div class="price-container">
        <div class="price-tag">到手价</div>
        <div class="product-price">
          <span class="price-symbol">¥</span>
          <span class="current-price">{{ formatPrice(product.currentPrice || product.price) }}</span>
          <span v-if="product.originalPrice" class="original-price">¥{{ formatPrice(product.originalPrice) }}</span>
        </div>
      </div>

      <!-- 优惠标签 -->
      <div v-if="product.promotionInfo" class="promotion-tag">
        <q-icon name="local_offer" size="12px" class="q-mr-xs" />
        {{ product.promotionInfo }}
      </div>

      <div class="product-platform">
        <q-icon :name="getPlatformIcon(product.platform)" size="14px" class="q-mr-xs" />
        {{ getPlatformLabel(product.platform) }}
      </div>
    </div>

    <!-- 购买按钮 悬浮显示 - 改进视觉效果 -->
    <div class="buy-overlay">
      <q-btn unelevated rounded class="buy-btn" color="accent" icon="shopping_cart" label="查看优惠"
        @click.stop="navigateToProduct" />
    </div>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

defineOptions({
  name: 'ProductCardComponent'
})

const router = useRouter();

// 直接使用 defineProps 而不赋值给变量
const { product } = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      // 更宽松的验证器，只要有id和title就可以
      // 其他字段会在模板中使用默认值或空值处理
      return product && product.id && product.title;
    }
  }
})

// 计算商品图片地址，处理不同的字段名和无效图片
const productImage = computed(() => {
  // 检查 thumbnail 字段（缩略图通常更适合卡片展示）
  if (product.thumbnail && product.thumbnail.includes('http')) {
    return product.thumbnail;
  }

  // 检查 image 字段
  if (product.image && product.image.includes('http')) {
    return product.image;
  }

  // 检查 imageUrl 字段
  if (product.imageUrl && product.imageUrl.includes('http')) {
    return product.imageUrl;
  }

  // 使用默认占位图
  return 'https://placehold.co/400x400?text=商品图片';
});

// 计算折扣百分比
const discountPercentage = computed(() => {
  // 确保使用正确的价格字段
  const originalPrice = parseFloat(product.originalPrice);
  const currentPrice = parseFloat(product.currentPrice || product.price);

  if (isNaN(originalPrice) || isNaN(currentPrice) || originalPrice <= currentPrice) return '';

  const discount = Math.round((1 - currentPrice / originalPrice) * 100);
  return discount >= 5 ? discount : ''; // 只显示5%以上的折扣
});

// 导航到商品详情页
function navigateToProduct() {
  router.push(`/product-deals/${product.id}`);
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
  return platformMap[platform] || platform || '未知'
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
  if (!price) return '0.00';

  if (typeof price !== 'number') {
    price = Number(price) || 0;
  }
  return price.toFixed(2);
}
</script>

<style lang="scss" scoped>
.product-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 10px;
  height: 240px; // 减小卡片高度
  width: 100%;
  max-width: 220px; // 控制最大宽度，使卡片更窄
  margin: 0 auto; // 居中显示
  box-shadow: $shadow-light;
  cursor: pointer;
  background-color: white;
  border: 1px solid $border-light;

  &:hover {
    transform: translateY(-3px); // 减小悬停效果
    box-shadow: $shadow-discount;

    .buy-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .product-image {
      transform: scale(1.03); // 减小缩放效果
    }

    .discount-badge {
      transform: scale(1.05) rotate(-3deg); // 减小旋转效果
    }
  }

  // 折扣徽章 - 更醒目的样式
  .discount-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: linear-gradient(135deg, $discount-red, $discount-bright);
    color: white;
    font-weight: bold;
    padding: 3px 6px;
    border-radius: 4px;
    z-index: 3;
    box-shadow: $shadow-discount;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    font-size: 12px; // 减小字体大小

    // 添加脉冲动画，减弱效果
    animation: discountPulse 2.5s infinite alternate;

    @keyframes discountPulse {
      0% {
        box-shadow: 0 0 3px rgba($discount-red, 0.4);
      }

      100% {
        box-shadow: 0 0 8px rgba($discount-red, 0.7);
      }
    }

    .discount-label {
      background-color: white;
      color: $discount-red;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      margin-right: 3px;
    }

    .discount-value {
      font-size: 14px;
    }
  }

  .platform-tag {
    position: absolute;
    top: 0;
    left: 0;
    padding: 3px 6px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    z-index: 2;
    border-bottom-right-radius: 6px;

    &.jd {
      background: linear-gradient(135deg, $discount-red, $discount-deep);
      color: white;
    }

    &.taobao {
      background: linear-gradient(135deg, $urgency-orange, color.scale($urgency-orange, $lightness: -20%));
      color: white;
    }

    &.pdd {
      background: linear-gradient(135deg, $discount-bright, $discount-red);
      color: white;
    }

    &.tmall {
      background: linear-gradient(135deg, $discount-red, color.scale($discount-red, $lightness: -24.7%));
      color: white;
    }

    &.other {
      background: linear-gradient(135deg, #666, #444);
      color: white;
    }
  }

  .image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: $surface-light;
    color: $text-secondary;
  }

  .product-image {
    height: 120px; // 减小图片高度
    transition: transform 0.5s ease;
    object-fit: contain; // 确保图片完整展示
    background-color: #f9f9f9; // 添加浅灰色背景，让图片更清晰
  }

  .product-content {
    padding: 8px; // 减小内边距
  }

  .product-title {
    font-weight: 600;
    font-size: 13px; // 减小字体大小
    line-height: 1.3;
    margin-bottom: 8px;
    color: $text-primary;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 34px;
  }

  .price-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

    .price-tag {
      display: inline-block;
      padding: 2px 5px;
      background-color: $discount-light;
      color: $discount-red;
      font-size: 11px;
      font-weight: 600;
      border-radius: 3px;
      // 添加边框使标签更突出
      border: 1px dashed rgba($discount-red, 0.3);
    }
  }

  .product-price {
    display: flex;
    align-items: baseline;

    .price-symbol {
      color: $discount-red;
      font-size: 11px;
      font-weight: 600;
      margin-right: 1px;
    }

    .current-price {
      font-size: 18px; // 减小字体大小
      font-weight: 700;
      color: $discount-red;
      // 添加文字阴影增加突出效果
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
    }

    .original-price {
      font-size: 11px;
      color: $text-secondary;
      text-decoration: line-through;
      margin-left: 4px;
    }
  }

  // 新增优惠标签样式
  .promotion-tag {
    background-color: $urgency-light;
    color: $urgency-orange;
    font-size: 11px;
    padding: 2px 5px;
    border-radius: 3px;
    margin-bottom: 5px;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-left: 2px solid $urgency-orange;
  }

  .product-platform {
    font-size: 11px;
    font-weight: 500;
    color: $text-secondary;
    display: flex;
    align-items: center;
  }

  .buy-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8), transparent);
    padding: 20px 0 10px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.3s ease;

    .buy-btn {
      font-weight: 600;
      font-size: 12px; // 减小按钮字体
      padding: 5px 15px;
      transition: all 0.2s ease;
      background: linear-gradient(to right, $discount-red, $discount-bright);

      &:hover {
        transform: scale(1.03);
        background: linear-gradient(to right, $discount-bright, $discount-red);
        box-shadow: 0 3px 8px rgba($discount-red, 0.5);
      }
    }
  }
}
</style>
