export const APP =   {
  component: () => import('../views/app/AppRouter.vue'),
  path: "/",
  children: [
    {
      path: '',
      name: 'milestones',
      component: () => import('../views/app/milestones/MilestonesView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'list/:id',
      name: 'list_view',
      component: () => import('../views/app/list/ListView.vue'),
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: 'milestone',
      name: 'milestone',
      children: [
        {
          path: '',
          name: 'milestone_show',
          component: () => import('../views/app/milestones/ShowMilestone.vue'),
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'create',
          name: 'create_milestone',
          component: () => import('../views/app/milestones/CreateMilestoneView.vue'),
          meta: {
            requiresAuth: true
          },
        }
      ]
    }
  ]
}