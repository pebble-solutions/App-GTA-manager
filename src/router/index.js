import { createRouter, createWebHashHistory } from 'vue-router'
import Week from '../views/Week.vue'
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
        component: Week,
        children: [
            {
                path:'periode/:idPeriode/',
                name: "EditPointage",
                component: () => import('../views/Periode.vue'),
            },
            {
                path: 'data/personnel/:idPersonnel',
                name: "DataPersonnel",
                component: () => import('../views/Data.vue')
            },
            {
                path: 'insert',
                name: "InsertPeriode", //changer
                component: () => import('../views/Insert.vue')
            },
            {
                path: 'export',
                name: "ExportWeek",//changer
                component: () => import('../views/Export.vue'),
                children: [
                    {
                        path: 'personnel/:idPersonnel',
                        name: "ExportPersonnel",//changer
                        component: () => import('../views/Export.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/export',
        name: 'ExportAll',
        component: () => import('../views/Export.vue'),
    }

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
