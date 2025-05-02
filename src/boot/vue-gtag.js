// vue-gtag 集成
import { createGtag } from 'vue-gtag'

// 按照官方文档使用正确的集成方式
export default ({ app, router }) => {
  // 使用标准配置
  const gtag = createGtag({
    property: {
      id: 'G-YYNLZMV2DL'
    },
    isEnabled: process.env.NODE_ENV === 'production',
    disableInDev: true
  })
  
  // 安装插件并传递路由器
  app.use(gtag, router)
}
