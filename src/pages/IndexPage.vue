<template>
  <q-page class="home-page">
    <!-- 主要内容区域 -->
    <div class="main-content q-pt-lg">
      <!-- 分类导航入口 -->
      <div class="categories-section container q-mb-xl">
        <h2 class="section-title q-mb-md">
          <span class="text-primary">商品分类</span>
          <small>轻松购物 分类导航</small>
        </h2>
        <div class="row q-col-gutter-lg">
          <div class="col" v-for="category in categories" :key="category.id">
            <q-card class="category-card" flat bordered>
              <q-card-section class="text-center q-pa-md">
                <q-icon :name="category.icon" size="52px" :color="category.color" />
                <div class="text-subtitle1 q-mt-md">{{ category.title }}</div>
                <div class="text-caption text-grey-7">{{ category.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 商品展示区 -->
      <div class="products-section container q-mb-xl">
        <h2 class="section-title q-mb-lg">
          <span class="text-primary">今日特惠</span>
          <small>每日精选超值商品</small>
        </h2>
        <div class="row q-col-gutter-lg">
          <div class="col-3" v-for="product in products" :key="product.id">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>

      <!-- 优惠文章导航 -->
      <div class="articles-section container q-mb-xl">
        <div class="section-header q-mb-lg">
          <h2 class="section-title">
            <span class="text-primary">优惠资讯</span>
            <small>实时更新优惠信息</small>
          </h2>
          <q-btn flat color="primary" label="查看更多" icon-right="chevron_right" />
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-6" v-for="article in articles" :key="article.id">
            <q-card class="article-card" flat bordered>
              <div class="row no-wrap">
                <div class="col-5">
                  <q-img :src="article.image" :ratio="16 / 9" class="rounded-borders" />
                </div>
                <div class="col-7 q-pa-lg">
                  <div class="text-overline text-primary">{{ article.category }}</div>
                  <div class="text-h6 ellipsis-2-lines q-mb-md">{{ article.title }}</div>
                  <div class="text-caption text-grey-8 ellipsis-2-lines">{{ article.description }}</div>
                  <div class="article-footer absolute-bottom q-px-lg q-pb-sm row items-center justify-between">
                    <div class="text-caption text-grey-7">{{ article.date }}</div>
                    <div class="row items-center">
                      <q-icon name="visibility" size="16px" class="q-mr-xs" />
                      <span class="text-caption text-grey-7">{{ article.views }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>

      <!-- 管理员入口 -->
      <div class="text-center q-mt-xl">
        <q-btn flat color="grey-7" label="管理员入口" icon="admin_panel_settings" @click="goToAdmin" />
      </div>
    </div>

    <!-- 管理员登录对话框 -->
    <q-dialog v-model="showAdminDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">管理员登录</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="adminPassword" filled :type="isPwd ? 'password' : 'text'" label="请输入管理员密码" lazy-rules>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="确认" @click="handleAdminLogin" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import ProductCard from 'components/ProductCard.vue'

const router = useRouter()
const $q = useQuasar()

// 分类数据
const categories = ref([
  {
    id: 1,
    title: '生活用品',
    description: '居家好物',
    icon: 'home',
    color: 'deep-purple'
  },
  {
    id: 2,
    title: '个护美妆',
    description: '美丽焕新',
    icon: 'spa',
    color: 'pink'
  },
  {
    id: 3,
    title: '健康食品',
    description: '营养保健',
    icon: 'restaurant_menu',
    color: 'green'
  },
  {
    id: 4,
    title: '电子数码',
    description: '智能科技',
    icon: 'devices',
    color: 'blue'
  },
  {
    id: 5,
    title: '宠物用品',
    description: '呵护伴侣',
    icon: 'pets',
    color: 'orange'
  }
])

// 优惠文章数据
const articles = ref([
  {
    id: 1,
    title: '5月特惠：苹果全系列产品优惠活动',
    description: '本月Apple官方旗舰店推出全系列产品优惠活动，iPad最高立减500元，iPhone全系列享受教育优惠...',
    category: '数码产品',
    image: 'https://cdn.pixabay.com/photo/2014/05/02/21/50/home-office-336377_1280.jpg',
    date: '2025-05-01',
    views: '2.1k'
  },
  {
    id: 2,
    title: '年中购物节：精选美妆护肤品大促',
    description: '各大美妆品牌联合促销，资生堂、兰蔻、雅诗兰黛等品牌低至5折，还有满减优惠券可叠加使用...',
    category: '美妆护肤',
    image: 'https://cdn.pixabay.com/photo/2016/06/17/09/54/beauty-1463395_1280.jpg',
    date: '2025-05-01',
    views: '1.8k'
  },
  {
    id: 3,
    title: '618提前购：家电预售开启',
    description: '618大促即将来临，各大电商平台家电预售已开启，抢先付定金最高可享受价格保护...',
    category: '家用电器',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/13/03/appliance-1834256_1280.jpg',
    date: '2025-04-30',
    views: '3.2k'
  },
  {
    id: 4,
    title: '超市生活用品联合优惠',
    description: '沃尔玛、家乐福等超市联合推出生活用品优惠活动，日用品买二赠一，清洁用品满100减50...',
    category: '生活用品',
    image: 'https://cdn.pixabay.com/photo/2016/11/22/19/08/hangers-1850082_1280.jpg',
    date: '2025-04-30',
    views: '1.5k'
  }
])

// 商品数据
const products = ref([
  {
    id: 1,
    title: 'Apple iPhone 15 Pro Max 256GB',
    currentPrice: 8999,
    originalPrice: 9999,
    image: 'https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_1280.jpg',
    platform: 'jd'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 无线降噪耳机',
    currentPrice: 2499,
    originalPrice: 2999,
    image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg',
    platform: 'taobao'
  },
  {
    id: 3,
    title: 'Nike Air Max 2024 运动鞋',
    currentPrice: 799,
    originalPrice: 1299,
    image: 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg',
    platform: 'pdd'
  },
  {
    id: 4,
    title: '戴森 V15 Detect 无线吸尘器',
    currentPrice: 3999,
    originalPrice: 4999,
    image: 'https://cdn.pixabay.com/photo/2015/07/02/10/22/cleaning-828559_1280.jpg',
    platform: 'jd'
  },
  {
    id: 5,
    title: 'Samsung 65寸 4K QLED电视',
    currentPrice: 5999,
    originalPrice: 7999,
    image: 'https://cdn.pixabay.com/photo/2015/02/07/20/58/tv-627876_1280.jpg',
    platform: 'taobao'
  },
  {
    id: 6,
    title: 'Apple MacBook Pro 14" M3芯片',
    currentPrice: 12999,
    originalPrice: 14999,
    image: 'https://cdn.pixabay.com/photo/2014/05/02/21/49/laptop-336373_1280.jpg',
    platform: 'jd'
  },
  {
    id: 7,
    title: 'switch OLED游戏机',
    currentPrice: 1999,
    originalPrice: 2299,
    image: 'https://cdn.pixabay.com/photo/2017/04/04/18/07/video-game-console-2202622_1280.jpg',
    platform: 'pdd'
  },
  {
    id: 8,
    title: '华为 Watch GT4 智能手表',
    currentPrice: 1499,
    originalPrice: 1799,
    image: 'https://cdn.pixabay.com/photo/2015/06/25/17/21/smart-watch-821557_1280.jpg',
    platform: 'taobao'
  }
])

const showAdminDialog = ref(false)
const adminPassword = ref('')
const isPwd = ref(true)

function goToAdmin() {
  showAdminDialog.value = true
}

function handleAdminLogin() {
  if (adminPassword.value === 'admin123') {
    localStorage.setItem('isAdmin', 'true')  // 设置管理员状态
    showAdminDialog.value = false  // 关闭对话框
    adminPassword.value = ''  // 清空密码
    router.push('/admin')  // 跳转到后台管理页面
  } else {
    $q.notify({
      type: 'negative',
      message: '密码错误'
    })
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  .section-title {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin: 0;
    font-size: 24px;
    font-weight: 500;

    small {
      color: #666;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .categories-section {
    .category-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;
      border-color: rgba(0, 0, 0, 0.06);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
      }
    }
  }

  .articles-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .article-card {
      height: 220px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      border-color: rgba(0, 0, 0, 0.06);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
      }

      .ellipsis-2-lines {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .article-footer {
        background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%);
        width: 100%;
      }
    }
  }

  .products-section {
    .product-card {
      transition: all 0.3s ease;
      border-radius: 12px;
      border-color: rgba(0, 0, 0, 0.06);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
      }

      .product-title {
        font-size: 14px;
        line-height: 1.4;
        height: 40px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price-section {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .price-label {
            color: #666;
            font-size: 14px;
          }

          .current-price {
            color: #ff6b6b;
            font-size: 20px;
            font-weight: bold;
          }
        }

        .original-price {
          color: #999;
          text-decoration: line-through;
          font-size: 12px;
        }
      }
    }

    .platform-tag {
      .platform-chip {
        font-size: 12px;
        padding: 4px 8px;
      }
    }
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>
