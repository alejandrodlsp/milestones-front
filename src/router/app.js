export const APP =   {
  component: () => import('../views/app/AppRouter.vue'),
  path: "/",
  children: [
    {
      path: '',
      name: 'milestones',
      component: () => import('../views/app/milestones/MilestonesView.vue'),
      meta: {
        requiresAuth: true,
        breadcrumb: { label: 'Milestones' }
      }
    },
    {
      path: 'list',
      name: 'list',
      meta: {
        requiresAuth: true,
        breadcrumb: { label: 'Lists', routeName: 'list_view' }
      },
      children: [
        {
          path: ':id',
          name: 'list_view',
          component: () => import('../views/app/list/ListView.vue'),
          props: true,
          meta: {
            requiresAuth: true,
            breadcrumb: { label: 'List', routeName: 'list_view' }
          }
        },
      ]
    },
    {
      path: 'friends',
      name: 'friends',
      component: () => import('../views/app/friends/FriendsView.vue'),
      meta: {
        requiresAuth: true,
        breadcrumb: { label: 'Friends' }
      }
    },
    {
      path: 'milestone',
      name: 'milestone',
      meta: {
        breadcrumb: { label: 'Milestone', routeName: 'milestones' }
      },
      children: [
        {
          path: ':id',
          name: 'milestone_view',
          component: () => import('../views/app/milestones/MilestoneView.vue'),
          props: true,
          meta: {
            requiresAuth: true,
            breadcrumb: { label: 'Milestone', routeName: 'milestone_show' }
          },
        },
        {
          path: 'create',
          name: 'create_milestone',
          component: () => import('../views/app/milestones/CreateMilestoneView.vue'),
          meta: {
            requiresAuth: true,
            breadcrumb: { label: 'Create', routeName: 'create_milestone' }
          },
        }
      ]
    },
    {
      path: 'account',
      name: 'account',
      meta: {
        requiresAuth: true,
        breadcrumb: { label: 'Account' }
      },
      children: [
        {
          path: '',
          name: 'profile_view',
          component: () => import('../views/app/account/ProfileView.vue'),
          meta: {
            requiresAuth: true,
            breadcrumb: { label: 'My Profile', routeName: 'profile_view' }
          },
        }
      ]
    }
  ]
}