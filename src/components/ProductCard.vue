<template>
    <q-card class="product-card" bordered>
        <q-img :src="product.image" :ratio="1">
            <div class="platform-tag absolute-top-right q-pa-sm">
                <q-chip :color="getPlatformColor(product.platform)" text-color="white" size="sm" class="platform-chip">
                    {{ getPlatformLabel(product.platform) }}
                </q-chip>
            </div>
        </q-img>
        <q-card-section class="q-pa-md">
            <div class="product-title text-weight-medium q-mb-sm">{{ product.title }}</div>
            <div class="price-section">
                <div class="price-row">
                    <span class="price-label">到手价</span>
                    <span class="current-price">¥{{ product.currentPrice }}</span>
                </div>
                <div class="original-price">原价 ¥{{ product.originalPrice }}</div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
defineProps({
    product: {
        type: Object,
        required: true,
        validator: (product) => {
            return (
                product.id &&
                product.title &&
                product.currentPrice &&
                product.originalPrice &&
                product.image &&
                product.platform
            )
        }
    }
})

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
</script>

<style lang="scss" scoped>
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
</style>