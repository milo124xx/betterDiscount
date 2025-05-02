// Google服务加载器 - 负责在客户端运行时加载Google Analytics和Google AdSense
export default () => {
  // 确保只在浏览器环境中执行
  if (typeof window === 'undefined') return

  // 初始化状态
  window.gaLoaded = false
  window.adsenseLoaded = false

  // 配置 Google Analytics
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-YYNLZMV2DL')

  // 加载 Google Analytics
  const loadGoogleAnalytics = () => {
    try {
      // 检查是否已经加载过
      if (
        window.gaLoaded ||
        document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
      ) {
        window.gaLoaded = true
        console.log('Google Analytics 已经存在，不再重复加载')
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YYNLZMV2DL'
      script.onload = function () {
        window.gaLoaded = true
        console.log('Google Analytics 已成功加载')
      }
      script.onerror = function (e) {
        console.error('Google Analytics 加载失败:', e)
        // 最多尝试3次，每次间隔5秒
        if (!window.gaRetryCount) window.gaRetryCount = 0
        if (window.gaRetryCount < 3) {
          window.gaRetryCount++
          console.log(`尝试重新加载 Google Analytics (${window.gaRetryCount}/3)...`)
          setTimeout(loadGoogleAnalytics, 5000)
        } else {
          console.log('多次尝试加载 Google Analytics 失败，放弃加载')
        }
      }
      document.head.appendChild(script)
    } catch (e) {
      console.error('加载 Google Analytics 时出错:', e)
    }
  }

  // 加载 Google AdSense
  const loadGoogleAdsense = () => {
    try {
      // 检查是否已经加载过
      if (
        window.adsenseLoaded ||
        document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js"]')
      ) {
        window.adsenseLoaded = true
        console.log('Google AdSense 已经存在，不再重复加载')
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523'
      script.crossOrigin = 'anonymous'
      script.onload = function () {
        window.adsenseLoaded = true
        console.log('Google AdSense 已成功加载')
      }
      script.onerror = function (e) {
        console.error('Google AdSense 加载失败:', e)
        // 最多尝试3次，每次间隔5秒
        if (!window.adsenseRetryCount) window.adsenseRetryCount = 0
        if (window.adsenseRetryCount < 3) {
          window.adsenseRetryCount++
          console.log(`尝试重新加载 Google AdSense (${window.adsenseRetryCount}/3)...`)
          setTimeout(loadGoogleAdsense, 5000)
        } else {
          console.log('多次尝试加载 Google AdSense 失败，放弃加载')
        }
      }
      document.head.appendChild(script)
    } catch (e) {
      console.error('加载 Google AdSense 时出错:', e)
    }
  }

  // 添加检查函数 - 可在控制台使用
  window.checkGoogleServices = function () {
    console.log('Google Analytics 状态:', window.gaLoaded ? '已加载' : '未加载')
    console.log('Google AdSense 状态:', window.adsenseLoaded ? '已加载' : '未加载')
    return {
      analytics: window.gaLoaded,
      adsense: window.adsenseLoaded,
    }
  }

  // 文档加载完成后加载脚本
  if (document.readyState === 'complete') {
    loadGoogleAnalytics()
    loadGoogleAdsense()
    // 3秒后检查服务状态
    setTimeout(() => window.checkGoogleServices(), 3000)
  } else {
    window.addEventListener('load', () => {
      loadGoogleAnalytics()
      loadGoogleAdsense()
      // 3秒后检查服务状态
      setTimeout(() => window.checkGoogleServices(), 3000)
    })
  }
}