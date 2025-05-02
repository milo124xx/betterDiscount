// vue-gtag 集成 - 使用 vue-gtag v3.4.0 的正确 API
import * as VueGtag from 'vue-gtag'

export default ({ app, router }) => {
  // 添加路由变化监听器
  let isFirstLoad = true
  
  // 首先安装插件
  app.use(VueGtag, {
    // 基本配置
    config: {
      id: 'G-YYNLZMV2DL',
      params: {
        send_page_view: false // 禁用自动页面浏览跟踪
      }
    },
    // 仅在生产环境中启用
    enabled: process.env.NODE_ENV === 'production'
  })

  // 手动处理路由变化以避免初始化问题
  router.afterEach((to) => {
    // 在生产环境中初始化 gtag
    if (process.env.NODE_ENV === 'production') {
      // 在首次加载后延迟跟踪，避免初始化问题
      if (isFirstLoad) {
        isFirstLoad = false
        // 延迟首次跟踪，确保 gtag 已初始化
        setTimeout(() => {
          VueGtag.pageview(to.fullPath, to.name)
        }, 100)
      } else {
        // 后续页面更改正常跟踪
        VueGtag.pageview(to.fullPath, to.name)
      }
    }
  })
}
