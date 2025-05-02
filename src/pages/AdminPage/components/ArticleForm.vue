<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card>
      <q-bar>
        <div class="text-h6">{{ article.id ? '编辑文章' : '添加文章' }}</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup @click="onCancel">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md scroll" style="max-height: calc(100vh - 120px)">
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <!-- 文章标题 -->
          <q-input
            v-model="article.title"
            label="文章标题 *"
            :rules="[val => !!val || '请输入文章标题']"
            lazy-rules
            outlined
          />

          <!-- 文章分类 -->
          <q-select
            v-model="article.category"
            :options="categoryOptions"
            label="文章分类 *"
            :rules="[val => !!val || '请选择文章分类']"
            outlined
            lazy-rules
            map-options
            emit-value
          />

          <!-- 封面图片上传 -->
          <div class="cover-upload q-mb-md">
            <div class="text-subtitle2 q-mb-sm">封面图片 *</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-file
                  v-model="coverImageFile"
                  accept="image/*"
                  label="上传封面图片"
                  outlined
                  :rules="[() => article.id && article.image || coverImageFile || '请上传封面图片']"
                  @update:model-value="handleCoverImageChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                  <template v-slot:append v-if="coverImageFile">
                    <q-icon name="close" @click.stop="clearCoverImage" class="cursor-pointer" />
                  </template>
                </q-file>
                <div class="text-caption text-grey-7 q-mt-xs">
                  建议尺寸: 1200x630 像素, 格式: JPG, PNG
                </div>

                <!-- 仅在编辑模式且有图片URL时显示 -->
                <div v-if="article.id && article.image" class="q-mt-sm">
                  <div class="text-caption text-grey-8">当前图片链接:</div>
                  <div class="text-caption text-primary" style="word-break: break-all;">{{ article.image }}</div>
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="open_in_new"
                    class="q-mt-xs q-pa-none"
                    label="在新窗口打开图片"
                    @click="openImageInNewTab(article.image)"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6 flex flex-center">
                <!-- 新文件预览 -->
                <div v-if="coverImageFile && coverImagePreview" class="cover-preview">
                  <img
                    :src="coverImagePreview"
                    style="max-width: 100%; max-height: 180px; object-fit: contain;"
                    alt="封面预览"
                  />
                </div>
                <!-- 已有图片预览 (仅在编辑模式) -->
                <div v-else-if="article.id && article.image" class="cover-preview flex flex-center">
                  <div class="text-center">
                    <q-icon name="image" size="42px" color="primary" />
                    <div class="text-subtitle2 q-mt-sm">已有封面图片</div>
                    <div class="text-caption">（由于技术原因无法直接预览）</div>
                  </div>
                </div>
                <!-- 空状态 -->
                <div v-else class="cover-placeholder flex flex-center">
                  <q-icon name="image" size="42px" color="grey-6" />
                  <div class="text-grey-7 q-mt-sm">预览区域</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 文章摘要 -->
          <q-input
            v-model="article.description"
            label="文章摘要 *"
            type="textarea"
            rows="3"
            :rules="[val => !!val || '请输入文章摘要']"
            hint="简短描述文章内容，将显示在文章列表中"
            lazy-rules
            outlined
          />

          <!-- 文章内容 (富文本编辑器) -->
          <div class="editor-container">
            <div class="text-subtitle2 q-mb-sm">文章内容 *</div>
            <q-editor
              v-model="article.content"
              min-height="300px"
              :dense="$q.screen.lt.md"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
                  },
                  'removeFormat'
                ],
                ['bold', 'italic', 'underline', 'strike'],
                ['link', 'unordered', 'ordered'],
                ['undo', 'redo', 'fullscreen'],
                [
                  {
                    label: '插入图片',
                    icon: 'image',
                    handler: showImageUploadDialog
                  }
                ]
              ]"
              :rules="[val => !!val && val !== '<p></p>' || '请输入文章内容']"
            />
            <div v-if="contentError" class="text-negative q-mt-sm">请输入文章内容</div>
          </div>

          <!-- 图片上传对话框 -->
          <q-dialog v-model="imageUploadDialog">
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">上传图片</div>
              </q-card-section>

              <q-card-section>
                <q-file
                  v-model="contentImageFile"
                  accept="image/*"
                  label="选择图片"
                  outlined
                  @update:model-value="handleContentImageChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <div v-if="contentImagePreview" class="content-image-preview q-mt-md">
                  <q-img :src="contentImagePreview" />
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="取消" color="grey" v-close-popup />
                <q-btn flat label="插入" color="primary" @click="insertContentImage" :disable="!contentImageFile" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="取消" color="grey" @click="onCancel" />
        <q-btn
          label="保存"
          color="primary"
          @click="validateAndSubmit"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed, watch, ref } from 'vue'
import { date, useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  articleData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])
const $q = useQuasar()

// 对话框状态
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 文章分类选项
const categoryOptions = [
  { label: '每周优惠榜单', value: '每周优惠榜单' },
  { label: '每月优惠榜单', value: '每月优惠榜单' },
  { label: '生活用品', value: '生活用品' },
  { label: '个护美妆', value: '个护美妆' },
  { label: '健康食品', value: '健康食品' },
  { label: '电子数码', value: '电子数码' },
  { label: '宠物用品', value: '宠物用品' }
]

// 文章信息
const article = reactive(initArticleForm())
const contentError = ref(false)

// 封面图片上传
const coverImageFile = ref(null)
const coverImagePreview = ref(null)

// 内容图片上传
const contentImageFile = ref(null)
const contentImagePreview = ref(null)
const imageUploadDialog = ref(false)

