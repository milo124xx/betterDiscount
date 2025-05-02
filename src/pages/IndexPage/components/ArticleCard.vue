<template>
  <q-card class="article-card" clickable v-ripple @click="navigateToArticle">
    <!-- 文章图片 -->
    <q-img
      :src="article.image"
      class="article-image"
      :ratio="16/9"
      no-spinner
    >
      <template v-slot:loading>
        <q-skeleton type="rect" height="180px" class="full-width" />
      </template>
      <template v-slot:error>
        <div class="image-error">
          <q-icon name="image_not_supported" size="32px" color="grey-6" />
          <div class="text-caption q-mt-sm">图片加载失败</div>
        </div>
      </template>
      <div class="article-category">{{ article.category }}</div>
    </q-img>

    <div class="article-content q-pa-md">
      <!-- 文章标题 -->
      <h3 class="article-title q-mt-none q-mb-sm">{{ article.title }}</h3>

      <!-- 文章描述 -->
      <p class="article-description q-mb-md">{{ article.description }}</p>

      <!-- 文章底部信息 -->
      <div class="article-footer">
        <div class="article-date">
          <q-icon name="event" size="16px" class="q-mr-xs" />
          {{ formatDate(article.publish_date || article.date) }}
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  article: {
    type: Object,
    required: true,
    validator: (article) => {
      return (
        article.id &&
        article.title &&
        article.description
      )
    }
  }
})

// 导航到文章详情页
function navigateToArticle() {
  router.push(`/article/${props.article.id}`)
}

// 日期格式化函数
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // 如果日期无效，返回原始字符串

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return dateString;
  }
}
</script>

<style lang="scss" scoped>
.article-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;

  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);

    .article-image {
      transform: scale(1.05);
    }
  }

  .article-image {
    transition: transform 0.4s ease;
  }

  .image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 180px;
    background-color: #f5f5f5;
    color: #9e9e9e;
  }

  .article-category {
    position: absolute;
    bottom: 0;
    left: 0;
    background: linear-gradient(135deg, #2c5ae9, #5581f1);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-top-right-radius: 8px;
    z-index: 2;
  }

  .article-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .article-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    color: #2c3e50;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-description {
    color: #546e7a;
    font-size: 14px;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .article-footer {
    display: flex;
    justify-content: space-between;
    color: #78909c;
    font-size: 13px;

    .article-date, .article-views {
      display: flex;
      align-items: center;
    }
  }
}
</style>
