import { createRouter, createWebHashHistory } from 'vue-router'
import Validation from '../views/Validation.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/week/:id',
    name: 'Validation',
    component: Validation,
    children: [
      {
        path:'editpointage/:idPeriode/',
        name: "EditPointage",
        component: () => import('../views/EditPointage.vue'),
      }
    ]
  },

  // {
  //   path: '/about',
  //   name: 'À propos',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path: '/element/:id',
  //   name: 'Element',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Element.vue'),
  //   children: [
  //     {
  //       path: 'properties',
  //       component: () => import('../views/ElementProperties.vue')
  //     },
  //     {
  //       path: 'informations',
  //       component: () => import('../views/ElementInformations.vue')
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
