<template>
    <q-page class="admin-page q-pa-md">
        <div class="container">
            <q-tabs v-model="activeTab" dense class="text-primary q-mb-md" active-color="primary"
                indicator-color="primary" align="left">
                <q-tab name="products" icon="inventory_2" label="商品管理" />
                <q-tab name="articles" icon="article" label="文章管理" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated>
                <!-- 商品管理面板 -->
                <q-tab-panel name="products">
                    <div class="panel-header q-mb-md">
                        <div class="row justify-between items-center">
                            <h3 class="text-h6 q-my-none">商品列表</h3>
                            <q-btn color="primary" icon="add" label="添加商品" @click="showAddProductDialog = true" />
                        </div>
                    </div>

                    <q-table :rows="products" :columns="productColumns" row-key="id" :pagination="{ rowsPerPage: 10 }">
                        <template v-slot:body-cell-image="props">
                            <q-td :props="props">
                                <q-img :src="props.row.image" style="width: 80px; height: 80px" />
                            </q-td>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn-group flat>
                                    <q-btn flat round color="primary" icon="edit" @click="editProduct(props.row)" />
                                    <q-btn flat round color="negative" icon="delete"
                                        @click="deleteProduct(props.row)" />
                                </q-btn-group>
                            </q-td>
                        </template>
                    </q-table>
                </q-tab-panel>

                <!-- 文章管理面板 -->
                <q-tab-panel name="articles">
                    <div class="panel-header q-mb-md">
                        <div class="row justify-between items-center">
                            <h3 class="text-h6 q-my-none">文章列表</h3>
                            <q-btn color="primary" icon="add" label="添加文章" @click="showAddArticleDialog = true" />
                        </div>
                    </div>

                    <q-table :rows="articles" :columns="articleColumns" row-key="id" :pagination="{ rowsPerPage: 10 }">
                        <template v-slot:body-cell-image="props">
                            <q-td :props="props">
                                <q-img :src="props.row.image" style="width: 120px; height: 80px" />
                            </q-td>
                        </template>
                        <template v-slot:body-cell-actions="props">
                            <q-td :props="props">
                                <q-btn-group flat>
                                    <q-btn flat round color="primary" icon="edit" @click="editArticle(props.row)" />
                                    <q-btn flat round color="negative" icon="delete"
                                        @click="deleteArticle(props.row)" />
                                </q-btn-group>
                            </q-td>
                        </template>
                    </q-table>
                </q-tab-panel>
            </q-tab-panels>
        </div>

        <!-- 添加/编辑商品对话框 -->
        <q-dialog v-model="showAddProductDialog" persistent>
            <q-card style="min-width: 700px">
                <q-card-section>
                    <div class="text-h6">{{ editingProduct ? '编辑商品' : '添加商品' }}</div>
                </q-card-section>

                <q-card-section>
                    <q-form @submit="handleProductSubmit" class="q-gutter-md">
                        <!-- 平台选择 -->
                        <q-select v-model="productForm.platform" :options="platformOptions" label="销售平台" emit-value
                            map-options :rules="[val => !!val || '请选择销售平台']" />

                        <!-- 通用字段 -->
                        <q-input v-model="productForm.title" label="商品名称" :rules="[val => !!val || '请输入商品名称']" />

                        <q-select v-model="productForm.category" :options="categoryOptions" label="商品分类" emit-value
                            map-options :rules="[val => !!val || '请选择商品分类']" />

                        <!-- 添加日期输入 -->
                        <q-input v-model="productForm.addDate" label="添加日期" mask="####/##/##"
                            :rules="[val => !!val || '请选择添加日期']">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="productForm.addDate" mask="YYYY/MM/DD">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="确定" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>

                        <q-input v-model="productForm.promotionText" label="推广文案" type="textarea"
                            :rules="[val => !!val || '请输入推广文案']" />

                        <!-- 商品图片上传 -->
                        <div class="q-pa-md">
                            <div class="text-subtitle2 q-mb-sm">商品图片</div>
                            <div class="row q-col-gutter-md">
                                <div class="col-12">
                                    <q-file v-model="productForm.images" label="点击上传商品图片" multiple
                                        accept=".jpg,.jpeg,.png,.gif" :rules="[val => val.length > 0 || '请上传商品图片']"
                                        bottom-slots counter style="max-width: 100%">
                                        <template v-slot:prepend>
                                            <q-icon name="attach_file" />
                                        </template>
                                        <template v-slot:hint>
                                            支持jpg、jpeg、png、gif格式
                                        </template>
                                    </q-file>
                                </div>

                                <!-- 商品图片预览 -->
                                <template v-if="productForm.images && productForm.images.length > 0">
                                    <div v-for="(image, index) in previewImages.products" :key="index"
                                        class="col-4 col-sm-3">
                                        <q-card class="image-preview-card">
                                            <q-img :src="image" style="height: 200px">
                                                <div class="absolute-top-right q-pa-xs">
                                                    <q-btn round flat dense color="negative" icon="delete"
                                                        @click="removeProductImage(index)" />
                                                </div>
                                            </q-img>
                                        </q-card>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- 扫码直达图片上传 -->
                        <div class="q-pa-md">
                            <div class="text-subtitle2 q-mb-sm">扫码直达图片</div>
                            <div class="row q-col-gutter-md">
                                <div class="col-12">
                                    <q-file v-model="productForm.qrCodeImages" label="点击上传扫码直达图片" multiple
                                        accept=".jpg,.jpeg,.png" :rules="[val => val && val.length > 0 || '请上传扫码直达图片']"
                                        bottom-slots counter style="max-width: 100%">
                                        <template v-slot:prepend>
                                            <q-icon name="qr_code_scanner" />
                                        </template>
                                        <template v-slot:hint>
                                            支持jpg、jpeg、png格式
                                        </template>
                                    </q-file>
                                </div>

                                <!-- 扫码直达图片预览 -->
                                <template v-if="productForm.qrCodeImages && productForm.qrCodeImages.length > 0">
                                    <div v-for="(image, index) in previewImages.qrCodes" :key="index"
                                        class="col-4 col-sm-3">
                                        <q-card class="image-preview-card">
                                            <q-img :src="image" style="height: 200px">
                                                <div class="absolute-top-right q-pa-xs">
                                                    <q-btn round flat dense color="negative" icon="delete"
                                                        @click="removeQrCodeImage(index)" />
                                                </div>
                                            </q-img>
                                        </q-card>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- 京东特有字段 -->
                        <template v-if="productForm.platform === 'jd'">
                            <q-input v-model.number="productForm.originalPrice" label="原价" type="number"
                                :rules="[val => val > 0 || '请输入有效价格']" />
                            <q-input v-model.number="productForm.finalPrice" label="到手价" type="number"
                                :rules="[val => val > 0 || '请输入有效价格']" />
                            <q-checkbox v-model="productForm.isDirectSale" label="是否自营" />

                            <!-- 京东优惠券信息 -->
                            <div class="q-pa-md bg-grey-2 rounded-borders">
                                <div class="text-subtitle2 q-mb-sm">优惠券信息</div>
                                <div class="row q-col-gutter-md">
                                    <q-input v-model="productForm.coupon.condition" label="使用条件" class="col-12" />
                                    <q-input v-model="productForm.coupon.content" label="优惠券内容" class="col-12" />
                                    <q-input v-model="productForm.coupon.expireDate" label="优惠券有效期" type="date"
                                        class="col-12" />
                                    <q-input v-model="productForm.coupon.link" label="优惠券链接" type="url"
                                        class="col-12" />
                                </div>
                            </div>
                        </template>

                        <!-- 淘宝特有字段 -->
                        <template v-if="productForm.platform === 'taobao'">
                            <q-input v-model.number="productForm.couponAmount" label="优惠券面额" type="number"
                                :rules="[val => val >= 0 || '请输入有效优惠券金额']" />
                            <q-input v-model.number="productForm.finalPrice" label="到手价" type="number"
                                :rules="[val => val > 0 || '请输入有效价格']" />
                        </template>

                        <!-- 拼多多特有字段 -->
                        <template v-if="productForm.platform === 'pdd'">
                            <q-input v-model.number="productForm.originalPrice" label="原价" type="number"
                                :rules="[val => val > 0 || '请输入有效价格']" />
                            <q-input v-model.number="productForm.finalPrice" label="到手价" type="number"
                                :rules="[val => val > 0 || '请输入有效价格']" />
                        </template>

                        <!-- 推广链接相关 -->
                        <q-input v-model="productForm.promotionLink" label="推广链接" type="url"
                            :rules="[val => !!val || '请输入推广链接']" />
                        <q-input v-model="productForm.promotionExpireDate" label="推广链接失效日期" mask="####/##/##" disable />

                        <div class="row justify-end q-gutter-sm">
                            <q-btn label="取消" color="grey" v-close-popup />
                            <q-btn label="确认" type="submit" color="primary" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- 添加/编辑文章对话框 -->
        <q-dialog v-model="showAddArticleDialog" persistent>
            <q-card style="min-width: 500px">
                <q-card-section>
                    <div class="text-h6">{{ editingArticle ? '编辑文章' : '添加文章' }}</div>
                </q-card-section>

                <q-card-section>
                    <q-form @submit="handleArticleSubmit" class="q-gutter-md">
                        <q-input v-model="articleForm.title" label="文章标题" :rules="[val => !!val || '请输入文章标题']" />
                        <q-input v-model="articleForm.description" label="文章描述" type="textarea"
                            :rules="[val => !!val || '请输入文章描述']" />
                        <q-input v-model="articleForm.image" label="封面图片URL" type="url" />
                        <q-input v-model="articleForm.category" label="文章分类" />

                        <div class="row justify-end q-gutter-sm">
                            <q-btn label="取消" color="grey" v-close-popup />
                            <q-btn label="确认" type="submit" color="primary" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'

