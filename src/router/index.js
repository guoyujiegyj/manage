import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫，在页面跳转之前判断是否有本地token，
router.beforeEach((to, from, next) => {
  // 如果to.path是login，直接放行。
  if(to.path==='/login') return next()
  // 不是login，则判断是否有token
  const token = window.sessionStorage.getItem('token')
  // 如果没有token，回到login页。
  if(!token) return next("/login")
  // 否则说明有token，进行跳转。
  next()
})
export default router
