// Google服务加载器 - 负责在客户端运行时加载Google Analytics和Google AdSense
export default () => {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined') return

  // 初始化状态
  window.gaLoaded = false
  window.adsenseLoaded = false

  // 网站域名配置 - 方便在不同环境下匹配正确的策略
  const domains = {
    workers: 'betterdeal-worker1.wenmoon124.workers.dev',
    pages: 'betterdiscount.pages.dev',
    custom: 'yulianclub.com',
  }

  // 检测当前域名
  const currentDomain = window.location.hostname
  console.log('当前域名:', currentDomain)

  // Google服务备用域名配置
  const gaUrls = [
    'https://www.googletagmanager.com/gtag/js?id=G-YYNLZMV2DL',
    'https://googletagmanager.com/gtag/js?id=G-YYNLZMV2DL',
  ]

  const adsenseUrls = [
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523',
    'https://pagead.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523',
  ]

  // 配置 Google Analytics - 添加自定义维度以标识域名
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())

  // 为不同域名配置不同的跟踪参数
  const gtagConfig = {
    send_page_view: true,
    cookie_domain: 'auto',
    custom_map: {
      dimension1: 'domain_name',
    },
  }

  // 发送GA事件时添加当前域名信息
  gtag('config', 'G-YYNLZMV2DL', gtagConfig)
  gtag('event', 'domain_load', {
    domain_name: currentDomain,
  })

  // 辅助函数：检测脚本是否已加载
  const isScriptLoaded = (pattern) => {
    const scripts = document.getElementsByTagName('script')
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.match(pattern)) {
        return true
      }
    }
    return false
  }

  // 辅助函数：处理Cloudflare的特殊情况
  const isCloudflareEnvironment = () => {
    return currentDomain.includes('pages.dev') || currentDomain === domains.custom
  }

  // 通用脚本加载函数
  const loadScript = (
    urls,
    urlIndex,
    onSuccess,
    onError,
    retryCount = 0,
    maxRetries = 5,
    retryDelay = 3000,
  ) => {
    // 检查是否已加载或已超过最大重试次数
    if (urlIndex >= urls.length) {
      console.error('所有URL尝试失败，放弃加载')
      return
    }

    const currentUrl = urls[urlIndex]
    console.log(`尝试加载脚本: ${currentUrl}`)

    const script = document.createElement('script')
    script.async = true
    script.src = currentUrl
    script.crossOrigin = 'anonymous'

    // Cloudflare环境特殊处理
    if (isCloudflareEnvironment()) {
      script.setAttribute('data-cf-settings', 'no-cache')
      script.setAttribute('importance', 'high')
    }

    // 成功回调
    script.onload = () => {
      console.log(`脚本加载成功: ${currentUrl}`)
      onSuccess()
    }

    // 错误回调
    script.onerror = (e) => {
      console.error(`脚本加载失败 (${retryCount + 1}/${maxRetries}): ${currentUrl}`, e)

      // Cloudflare环境中添加更长的延迟
      const cfDelay = isCloudflareEnvironment() ? 2000 : 0

      // 尝试下一个URL或重试当前URL
      if (retryCount < maxRetries - 1) {
        setTimeout(() => {
          loadScript(urls, urlIndex, onSuccess, onError, retryCount + 1, maxRetries, retryDelay)
        }, retryDelay + cfDelay)
      } else {
        // 尝试下一个备用URL
        setTimeout(() => {
          loadScript(urls, urlIndex + 1, onSuccess, onError, 0, maxRetries, retryDelay)
        }, retryDelay + cfDelay)
      }
    }

    document.head.appendChild(script)
  }

  // 加载 Google Analytics
  const loadGoogleAnalytics = () => {
    try {
      // 检查是否已经加载过
      if (window.gaLoaded || isScriptLoaded('googletagmanager')) {
        window.gaLoaded = true
        console.log('Google Analytics 已经存在，不再重复加载')
        return
      }

      loadScript(
        gaUrls,
        0,
        () => {
          window.gaLoaded = true
          console.log('Google Analytics 已成功加载')

          // 加载完成后发送一个页面浏览事件
          gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            domain_name: currentDomain,
          })
        },
        () => {
          console.log('所有Google Analytics加载尝试失败')
        },
      )
    } catch (e) {
      console.error('加载 Google Analytics 时出错:', e)
    }
  }

  // 加载 Google AdSense
  const loadGoogleAdsense = () => {
    try {
      // 检查是否已经加载过
      if (window.adsenseLoaded || isScriptLoaded('adsbygoogle')) {
        window.adsenseLoaded = true
        console.log('Google AdSense 已经存在，不再重复加载')
        return
      }

      loadScript(
        adsenseUrls,
        0,
        () => {
          window.adsenseLoaded = true
          console.log('Google AdSense 已成功加载')
          // 初始化AdSense
          try {
            // 全局定义adsbygoogle
            window.adsbygoogle = window.adsbygoogle || []
            window.adsbygoogle.push({})
            console.log('AdSense初始化完成')
          } catch (e) {
            console.error('初始化AdSense失败:', e)
          }
        },
        () => {
          console.log('所有Google AdSense加载尝试失败')
        },
      )
    } catch (e) {
      console.error('加载 Google AdSense 时出错:', e)
    }
  }

  // 修复Cloudflare的Speculation和Insights错误
  const fixCloudflareIssues = () => {
    if (!isCloudflareEnvironment()) return

    try {
      // 创建一个空的DOM事件监听器，拦截可能出现的错误
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

      console.log('Cloudflare错误修复已应用')
    } catch (e) {
      console.error('应用Cloudflare修复时出错:', e)
    }
  }

  // 添加检查函数 - 可在控制台使用
  window.checkGoogleServices = function () {
    console.log('当前域名:', currentDomain)
    console.log('Google Analytics 状态:', window.gaLoaded ? '已加载' : '未加载')
    console.log('Google AdSense 状态:', window.adsenseLoaded ? '已加载' : '未加载')
    return {
      domain: currentDomain,
      analytics: window.gaLoaded,
      adsense: window.adsenseLoaded,
    }
  }

  // 文档加载完成后加载脚本
  const initializeServices = () => {
    // 先应用Cloudflare修复
    fixCloudflareIssues()

    // 设置延迟以确保网页已完全加载
    setTimeout(() => {
      loadGoogleAnalytics()
      // 错开加载时间，提高成功率
      setTimeout(loadGoogleAdsense, 2000)

      // 10秒后检查服务状态
      setTimeout(() => window.checkGoogleServices(), 10000)
    }, 1000)
  }

  if (document.readyState === 'complete') {
    initializeServices()
  } else {
    window.addEventListener('load', initializeServices)
  }
}
