import { createHead } from '@unhead/vue'

// 创建head实例
export default ({ app }) => {
  const head = createHead()
  app.use(head)
}
