<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="column" style="max-width: 1000px; margin: 32px auto;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ product.id ? '编辑商品' : '添加商品' }}</div>
      </q-card-section>

      <q-form @submit.prevent="handleSubmit" ref="productForm" class="column" style="height: calc(100vh - 150px)">
        <q-card-section class="q-pa-lg scroll col">
          <div class="row q-col-gutter-md">
            <!-- 左侧表单 -->
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <!-- 基础信息卡片 -->
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">基础信息</div>
                      <div class="row q-col-gutter-md">
                        <!-- 商品标题 -->
                        <div class="col-12">
                          <q-input filled v-model="product.title" label="商品名称"
                            :rules="[val => !!val || '请输入商品名称']" lazy-rules />
                        </div>
                        <!-- 平台和分类选择 -->
                        <div class="col-12 col-sm-6">
                          <q-select filled v-model="product.platform"
                            :options="platformOptions" label="销售平台"
                            emit-value map-options
                            :rules="[val => !!val || '请选择销售平台']" lazy-rules />
                        </div>
                        <div class="col-12 col-sm-6">
                          <q-select filled v-model="product.category"
                            :options="categoryOptions" label="商品分类"
                            emit-value map-options
                            :rules="[val => !!val || '请选择商品分类']" lazy-rules />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 价格信息卡片 -->
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">价格信息</div>
                      <div class="row q-col-gutter-md">
                        <!-- 原价和到手价 -->
                        <template v-if="['jd', 'pdd'].includes(product.platform)">
                          <div class="col-12 col-sm-6">
                            <q-input filled v-model.number="product.original_price"
                              label="原价" type="number" prefix="￥"
                              :rules="[val => val > 0 || '请输入有效价格']" lazy-rules />
                          </div>
                        </template>
                        <div class="col-12 col-sm-6">
                          <q-input filled v-model.number="product.final_price"
                            label="到手价" type="number" prefix="￥"
                            :rules="[val => val > 0 || '请输入有效价格']" lazy-rules />
                        </div>

                        <!-- 京东特有字段 -->
                        <template v-if="product.platform === 'jd'">
                          <div class="col-12">
                            <q-checkbox v-model="product.is_direct_sale" label="京东自营" />
                          </div>
                          <div class="col-12">
                            <q-card flat bordered class="q-pa-sm bg-grey-1">
                              <div class="text-subtitle2 q-mb-sm">优惠券信息</div>
                              <div class="row q-col-gutter-sm">
                                <div class="col-12 col-sm-6">
                                  <q-input dense filled v-model="product.coupon_info.condition"
                                    label="使用条件" placeholder="例：满199元可用" />
                                </div>
                                <div class="col-12 col-sm-6">
                                  <q-input dense filled v-model="product.coupon_info.content"
                                    label="优惠内容" placeholder="例：减20元" />
                                </div>
                                <div class="col-12 col-sm-6">
                                  <q-input dense filled v-model="product.coupon_info.link"
                                    label="优惠券链接" type="url" />
                                </div>
                                <div class="col-12 col-sm-6">
                                  <q-input dense filled v-model="product.coupon_info.expire_date"
                                    label="优惠券有效期" mask="####/##/##">
                                    <template v-slot:append>
                                      <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale"
                                          transition-hide="scale">
                                          <q-date v-model="product.coupon_info.expire_date"
                                            mask="YYYY/MM/DD">
                                            <div class="row items-center justify-end">
                                              <q-btn v-close-popup label="确定"
                                                color="primary" flat />
                                            </div>
                                          </q-date>
                                        </q-popup-proxy>
                                      </q-icon>
                                    </template>
                                  </q-input>
                                </div>
                              </div>
                            </q-card>
                          </div>
                        </template>

                        <!-- 淘宝特有字段 -->
                        <template v-if="product.platform === 'taobao'">
                          <div class="col-12 col-sm-6">
                            <q-input filled v-model.number="product.coupon_amount"
                              label="优惠券面额" type="number" prefix="￥"
                              :rules="[val => val >= 0 || '请输入有效优惠券金额']" lazy-rules>
                              <template v-slot:hint>
                                输入0表示无优惠券
                              </template>
                            </q-input>
                          </div>
                        </template>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- 推广信息卡片 -->
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section>
                      <div class="text-subtitle1 q-mb-md">推广信息</div>
                      <div class="row q-col-gutter-md">
                        <div class="col-12">
                          <q-input filled v-model="product.promotion_text"
                            label="推广文案" type="textarea" rows="3"
                            :rules="[val => !!val || '请输入推广文案']" lazy-rules />
                        </div>
                        <div class="col-12">
                          <q-input filled v-model="product.promotion_link"
                            label="推广链接" type="url"
                            :rules="[val => !!val || '请输入推广链接']" lazy-rules />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- 右侧表单 -->
            <div class="col-12 col-md-4">
              <!-- 日期信息卡片 -->
              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <div class="text-subtitle1 q-mb-md">日期信息</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12">
                      <q-input filled v-model="product.add_date" label="添加日期"
                        mask="####/##/##">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale"
                              transition-hide="scale">
                              <q-date v-model="product.add_date"
                                mask="YYYY/MM/DD">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="确定"
                                    color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-12">
                      <q-input filled v-model="product.promotion_expire_date"
                        label="失效日期" disable />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <!-- 图片上传卡片 -->
              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <div class="text-subtitle1">商品图片</div>
                  <div class="q-mt-sm">
                    <q-file filled v-model="productImages.files" label="上传商品图片"
                      multiple accept=".jpg,.jpeg,.png,.gif"
                      :rules="[
                        val => (val && val.length > 0) ||
                              (product.id && product.images && product.images.length > 0) ||
                              '请上传商品图片'
                      ]"
                      lazy-rules
                      style="max-width: 100%">
                      <template v-slot:prepend>
                        <q-icon name="add_photo_alternate" />
                      </template>
                    </q-file>
                  </div>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <template v-if="productImages.previews.length > 0">
                      <div v-for="(image, i) in productImages.previews" :key="i"
                        class="col-6">
                        <q-img :src="image" style="height: 120px" class="rounded-borders">
                          <div class="absolute-top-right q-pa-xs">
                            <q-btn round flat dense color="negative"
                              icon="delete" size="sm"
                              @click="removeProductImage(i)" />
                          </div>
                        </q-img>
                      </div>
                    </template>
                    <template v-else-if="product.images && product.images.length > 0">
                      <div v-for="(imageUrl, i) in product.images" :key="i"
                        class="col-6">
                        <q-img :src="imageUrl" style="height: 120px" class="rounded-borders">
                          <div class="absolute-bottom text-subtitle2 text-center bg-black bg-opacity-50 text-white q-pa-xs">
                            已保存图片
                          </div>
                        </q-img>
                      </div>
                    </template>
                  </div>
                </q-card-section>
              </q-card>

              <!-- 二维码上传卡片 -->
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1">扫码直达图片</div>
                  <div class="q-mt-sm">
                    <q-file filled v-model="qrCodeImages.files"
                      label="上传扫码图片" multiple accept=".jpg,.jpeg,.png"
                      :rules="[
                        val => (val && val.length > 0) ||
                              (product.id && product.qr_code_images && product.qr_code_images.length > 0) ||
                              '请上传扫码直达图片'
                      ]"
                      lazy-rules
                      style="max-width: 100%">
                      <template v-slot:prepend>
                        <q-icon name="qr_code" />
                      </template>
                    </q-file>
                  </div>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <template v-if="qrCodeImages.previews.length > 0">
                      <div v-for="(image, i) in qrCodeImages.previews" :key="i"
                        class="col-6">
                        <q-img :src="image" style="height: 120px" class="rounded-borders">
                          <div class="absolute-top-right q-pa-xs">
                            <q-btn round flat dense color="negative"
                              icon="delete" size="sm"
                              @click="removeQrCodeImage(i)" />
                          </div>
                        </q-img>
                      </div>
                    </template>
                    <template v-else-if="product.qr_code_images && product.qr_code_images.length > 0">
                      <div v-for="(imageUrl, i) in product.qr_code_images" :key="i"
                        class="col-6">
                        <q-img :src="imageUrl" style="height: 120px" class="rounded-borders">
                          <div class="absolute-bottom text-subtitle2 text-center bg-black bg-opacity-50 text-white q-pa-xs">
                            已保存图片
                          </div>
                        </q-img>
                      </div>
                    </template>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary q-pa-md">
          <q-btn flat label="取消" @click="onCancel" color="grey-7" />
          <q-btn unelevated label="保存" type="submit" color="primary" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { date } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  productData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

