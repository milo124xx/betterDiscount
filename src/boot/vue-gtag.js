// vue-gtag 集成, 用于 Google Analytics
import * as VueGtag from 'vue-gtag'

export default ({ app, router }) => {
  // 简化配置，避免初始化问题
  app.use(VueGtag, {
    property: {
      id: 'G-YYNLZMV2DL', // 您的 Google Analytics 测量 ID
    },
    isEnabled: process.env.NODE_ENV === 'production',
    router,
    enabledInDev: false,
  })
}
