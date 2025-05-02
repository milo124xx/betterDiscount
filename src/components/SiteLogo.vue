<template>
    <div class="logo-wrapper">
        <span class="text-primary text-h4 text-weight-bold">BetterDeal</span>
        <span class="text-subtitle1 text-grey-7">超值优惠</span>
    </div>
</template>

<script setup>
// 添加组件名称以避免ESLint错误
defineOptions({
  name: 'SiteLogoComponent'
})
</script>

<style lang="scss" scoped>
.logo-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
}
</style>