// 表单引用
const productForm = ref(null)

// 对话框状态
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 商品信息
const product = reactive(initProductForm())

// 图片上传状态
const productImages = reactive({
  files: [],
  previews: []
})

const qrCodeImages = reactive({
  files: [],
  previews: []
})

// 选项数据
const categoryOptions = [
  { label: '生活用品', value: 'daily' },
  { label: '个护美妆', value: 'beauty' },
  { label: '健康食品', value: 'food' },  // 修改为与数据库中一致的"food"
  { label: '电子数码', value: 'digital' },
  { label: '宠物用品', value: 'pet' }
]

const platformOptions = [
  { label: '京东', value: 'jd' },
  { label: '淘宝', value: 'taobao' },
  { label: '拼多多', value: 'pdd' }
]

// 初始化商品表单
function initProductForm() {
  return {
    id: null,
    title: '',
    description: '',
    category: '',
    platform: '',
    add_date: date.formatDate(new Date(), 'YYYY/MM/DD'),
    promotion_text: '',
    promotion_link: '',
    promotion_expire_date: date.formatDate(date.addToDate(new Date(), { days: 59 }), 'YYYY/MM/DD'),
    original_price: 0,
    final_price: 0,
    is_direct_sale: false,
    coupon_info: {
      condition: '',
      content: '',
      expire_date: '',
      link: ''
    },
    status: 'active',
    images: [],
    qr_code_images: []
  }
}