const $q = useQuasar()

// 标签页控制
const activeTab = ref('products')
const showAddProductDialog = ref(false)
const showAddArticleDialog = ref(false)
const editingProduct = ref(null)
const editingArticle = ref(null)

// 商品分类选项
const categoryOptions = [
    { label: '生活用品', value: 'daily' },
    { label: '个护美妆', value: 'beauty' },
    { label: '健康食品', value: 'health' },
    { label: '电子数码', value: 'digital' },
    { label: '宠物用品', value: 'pet' }
]

// 平台选项
const platformOptions = [
    { label: '京东', value: 'jd' },
    { label: '淘宝', value: 'taobao' },
    { label: '拼多多', value: 'pdd' }
]

// 商品表单的初始化和处理
const productForm = reactive({
    title: '', // 商品名称
    category: '', // 商品分类
    platform: '', // 平台
    addDate: date.formatDate(new Date(), 'YYYY/MM/DD'), // 默认为当前日期
    promotionText: '', // 推广文案
    images: [], // 商品图片
    qrCodeImages: [], // 扫码直达图片
    originalPrice: 0, // 原价
    finalPrice: 0, // 到手价
    promotionLink: '', // 推广链接
    promotionExpireDate: date.formatDate(date.addToDate(new Date(), { days: 59 }), 'YYYY/MM/DD'), // 默认为当前日期+59天
    // 京东特有字段
    isDirectSale: false, // 是否自营
    coupon: {
        condition: '', // 优惠券使用条件
        content: '', // 优惠券内容
        expireDate: '', // 优惠券有效期
        link: '' // 优惠券链接
    },
    // 淘宝特有字段
    couponAmount: 0, // 优惠券面额
})

