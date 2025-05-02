<template>
    <footer class="footer-section">
        <div class="container">
            <div class="disclaimer text-caption text-grey-7">
                免责声明：本网站仅提供商品优惠信息导航服务，不直接进行商品销售。所有交易均在相应的电商平台完成，商品的交易过程、售后服务等均由商品销售方负责。本站不对任何商品的真实性、质量和交易结果负责。请您在购买前认真了解商品信息，谨慎交易。
            </div>
        </div>
    </footer>
</template>

<script setup>
// 添加组件名称以避免ESLint错误
defineOptions({
  name: 'AppFooterComponent'
})
</script>

<style lang="scss" scoped>
.footer-section {
    background: #f5f5f5;
    padding: 20px 0;
    margin-top: 20px;

    .disclaimer {
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
    }
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}
</style>
