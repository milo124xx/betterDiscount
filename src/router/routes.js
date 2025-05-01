const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue') 
      },
      { 
        path: 'search', 
        component: () => import('pages/SearchResults.vue') 
      },
      {
        path: 'admin',
        component: () => import('pages/AdminPage.vue'),
        beforeEnter: (to, from, next) => {
          // 这里可以添加更多的权限验证逻辑
          if (localStorage.getItem('isAdmin')) {
            next()
          } else {
            next('/')
          }
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