// 图片预览数据
const previewImages = reactive({
    products: [], // 商品图片预览
    qrCodes: [] // 扫码直达图片预览
})

// 根据平台计算显示的字段
const showFields = computed(() => {
    const commonFields = ['title', 'category', 'addDate', 'promotionText', 'images', 'qrCodeImages', 'promotionLink']

    switch (productForm.platform) {
        case 'jd':
            return [...commonFields, 'originalPrice', 'finalPrice', 'isDirectSale', 'coupon']
        case 'taobao':
            return [...commonFields, 'couponAmount', 'finalPrice']
        case 'pdd':
            return [...commonFields, 'originalPrice', 'finalPrice']
        default:
            return commonFields
    }
})

// 监听添加商品对话框的显示状态
watch(() => showAddProductDialog.value, (isVisible) => {
    if (isVisible) {
        if (!editingProduct.value) {
            // 新增商品时，重置表单并设置默认日期
            const today = new Date()
            productForm.addDate = date.formatDate(today, 'YYYY/MM/DD')
            productForm.promotionExpireDate = date.formatDate(date.addToDate(today, { days: 59 }), 'YYYY/MM/DD')
        }
    }
}, { immediate: true })

// 监听添加日期变化，实时更新失效日期
watch(() => productForm.addDate, (newDate) => {
    if (newDate) {
        const addDate = new Date(newDate)
        const expireDate = date.addToDate(addDate, { days: 59 })
        productForm.promotionExpireDate = date.formatDate(expireDate, 'YYYY/MM/DD')
    }
}, { immediate: true })

