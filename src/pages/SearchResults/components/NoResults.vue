<template>
  <div class="no-results q-pa-xl text-center">
    <q-icon name="search_off" size="48px" color="grey-5" />
    <p class="text-h6 text-grey-7 q-mt-md">未找到相关商品</p>
    <p class="text-body2 text-grey-6">请尝试使用其他关键词搜索</p>
    <q-btn color="primary" label="返回首页" @click="goHome" class="q-mt-md" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>
