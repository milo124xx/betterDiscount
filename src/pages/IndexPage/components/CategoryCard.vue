<template>
  <q-card class="card-component category-card" flat @click="navigateToCategory">
    <div class="card-content q-pa-md text-center">
      <div class="icon-container">
        <q-icon :name="category.icon" :class="`text-${category.color}`" />
      </div>
      <div class="card-title">{{ category.title }}</div>
      <div class="card-description">{{ category.description }}</div>
    </div>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'CategoryCardComponent'
})

const router = useRouter()

const props = defineProps({
  category: {
    type: Object,
    required: true,
    validator: (category) => {
      return (
        category.id &&
        category.title &&
        category.description &&
        category.icon &&
        category.color
      )
    }
  }
})

// 导航到分类页面
function navigateToCategory() {
  router.push(`/category/${props.category.id}`)
}
</script>

<style lang="scss" scoped>
.category-card {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--q-primary) 0%, var(--q-secondary) 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease-out;
    opacity: 0.8;
  }

  &:hover {
    &::after {
      transform: scaleX(1);
    }

    .icon-container {
      .q-icon {
        transform: scale(1.15);
      }
    }

    .card-title {
      color: var(--q-primary);
    }
  }

  .icon-container {
    margin-bottom: 16px;

    .q-icon {
      font-size: 52px;
      transition: all 0.4s ease;
    }
  }

  .card-title {
    font-weight: 600;
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }

  // 移动端适配 - 平板尺寸
  @media (max-width: 1023px) {
    .icon-container {
      margin-bottom: 12px;

      .q-icon {
        font-size: 42px;
      }
    }

    .card-title {
      margin-bottom: 6px;
      font-size: 0.95rem;
    }

    .card-description {
      font-size: 0.8rem;
    }

    .card-content {
      padding: 16px 12px !important;
    }
  }

  // 移动端适配 - 手机尺寸
  @media (max-width: 599px) {
    .icon-container {
      margin-bottom: 8px;

      .q-icon {
        font-size: 36px;
      }
    }

    .card-title {
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .card-description {
      font-size: 0.75rem;
      line-height: 1.3;
    }

    .card-content {
      padding: 12px 8px !important;
    }
  }
}
</style>
