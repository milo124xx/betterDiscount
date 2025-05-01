<template>
    <q-page class="search-results-page">
        <!-- 主要内容区域 -->
        <div class="main-content q-py-lg">
            <div class="container">
                <div class="search-header q-mb-lg">
                    <h2 class="section-title">
                        <span class="text-primary">搜索结果</span>
                        <small>"{{ searchQuery }}" (共 {{ filteredProducts.length }} 个结果)</small>
                    </h2>
                </div>

                <!-- 筛选条件栏 -->
                <div class="filter-section q-mb-lg">
                    <div class="row items-center justify-between">
                        <div class="platform-filter">
                            <div class="platform-buttons row q-gutter-x-sm">
                                <q-btn v-for="platform in platformOptions" :key="platform.value" :label="platform.label"
                                    :color="selectedPlatform === platform.value ? platform.activeColor : 'white'"
                                    :text-color="selectedPlatform === platform.value ? 'white' : platform.textColor"
                                    :class="['platform-btn', selectedPlatform === platform.value ? 'active' : '']"
                                    @click="selectedPlatform = platform.value" unelevated no-caps />
                            </div>
                        </div>
                        <div class="sort-filter">
                            <q-btn-dropdown color="primary" :label="currentSortLabel" unelevated class="sort-dropdown">
                                <q-list>
                                    <q-item v-for="option in sortOptions" :key="option.value" clickable v-close-popup
                                        @click="handleSort(option.value)">
                                        <q-item-section>
                                            <q-item-label>{{ option.label }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section avatar v-if="sortBy === option.value">
                                            <q-icon name="check" color="primary" />
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                    </div>
                </div>

                <!-- 商品展示区 -->
                <div class="products-section">
                    <div class="row q-col-gutter-lg">
                        <div class="col-3" v-for="product in sortedAndFilteredProducts" :key="product.id">
                            <ProductCard :product="product" :platform-label="getPlatformLabel(product.platform)"
                                :platform-color="getPlatformColor(product.platform)" />
                        </div>
                    </div>

                    <!-- 无结果显示 -->
                    <div v-if="sortedAndFilteredProducts.length === 0" class="no-results q-pa-xl text-center">
                        <q-icon name="search_off" size="48px" color="grey-5" />
                        <p class="text-h6 text-grey-7 q-mt-md">未找到相关商品</p>
                        <p class="text-body2 text-grey-6">请尝试使用其他关键词搜索</p>
                        <q-btn color="primary" label="返回首页" @click="goHome" class="q-mt-md" />
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from 'components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const searchQuery = computed(() => route.query.q || '')

// 筛选和排序状态
const selectedPlatform = ref('all')
const sortBy = ref('default')

// 排序选项
const sortOptions = [
    { label: '默认排序', value: 'default' },
    { label: '价格从低到高', value: 'price-asc' },
    { label: '价格从高到低', value: 'price-desc' }
]

// 当前排序标签
const currentSortLabel = computed(() => {
    return sortOptions.find(option => option.value === sortBy.value)?.label || '默认排序'
})

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

// 平台相关函数
function getPlatformLabel(platform) {
    const platformMap = {
        jd: '京东',
        taobao: '淘宝',
        pdd: '拼多多'
    }
    return platformMap[platform] || platform
}

function getPlatformColor(platform) {
    const colorMap = {
        jd: 'red',
        taobao: 'orange',
        pdd: 'pink'
    }
    return colorMap[platform] || 'grey'
}

// 处理排序
function handleSort(value) {
    sortBy.value = value
}

// 返回首页
function goHome() {
    router.push('/')
}

// 测试商品数据
const allProducts = ref([
    {
        id: 1,
        title: 'Apple iPhone 15 Pro Max 256GB',
        currentPrice: 8999,
        originalPrice: 9999,
        image: 'https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_1280.jpg',
        keywords: ['手机', 'iphone', '苹果', 'apple', '智能手机'],
        platform: 'jd'
    },
    {
        id: 2,
        title: 'Sony WH-1000XM5 无线降噪耳机',
        currentPrice: 2499,
        originalPrice: 2999,
        image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg',
        keywords: ['耳机', '索尼', 'sony', '降噪', '无线'],
        platform: 'taobao'
    },
    {
        id: 3,
        title: 'Nike Air Max 2024 运动鞋',
        currentPrice: 799,
        originalPrice: 1299,
        image: 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg',
        keywords: ['鞋', '运动鞋', 'nike', '耐克'],
        platform: 'pdd'
    },
    {
        id: 4,
        title: '戴森 V15 Detect 无线吸尘器',
        currentPrice: 3999,
        originalPrice: 4999,
        image: 'https://cdn.pixabay.com/photo/2015/07/02/10/22/cleaning-828559_1280.jpg',
        keywords: ['吸尘器', '戴森', 'dyson', '家电'],
        platform: 'jd'
    },
    {
        id: 5,
        title: '小米 14 Pro 骁龙8Gen3',
        currentPrice: 4999,
        originalPrice: 5299,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/12/30/android-1869510_1280.jpg',
        keywords: ['手机', '小米', 'xiaomi', '智能手机'],
        platform: 'pdd'
    },
    {
        id: 6,
        title: 'OPPO Find X7 Ultra',
        currentPrice: 5999,
        originalPrice: 6499,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/android-1867759_1280.jpg',
        keywords: ['手机', 'oppo', '智能手机'],
        platform: 'taobao'
    }
])

// 根据搜索词过滤商品
const filteredProducts = computed(() => {
    if (!searchQuery.value) return allProducts.value

    const query = searchQuery.value.toLowerCase()
    return allProducts.value.filter(product => {
        return product.title.toLowerCase().includes(query) ||
            product.keywords.some(keyword => keyword.toLowerCase().includes(query))
    })
})

// 根据平台和排序条件筛选和排序商品
const sortedAndFilteredProducts = computed(() => {
    // 先按平台筛选
    let result = selectedPlatform.value === 'all'
        ? filteredProducts.value
        : filteredProducts.value.filter(product => product.platform === selectedPlatform.value)

    // 再排序
    return result.slice().sort((a, b) => {
        switch (sortBy.value) {
            case 'price-asc':
                return a.currentPrice - b.currentPrice
            case 'price-desc':
                return b.currentPrice - a.currentPrice
            default:
                return 0
        }
    })
})
</script>

<style lang="scss" scoped>
.search-results-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .main-content {
        flex: 1;
    }

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

    .filter-section {
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

        .platform-buttons {
            .platform-btn {
                border: 1px solid;
                border-radius: 8px;
                min-width: 100px;
                padding: 8px 16px;
                transition: all 0.3s ease;

                &:not(.active) {
                    border-color: var(--q-primary);

                    &:hover {
                        background: rgba(0, 0, 0, 0.03);
                    }
                }

                &.active {
                    transform: scale(1.05);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                &:first-child {
                    &:not(.active) {
                        border-color: var(--q-primary);
                    }
                }

                &:nth-child(2) {
                    &:not(.active) {
                        border-color: var(--q-red-8);
                    }
                }

                &:nth-child(3) {
                    &:not(.active) {
                        border-color: var(--q-orange-8);
                    }
                }

                &:nth-child(4) {
                    &:not(.active) {
                        border-color: var(--q-pink-8);
                    }
                }
            }
        }

        .sort-dropdown {
            min-width: 140px;
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

.no-results {
    margin-top: 48px;
}
</style>