// 监听商品图片变化
watch(() => productForm.images, (newImages) => {
    if (newImages) {
        previewImages.products = newImages.map(file => URL.createObjectURL(file))
    } else {
        previewImages.products = []
    }
})

// 监听扫码直达图片变化
watch(() => productForm.qrCodeImages, (newImages) => {
    if (newImages) {
        previewImages.qrCodes = newImages.map(file => URL.createObjectURL(file))
    } else {
        previewImages.qrCodes = []
    }
})

// 删除商品图片
function removeProductImage(index) {
    productForm.images.splice(index, 1)
    previewImages.products.splice(index, 1)
}

// 删除扫码直达图片
function removeQrCodeImage(index) {
    productForm.qrCodeImages.splice(index, 1)
    previewImages.qrCodes.splice(index, 1)
}

// 重置表单时的处理
function resetProductForm() {
    const today = new Date()

    Object.assign(productForm, {
        title: '',
        category: '',
        platform: '',
        addDate: date.formatDate(today, 'YYYY/MM/DD'),
        promotionText: '',
        images: [],
        qrCodeImages: [],
        originalPrice: 0,
        finalPrice: 0,
        promotionLink: '',
        promotionExpireDate: date.formatDate(date.addToDate(today, { days: 59 }), 'YYYY/MM/DD'),
        isDirectSale: false,
        coupon: {
            condition: '',
            content: '',
            expireDate: '',
            link: ''
        },
        couponAmount: 0
    })
}

// 表格列定义
const productColumns = [
    { name: 'image', label: '商品图片', field: 'image', align: 'center' },
    { name: 'title', label: '商品名称', field: 'title', align: 'left' },
    { name: 'currentPrice', label: '当前价格', field: 'currentPrice', align: 'right' },
    { name: 'originalPrice', label: '原始价格', field: 'originalPrice', align: 'right' },
    { name: 'platform', label: '销售平台', field: 'platform', align: 'center' },
    { name: 'actions', label: '操作', field: 'actions', align: 'center' }
]

const articleColumns = [
    { name: 'image', label: '封面图片', field: 'image', align: 'center' },
    { name: 'title', label: '文章标题', field: 'title', align: 'left' },
    { name: 'category', label: '分类', field: 'category', align: 'center' },
    { name: 'date', label: '发布日期', field: 'date', align: 'center' },
    { name: 'views', label: '阅读量', field: 'views', align: 'right' },
    { name: 'actions', label: '操作', field: 'actions', align: 'center' }
]

