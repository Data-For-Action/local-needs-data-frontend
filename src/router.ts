import DatasetView from './pages/DatasetView.vue'
import DocumentationView from './pages/DocumentationView.vue'
import Support from './pages/Support.vue'
import * as VueRouter from 'vue-router'
import Health from './pages/Health.vue'
import Explore from './pages/Explore.vue'
import CharitySector from './pages/CharitySector.vue'

const routes = [
    { path: '/', component: DatasetView },
    { path: '/health', component: Health },
    { path: '/documentation', component: DocumentationView },
    { path: '/support', component: Support},
    { path: '/explore', component: Explore},
    { path: '/charity', component: CharitySector},

]

const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We
    // are using the hash history for simplicity here.
    history: VueRouter.createWebHashHistory(),
    routes, // short for `routes: routes`
})

export default router
