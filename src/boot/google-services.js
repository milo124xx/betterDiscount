// Google服务加载器 - 使用降级方案，允许网站正常工作即使Google服务不可用
export default () => {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined') return

  // 初始化状态
  window.gaLoaded = false
  window.adsenseLoaded = false

  // 检测当前域名
  const currentDomain = window.location.hostname
  console.log('当前域名:', currentDomain)

  // 1. 创建本地事件跟踪方法 - 当Google Analytics无法加载时使用
  const createLocalAnalytics = () => {
    if (window.localAnalytics) return

    // 创建本地分析对象
    window.localAnalytics = {
      events: [],
      pageviews: [],

      // 记录事件
      trackEvent: (category, action, label, value) => {
        const event = {
          type: 'event',
          category,
          action,
          label,
          value,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          domain: currentDomain,
        }

        window.localAnalytics.events.push(event)
        console.log('本地事件跟踪:', event)

        // 当积累超过10个事件时，可以考虑将其发送到您自己的服务器
        return event
      },

      // 记录页面浏览
      trackPageview: (page) => {
        const pageview = {
          type: 'pageview',
          page: page || window.location.pathname,
          title: document.title,
          domain: currentDomain,
          timestamp: new Date().toISOString(),
        }

        window.localAnalytics.pageviews.push(pageview)
        console.log('本地页面浏览跟踪:', pageview)

        return pageview
      },
    }

    // 记录初始页面浏览
    window.localAnalytics.trackPageview()

    // 监听路由变化(针对SPA)
    window.addEventListener('popstate', () => {
      window.localAnalytics.trackPageview()
    })
  }

  // 2. 仅尝试一次加载Google服务，失败时直接使用本地方案
  const tryLoadGoogleServices = () => {
    console.log('尝试加载Google服务...')

    // 处理Cloudflare错误
    window.addEventListener(
      'error',
      function (e) {
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

    // 单次尝试加载Google Analytics
    try {
      const gaScript = document.createElement('script')
      gaScript.async = true
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-YYNLZMV2DL'

      // 设置超时处理
      const gaTimeout = setTimeout(() => {
        console.log('Google Analytics加载超时，启用本地分析')
        createLocalAnalytics()

        // 提供假的gtag函数
        window.dataLayer = window.dataLayer || []
        window.gtag = function () {
          // 转换为本地事件
          const args = Array.from(arguments)
          if (args[0] === 'event') {
            window.localAnalytics.trackEvent('gtag', args[1], JSON.stringify(args[2] || {}))
          } else if (args[0] === 'config') {
            console.log('本地记录config调用:', args)
          }
          window.dataLayer.push(arguments)
        }
      }, 3000)

      gaScript.onload = function () {
        clearTimeout(gaTimeout)
        window.gaLoaded = true
        console.log('Google Analytics 已成功加载')

        // 初始化GA
        window.dataLayer = window.dataLayer || []
        function gtag() {
          window.dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', 'G-YYNLZMV2DL', {
          send_page_view: true,
          cookie_domain: 'auto',
        })
      }

      gaScript.onerror = function () {
        clearTimeout(gaTimeout)
        console.log('Google Analytics 加载失败，启用本地分析')
        createLocalAnalytics()
      }

      document.head.appendChild(gaScript)
    } catch (e) {
      console.error('尝试加载Google Analytics时出错:', e)
      createLocalAnalytics()
    }

    // 单次尝试加载Google AdSense
    try {
      // AdSense加载检查
      const checkAdSenseLoaded = () => {
        return typeof window.adsbygoogle !== 'undefined'
      }

      if (checkAdSenseLoaded()) {
        window.adsenseLoaded = true
        console.log('AdSense已存在')
        return
      }

      const adScript = document.createElement('script')
      adScript.async = true
      adScript.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523'
      adScript.crossOrigin = 'anonymous'

      const adTimeout = setTimeout(() => {
        console.log('AdSense加载超时，使用占位符替代')
        window.adsenseLoaded = false

        // 创建假的adsbygoogle对象以防止报错
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push = function (obj) {
          console.log('AdSense替代方案: 收到广告请求', obj)
          return true
        }
      }, 3000)

      adScript.onload = function () {
        clearTimeout(adTimeout)
        window.adsenseLoaded = true
        console.log('AdSense 已成功加载')
      }

      adScript.onerror = function () {
        clearTimeout(adTimeout)
        console.log('AdSense 加载失败，使用占位符替代')
        window.adsenseLoaded = false
      }

      document.head.appendChild(adScript)
    } catch (e) {
      console.error('尝试加载AdSense时出错:', e)
    }
  }

  // 添加检查函数 - 可在控制台使用
  window.checkGoogleServices = function () {
    console.log('当前域名:', currentDomain)
    console.log('Google Analytics 状态:', window.gaLoaded ? '已加载' : '未加载')
    console.log('Google AdSense 状态:', window.adsenseLoaded ? '已加载' : '未加载')
    console.log('本地分析状态:', window.localAnalytics ? '已启用' : '未启用')

    if (window.localAnalytics) {
      console.log('本地事件数:', window.localAnalytics.events.length)
      console.log('本地页面浏览数:', window.localAnalytics.pageviews.length)
    }

    return {
      domain: currentDomain,
      analytics: window.gaLoaded || (window.localAnalytics ? '本地' : false),
      adsense: window.adsenseLoaded,
    }
  }

  // 初始化
  if (document.readyState === 'complete') {
    tryLoadGoogleServices()
    // 10秒后检查服务状态
    setTimeout(() => window.checkGoogleServices(), 10000)
  } else {
    window.addEventListener('load', () => {
      tryLoadGoogleServices()
      // 10秒后检查服务状态
      setTimeout(() => window.checkGoogleServices(), 10000)
    })
  }

  // 添加调试日志
  console.log('这是浏览器日志，Google服务加载模块已初始化')
}
