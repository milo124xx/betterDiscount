/**
 * SEO工具函数，用于管理页面的元数据
 */

// 网站基本信息
const siteName = '优惠券和折扣平台'
const siteUrl = 'https://yulianclub.com'
const defaultImage = `${siteUrl}/images/logo.png`

/**
 * 生成SEO元数据
 * @param {Object} options - SEO配置选项
 * @param {string} options.title - 页面标题
 * @param {string} options.description - 页面描述
 * @param {string} options.keywords - 关键词，逗号分隔
 * @param {string} options.url - 页面URL，默认为当前路径
 * @param {string} options.image - 页面图片URL
 * @param {string} options.type - 页面类型（article、website等）
 * @returns {Object} 用于useHead的配置对象
 */
export function generateSeoMeta({
  title,
  description,
  keywords = '优惠券,折扣,促销,省钱,购物',
  url = '',
  image = defaultImage,
  type = 'website',
}) {
  // 确保标题包含网站名称
  const fullTitle = title.includes(siteName) ? title : `${title} - ${siteName}`

  // 构建完整URL
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`

  return {
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },

      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: fullUrl },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      // 其他SEO相关
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: siteName },
    ],
    link: [{ rel: 'canonical', href: fullUrl }],
  }
}

/**
 * 为文章页面生成特定的SEO元数据
 * @param {Object} article - 文章对象
 * @returns {Object} 用于useHead的配置对象
 */
export function generateArticleSeoMeta(article) {
  return generateSeoMeta({
    title: article.title,
    description: article.summary || article.title,
    keywords: `${article.tags || ''},文章,优惠资讯`,
    url: `/article/${article.id}`,
    image: article.coverImage || defaultImage,
    type: 'article',
  })
}

/**
 * 为产品优惠页面生成特定的SEO元数据
 * @param {Object} product - 产品对象
 * @returns {Object} 用于useHead的配置对象
 */
export function generateProductSeoMeta(product) {
  return generateSeoMeta({
    title: `${product.title} 优惠信息`,
    description: `${product.title}的最新优惠、折扣和促销信息。原价${product.originalPrice}，优惠价${product.discountPrice}，立省${product.savedAmount}。`,
    keywords: `${product.title},${product.category || ''},优惠,折扣,促销`,
    url: `/product-deals/${product.id}`,
    image: product.image || defaultImage,
    type: 'product',
  })
}

/**
 * 为分类页面生成特定的SEO元数据
 * @param {Object} category - 分类对象
 * @returns {Object} 用于useHead的配置对象
 */
export function generateCategorySeoMeta(category) {
  return generateSeoMeta({
    title: `${category.name} 优惠和折扣`,
    description: `在${category.name}分类中查找最新的优惠、折扣和促销信息，省钱省心。`,
    keywords: `${category.name},优惠,折扣,促销,${category.keywords || ''}`,
    url: `/category/${category.id}`,
    image: category.image || defaultImage,
  })
}
