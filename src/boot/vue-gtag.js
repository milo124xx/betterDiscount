// vue-gtag 集成, 用于 Google Analytics
import { createGtag } from 'vue-gtag'

export default ({ app, router }) => {
  // 配置 vue-gtag
  const gtag = createGtag({
    config: {
      id: 'G-YYNLZMV2DL', // 您的 Google Analytics 测量 ID
      params: {
        anonymize_ip: true, // 匿名化 IP (GDPR 合规)
      },
    },
    bootstrap: true,
    enabled: process.env.NODE_ENV === 'production',
  })

  // 安装插件
  app.use(gtag, { router })
}
