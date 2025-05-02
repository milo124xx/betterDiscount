const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage/index.vue')
      },
      {
        path: 'search',
        component: () => import('pages/SearchResults/index.vue')
      },
      {
        path: 'category/:id',
        component: () => import('pages/CategoryPage/index.vue')
      },
      {
        path: 'admin',
        component: () => import('pages/AdminPage/index.vue'),
        beforeEnter: (to, from, next) => {
          // 这里可以添加更多的权限验证逻辑
          if (localStorage.getItem('isAdmin')) {
            next()
          } else {
            next('/')
          }
        }
      },
      {
        path: 'product-deals/:id',
        component: () => import('pages/ProductDeals/index.vue')
      },
      {
        path: 'article/:id',
        component: () => import('pages/ArticleDetail/index.vue')
      },
      {
        path: 'today-deals',
        component: () => import('pages/TodayDeals/index.vue')
      },
      {
        path: 'articles',
        component: () => import('pages/ArticlesList/index.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound/index.vue')
  }
]

export default routes