// 初始化文章表单
function initArticleForm() {
  return {
    id: null,
    title: '',
    description: '',
    content: '',
    image: '',
    category: '',
    publish_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
    views: 0,
    status: 'published'
  }
}

// 添加调试函数，显示图片的加载状态
function debugImage(url) {
  if (!url) return

  console.log('尝试加载图片:', url)

  // 创建一个新的Image对象来测试图片是否可加载
  const testImage = new Image()
  testImage.onload = () => console.log('图片加载成功:', url)
  testImage.onerror = () => console.error('图片加载失败:', url)
  testImage.src = url
}

// 监听文章数据变化
watch(() => props.articleData, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    // 重置封面图片预览
    if (coverImagePreview.value && coverImagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview.value)
    }
    coverImageFile.value = null
    coverImagePreview.value = null

    // 复制文章数据
    Object.assign(article, newValue)

    // 添加时间戳防止缓存
    if (article.image) {
      // 测试图片URL是否可访问
      debugImage(article.image)

      // 添加时间戳避免缓存问题
      if (!article.image.includes('?')) {
        article.image = `${article.image}?t=${Date.now()}`
      }
    }
  } else {
    Object.assign(article, initArticleForm())
  }
}, { deep: true, immediate: true })

// 处理封面图片变更
function handleCoverImageChange(file) {
  if (!file) {
    coverImagePreview.value = null
    return
  }

  // 使用 URL.createObjectURL 创建本地临时URL，这比 FileReader 更可靠
  coverImagePreview.value = URL.createObjectURL(file)

  console.log('图片预览URL:', coverImagePreview.value)
}

// 清除封面图片
function clearCoverImage() {
  if (coverImagePreview.value && coverImagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(coverImagePreview.value)
  }
  coverImageFile.value = null
  coverImagePreview.value = null

  // 如果是编辑模式，还需要清除文章中的图片路径
  if (article.id) {
    article.image = ''
  }
}

// 显示图片上传对话框
function showImageUploadDialog() {
  contentImageFile.value = null
  contentImagePreview.value = null
  imageUploadDialog.value = true
}

// 处理内容图片变更
function handleContentImageChange(file) {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    contentImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 将图片插入富文本编辑器
function insertContentImage() {
  if (!contentImageFile.value) return

  // 这里仅是预览，实际上传会在表单提交时处理
  // 为了简化，我们先使用本地预览URL
  const imgTag = `<img src="${contentImagePreview.value}" alt="文章图片" style="max-width: 100%;">`

  // 将图片标签插入到编辑器当前位置
  const editor = document.querySelector('.q-editor')
  const selection = window.getSelection()

  if (editor && selection) {
    // 创建一个新的p标签，包含图片
    const imgContainer = document.createElement('div')
    imgContainer.innerHTML = imgTag
    imgContainer.className = 'q-my-md'

    // 获取编辑器的内容区域
    const contentDiv = editor.querySelector('.q-editor__content')
    if (contentDiv) {
      // 找到光标位置或默认添加到末尾
      const range = selection.getRangeAt(0)
      if (range.commonAncestorContainer.closest('.q-editor__content') === contentDiv) {
        range.deleteContents()
        range.insertNode(imgContainer)
      } else {
        contentDiv.appendChild(imgContainer)
      }

      // 更新编辑器内容
      article.content = contentDiv.innerHTML
    }
  }

  // 重置图片上传状态
  contentImageFile.value = null
  contentImagePreview.value = null
}

// 验证并提交表单
function validateAndSubmit() {
  contentError.value = !article.content || article.content === '<p></p>'

  if (!article.title || !article.category || !article.description || contentError.value) {
    $q.notify({
      type: 'negative',
      message: '请填写所有必填字段'
    })
    return
  }

  if (!article.id && !coverImageFile.value && !article.image) {
    $q.notify({
      type: 'negative',
      message: '请上传封面图片'
    })
    return
  }

  handleSubmit()
}

// 取消操作
function onCancel() {
  resetForm()
  emit('cancel')
}

// 提交表单
function handleSubmit() {
  // 创建 FormData 对象用于文件上传
  const formData = new FormData()

  // 添加文章数据（不包含文件）
  const articleData = { ...article }
  formData.append('articleData', JSON.stringify(articleData))

  // 添加封面图片
  if (coverImageFile.value) {
    formData.append('coverImage', coverImageFile.value)
  }

  // 添加文章内容中的图片（实际上传时需要处理）
  // 注意：这里仅准备了数据，实际提交和处理内容图片需要在后端进行
  // 复杂的内容图片处理可能需要额外逻辑

  emit('save', {
    articleId: article.id,
    formData
  })
}

// 重置表单
function resetForm() {
  // 重置表单数据
  Object.assign(article, initArticleForm())
  coverImageFile.value = null
  coverImagePreview.value = null
  contentImageFile.value = null
  contentImagePreview.value = null
  contentError.value = false

  // 关闭对话框
  emit('update:modelValue', false)
}

// 在新窗口打开图片
function openImageInNewTab(url) {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style lang="scss" scoped>
.cover-preview, .cover-placeholder {
  min-height: 150px;
  border-radius: 8px;
  border: 1px dashed #ddd;
  overflow: hidden;
}

.cover-placeholder {
  flex-direction: column;
  background-color: #f5f5f5;
}

.content-image-preview {
  max-width: 100%;
  max-height: 300px;
  overflow: hidden;

}

.editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background-color: #fff;
}

.q-editor {
  border: 1px solid #ddd;
}
</style>
