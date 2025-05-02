import { createHead } from '@vueuse/head'

// 创建head实例
export default ({ app }) => {
  const head = createHead()
  app.use(head)
}
