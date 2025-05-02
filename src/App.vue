<template>
  <router-view />
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  // 默认的全局meta配置
  title: '优惠券和折扣平台 - 帮您省钱的最佳选择',
  meta: [
    { name: 'description', content: '发现最新的优惠券、折扣和促销信息，为您提供最佳的购物体验和省钱方案。' },
    { name: 'keywords', content: '优惠券,折扣,促销,省钱,购物' },
    { name: 'author', content: '优惠券平台' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://yulianclub.com' },
    { property: 'og:title', content: '优惠券和折扣平台 - 帮您省钱的最佳选择' },
    { property: 'og:description', content: '发现最新的优惠券、折扣和促销信息，为您提供最佳的购物体验和省钱方案。' },
    { property: 'og:image', content: 'https://yulianclub.com/images/logo.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '优惠券和折扣平台 - 帮您省钱的最佳选择' },
    { name: 'twitter:description', content: '发现最新的优惠券、折扣和促销信息，为您提供最佳的购物体验和省钱方案。' },
    { name: 'twitter:image', content: 'https://yulianclub.com/images/logo.png' },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: 'https://yulianclub.com' }
  ]
})
</script>