// 商品相关
const products = ref([
    {
        id: 1,
        title: 'Apple iPhone 15 Pro Max 256GB',
        currentPrice: 8999,
        originalPrice: 9999,
        image: 'https://cdn.pixabay.com/photo/2014/08/05/10/27/iphone-410311_1280.jpg',
        platform: 'jd',
        keywords: ['手机', 'iphone', '苹果', 'apple']
    },
    {
        id: 2,
        title: 'Sony WH-1000XM5 无线降噪耳机',
        currentPrice: 2499,
        originalPrice: 2999,
        image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg',
        platform: 'taobao',
        keywords: ['耳机', '索尼', 'sony', '降噪']
    },
    {
        id: 3,
        title: '戴森 V15 Detect 无线吸尘器',
        currentPrice: 3999,
        originalPrice: 4999,
        image: 'https://cdn.pixabay.com/photo/2015/07/02/10/22/cleaning-828559_1280.jpg',
        platform: 'jd',
        keywords: ['吸尘器', '戴森', 'dyson', '家电']
    },
    {
        id: 4,
        title: '小米 14 Pro 骁龙8Gen3',
        currentPrice: 4999,
        originalPrice: 5299,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/12/30/android-1869510_1280.jpg',
        platform: 'pdd',
        keywords: ['手机', '小米', 'xiaomi']
    }
])

// 文章相关
const articles = ref([
    {
        id: 1,
        title: '618购物节攻略：这些隐藏优惠券别错过',
        description: '618年中大促即将来临，各大电商平台的优惠活动规则已经出炉。本文为您详细解读各平台的优惠规则，教您如何最大化利用优惠券，让您的购物预算发挥最大价值。',
        category: '购物攻略',
        image: 'https://cdn.pixabay.com/photo/2016/11/22/19/08/hangers-1850082_1280.jpg',
        date: '2025-05-01',
        views: 2451
    },
    {
        id: 2,
        title: '年中好物推荐：高性价比数码产品盘点',
        description: '综合多个平台的用户评价和专业测评，我们精选出了2025年最具性价比的数码产品，包括手机、笔记本电脑、智能手表等多个品类，帮助您在618购物节做出明智的选择。',
        category: '数码产品',
        image: 'https://cdn.pixabay.com/photo/2014/05/02/21/50/home-office-336377_1280.jpg',
        date: '2025-04-30',
        views: 1832
    },
    {
        id: 3,
        title: '母亲节专题：温情好礼精选指南',
        description: '母亲节将至，我们精心挑选了多款适合送给母亲的礼物，包括护肤美妆、家居用品、健康器械等，并收集了各大平台的相关优惠活动，助您表达对母亲的爱。',
        category: '节日特辑',
        image: 'https://cdn.pixabay.com/photo/2016/06/17/09/54/beauty-1463395_1280.jpg',
        date: '2025-04-28',
        views: 3215
    },
    {
        id: 4,
        title: '开工季美食囤货指南',
        description: '五一假期结束，是时候为开工做准备了。本文为您推荐多款办公室必备的零食饮品，并整理了各大超市和电商平台的团购优惠，让您轻松囤货。',
        category: '美食推荐',
        image: 'https://cdn.pixabay.com/photo/2017/03/27/13/54/bread-2178874_1280.jpg',
        date: '2025-04-25',
        views: 2947
    }
])

// 商品操作方法
function editProduct(product) {
    editingProduct.value = product
    Object.assign(productForm, product)
    showAddProductDialog.value = true
}

function deleteProduct(product) {
    $q.dialog({
        title: '确认删除',
        message: `确定要删除商品"${product.title}"吗？`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        // 实现删除逻辑
        const index = products.value.findIndex(p => p.id === product.id)
        if (index > -1) {
            products.value.splice(index, 1)
            $q.notify({
                type: 'positive',
                message: '商品已删除'
            })
        }
    })
}

