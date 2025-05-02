// vue-gtag 集成 - 与预初始化的GA进行集成
// 注意：Google Analytics 已在 index.html 中预先初始化

// 使用命名空间导入
import * as VueGtag from 'vue-gtag'

export default ({ app, router }) => {
  // 使用已经在 index.html 中初始化的gtag
  app.use(VueGtag, {
    property: {
      id: 'G-YYNLZMV2DL'
    },
    useExistingGtag: true,    // 使用现有的gtag实例
    isEnabled: process.env.NODE_ENV === 'production',
    disableInDev: true
  })

  // 监听路由变化，手动跟踪页面浏览
  router.afterEach((to) => {
    // 仅在生产环境中跟踪
    if (process.env.NODE_ENV === 'production') {
      // 使用全局 gtag 函数
      window.gtag && window.gtag('event', 'page_view', {
        page_title: to.meta.title || document.title,
        page_path: to.fullPath,
        page_location: window.location.href
      })
    }
  })
}
