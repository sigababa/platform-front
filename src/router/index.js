import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layout/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dataset/classification'
      },
      {
        path: '/dataset',
        redirect: '/dataset/classification'
      },
      {
        path: '/dataset/classification',
        name: 'Classification',
        component: () => import('../views/dataset/Classification.vue')
      },
      {
        path: '/dataset/detection',
        name: 'Detection',
        component: () => import('../views/dataset/Detection.vue')
      },
      {
        path: '/dataset/segmentation',
        name: 'Segmentation',
        component: () => import('../views/dataset/Segmentation.vue')
      },
      {
        path: '/experiments',
        redirect: '/experiments/running'
      },
      {
        path: '/experiments/running',
        name: 'RunningExperiments',
        component: () => import('../views/experiments/Running.vue')
      },
      {
        path: '/experiments/completed',
        name: 'CompletedExperiments',
        component: () => import('../views/experiments/Completed.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 