// 商品表单处理相关方法
async function handleProductSubmit() {
    try {
        // 准备基础数据
        const baseProductData = {
            title: productForm.title,
            category: productForm.category,
            platform: productForm.platform,
            addDate: productForm.addDate,
            promotionText: productForm.promotionText,
            promotionLink: productForm.promotionLink,
            promotionExpireDate: productForm.promotionExpireDate,
        }

        // 创建 FormData 对象用于文件上传
        const formData = new FormData()

        // 添加商品图片
        if (productForm.images && productForm.images.length > 0) {
            productForm.images.forEach((file, index) => {
                formData.append(`productImages`, file)
            })
        }

        // 添加扫码直达图片
        if (productForm.qrCodeImages && productForm.qrCodeImages.length > 0) {
            productForm.qrCodeImages.forEach((file, index) => {
                formData.append(`qrCodeImages`, file)
            })
        }

        // 根据平台添加特定字段
        let platformSpecificData = {}
        switch (productForm.platform) {
            case 'jd':
                platformSpecificData = {
                    originalPrice: productForm.originalPrice,
                    finalPrice: productForm.finalPrice,
                    isDirectSale: productForm.isDirectSale,
                    coupon: {
                        condition: productForm.coupon.condition,
                        content: productForm.coupon.content,
                        expireDate: productForm.coupon.expireDate,
                        link: productForm.coupon.link
                    }
                }
                break
            case 'taobao':
                platformSpecificData = {
                    couponAmount: productForm.couponAmount,
                    finalPrice: productForm.finalPrice
                }
                break
            case 'pdd':
                platformSpecificData = {
                    originalPrice: productForm.originalPrice,
                    finalPrice: productForm.finalPrice
                }
                break
        }

        // 合并所有数据
        const productData = {
            ...baseProductData,
            ...platformSpecificData,
        }

        // 将商品数据添加到 FormData
        formData.append('productData', JSON.stringify(productData))

        // 发送请求
        const endpoint = editingProduct.value
            ? `/api/products/${editingProduct.value.id}`
            : '/api/products'

        const method = editingProduct.value ? 'PUT' : 'POST'

        const response = await fetch(endpoint, {
            method: method,
            body: formData
        })

        if (!response.ok) {
            throw new Error('提交失败')
        }

        const result = await response.json()

        // 更新本地数据
        if (editingProduct.value) {
            const index = products.value.findIndex(p => p.id === editingProduct.value.id)
            if (index > -1) {
                products.value[index] = { ...products.value[index], ...result }
            }
        } else {
            products.value.push(result)
        }

        showAddProductDialog.value = false
        editingProduct.value = null
        resetProductForm()

        $q.notify({
            type: 'positive',
            message: '商品保存成功'
        })
    } catch (error) {
        console.error('提交失败:', error)
        $q.notify({
            type: 'negative',
            message: '商品保存失败，请重试'
        })
    }
}

// 文章操作方法
function editArticle(article) {
    editingArticle.value = article
    Object.assign(articleForm, article)
    showAddArticleDialog.value = true
}

function deleteArticle(article) {
    $q.dialog({
        title: '确认删除',
        message: `确定要删除文章"${article.title}"吗？`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        // 实现删除逻辑
        const index = articles.value.findIndex(a => a.id === article.id)
        if (index > -1) {
            articles.value.splice(index, 1)
            $q.notify({
                type: 'positive',
                message: '文章已删除'
            })
        }
    })
}

function handleArticleSubmit() {
    if (editingArticle.value) {
        // 更新文章
        const index = articles.value.findIndex(a => a.id === editingArticle.value.id)
        if (index > -1) {
            articles.value[index] = { ...editingArticle.value, ...articleForm }
        }
    } else {
        // 添加新文章
        articles.value.push({
            id: Date.now(), // 临时ID生成方式
            ...articleForm,
            date: new Date().toISOString().split('T')[0],
            views: 0
        })
    }

    showAddArticleDialog.value = false
    editingArticle.value = null
    // 重置表单
    Object.assign(articleForm, {
        title: '',
        description: '',
        image: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        views: 0
    })

    $q.notify({
        type: 'positive',
        message: '文章保存成功'
    })
}
</script>

<style lang="scss" scoped>
.admin-page {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .page-header {
        h2 {
            margin: 0;
            font-weight: 500;
        }
    }

    .panel-header {
        margin-bottom: 20px;
    }

    .image-preview-card {
        position: relative;

        .q-img {
            border-radius: 8px;
        }
    }
}
</style>