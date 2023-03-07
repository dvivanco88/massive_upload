import { createWebHistory, createRouter } from "vue-router"

const routes = [
  { path: '/', component: () => import("@/components/Users.vue") },
  { path: '/userRoles', component: () => import("@/components/UserRoles.vue") },
  { path: '/materials', component: () => import("@/components/Materials.vue") },
  { path: '/materialsToOrgs', component: () => import("@/components/MaterialsToOrgs.vue") },
  { path: '/materialsToRoutes', component: () => import("@/components/MaterialsToRoutes.vue") },
  { path: '/WIP', component: () => import("@/components/WIP.vue") },
]


const router = createRouter({  
  history: createWebHistory(),
  routes,
})

export default router
