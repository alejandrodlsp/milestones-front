export const AUTH =   {
  component: () => import('../views/auth/AuthRouter.vue'),
  path: "/auth",
  children: [
    {
      path: '',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        redirectIfAuthorized: true
      }
    },
    {
      path: 'register',
      name:'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: {
        redirectIfAuthorized: true
      }
    }
  ]
}