// 监听商品数据变化
watch(() => props.productData, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    Object.assign(product, newValue)
  } else {
    Object.assign(product, initProductForm())
  }
}, { deep: true, immediate: true })

// 监听商品图片变化
watch(() => productImages.files, (newFiles) => {
  productImages.previews = newFiles?.length ? Array.from(newFiles).map(file => URL.createObjectURL(file)) : []
}, { deep: true })

// 监听二维码图片变化
watch(() => qrCodeImages.files, (newFiles) => {
  qrCodeImages.previews = newFiles?.length ? Array.from(newFiles).map(file => URL.createObjectURL(file)) : []
}, { deep: true })

// 监听添加日期变化，自动计算失效日期
watch(() => product.add_date, (newDate) => {
  if (newDate) {
    try {
      const addDateObj = new Date(newDate.replace(/\//g, '-'))
      const expireDate = date.addToDate(addDateObj, { days: 59 })
      product.promotion_expire_date = date.formatDate(expireDate, 'YYYY/MM/DD')
    } catch (error) {
      console.error('日期计算错误:', error)
    }
  }
})

// 移除商品图片
function removeProductImage(index) {
  if (productImages.files && productImages.files.length > index) {
    // 创建新的文件列表(FileList是只读的，不能直接修改)
    const dt = new DataTransfer()
    Array.from(productImages.files).forEach((file, i) => {
      if (i !== index) dt.items.add(file)
    })
    productImages.files = dt.files
  }
}

// 移除二维码图片
function removeQrCodeImage(index) {
  if (qrCodeImages.files && qrCodeImages.files.length > index) {
    // 创建新的文件列表
    const dt = new DataTransfer()
    Array.from(qrCodeImages.files).forEach((file, i) => {
      if (i !== index) dt.items.add(file)
    })
    qrCodeImages.files = dt.files
  }
}

// 取消操作
function onCancel() {
  resetForm()
  emit('cancel')
}

// 提交表单
function handleSubmit() {
  // 创建 FormData 对象
  const formData = new FormData()

  // 准备商品数据
  const productData = { ...product }

  // 添加商品数据
  formData.append('productData', JSON.stringify(productData))

  // 添加商品图片
  if (productImages.files && productImages.files.length > 0) {
    productImages.files.forEach((file) => {
      formData.append('productImages', file)
    })
  }

  // 添加扫码直达图片
  if (qrCodeImages.files && qrCodeImages.files.length > 0) {
    qrCodeImages.files.forEach((file) => {
      formData.append('qrCodeImages', file)
    })
  }

  // 发送事件
  emit('save', {
    productId: product.id,
    formData
  })
}

// 重置表单
function resetForm() {
  // 释放预览图片URL
  productImages.previews.forEach(url => URL.revokeObjectURL(url))
  qrCodeImages.previews.forEach(url => URL.revokeObjectURL(url))

  // 重置图片
  productImages.files = []
  productImages.previews = []
  qrCodeImages.files = []
  qrCodeImages.previews = []

  // 重置表单数据
  Object.assign(product, initProductForm())

  // 关闭对话框
  emit('update:modelValue', false)
}
</script>
