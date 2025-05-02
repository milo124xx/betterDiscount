<template>
    <div class="logo-wrapper">
        <span class="text-primary text-h4 text-weight-bold site-name">BetterDeal</span>
        <span class="text-subtitle1 text-grey-7 site-tagline">超值优惠</span>
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

    // 移动端适配
    @media (max-width: 768px) {
        .site-name {
            font-size: 1.5rem !important; // 在移动端减小标题大小
        }

        .site-tagline {
            font-size: 0.8rem !important; // 在移动端减小副标题大小
        }
    }

    // 小屏幕进一步调整
    @media (max-width: 599px) {
        .site-name {
            font-size: 1.3rem !important;
        }

        .site-tagline {
            font-size: 0.7rem !important;
        }
    }
}
</style>
