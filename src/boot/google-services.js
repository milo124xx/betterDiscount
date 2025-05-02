// 使用简化的Google服务加载方法，基于推荐的实践
export default () => {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined') return

  // 记录当前域名，便于调试
  const currentDomain = window.location.hostname
  console.log('当前域名:', currentDomain)

  // 初始化状态变量
  window.gaLoaded = false
  window.adsenseLoaded = false

  // 使用Promise封装的脚本加载函数
  function loadScript(src, attributes = {}) {
    return new Promise((resolve, reject) => {
      // 检查脚本是否已加载
      const existingScript = document.querySelector(`script[src="${src}"]`)
      if (existingScript) {
        console.log(`脚本 ${src} 已存在，不再重复加载`)
        return resolve(existingScript)
      }

      const script = document.createElement('script')
      script.src = src
      script.async = true

      // 添加自定义属性
      Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value)
      })

      // 设置事件处理器
      script.onload = () => {
        console.log(`脚本 ${src} 加载成功`)
        resolve(script)
      }

      script.onerror = (error) => {
        console.error(`脚本 ${src} 加载失败:`, error)
        reject(error)
      }

      // 添加到文档
      document.head.appendChild(script)
    })
  }

  // 加载和初始化Google Analytics
  const loadGoogleAnalytics = async () => {
    try {
      // 初始化GA数据层
      window.dataLayer = window.dataLayer || []
      function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag = gtag

      // 加载GA脚本
      await loadScript('https://www.googletagmanager.com/gtag/js?id=G-YYNLZMV2DL')

      // 初始化GA
      gtag('js', new Date())
      gtag('config', 'G-YYNLZMV2DL')

      window.gaLoaded = true
      console.log('Google Analytics 加载完成')
    } catch (error) {
      console.warn('Google Analytics 加载失败，将使用退化方案', error)
      // 创建静默的gtag函数，确保网站继续工作
      if (!window.gtag) {
        window.gtag = function () {
          console.log('静默gtag调用:', Array.from(arguments))
        }
      }
    }
  }

  // 加载Google AdSense
  const loadGoogleAdSense = async () => {
    try {
      await loadScript(
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523',
        { crossorigin: 'anonymous' },
      )

      // 初始化AdSense数组
      window.adsbygoogle = window.adsbygoogle || []

      window.adsenseLoaded = true
      console.log('Google AdSense 加载完成')
    } catch (error) {
      console.warn('Google AdSense 加载失败，将使用退化方案', error)
      // 创建假的adsbygoogle对象，确保网站不会中断
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push = function (obj) {
        console.log('静默AdSense调用:', obj)
        return obj
      }
    }
  }

  // 处理Cloudflare错误
  const setupErrorHandling = () => {
    window.addEventListener(
      'error',
      function (e) {
        // 拦截Cloudflare相关错误
        if (
          e.filename &&
          (e.filename.includes('cloudflareinsights.com') ||
            e.filename.includes('cdn-cgi/speculation'))
        ) {
          console.log('已拦截Cloudflare错误:', e.filename)
          e.preventDefault()
          return true
        }
      },
      true,
    )
  }

  // 提供状态检查函数
  window.checkGoogleServices = function () {
    const status = {
      domain: currentDomain,
      analytics: window.gaLoaded ? '已加载' : '未加载',
      adsense: window.adsenseLoaded ? '已加载' : '未加载',
    }

    console.table(status)
    return status
  }

  // 主初始化函数
  const initialize = async () => {
    console.log('初始化Google服务加载器...')
    setupErrorHandling()

    // 按顺序加载服务
    await loadGoogleAnalytics()

    // 延迟加载AdSense以减少竞争
    setTimeout(() => {
      loadGoogleAdSense()
    }, 1000)

    // 5秒后检查服务状态
    setTimeout(() => {
      window.checkGoogleServices()
    }, 5000)
  }

  // 在页面加载完成后初始化
  if (document.readyState === 'complete') {
    initialize()
  } else {
    window.addEventListener('load', initialize)
  }
}
