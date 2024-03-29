import Vue from 'vue'

import VueRouter from 'vue-router'
//import Login from '../components/Login.vue'
//import Home from '../components/Home.vue'
//import User from '../components/users/User.vue'
const Login = () => import(/* webpackChunkName: "login_home_user" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_user" */ '../components/Home.vue')
const User = () => import(/* webpackChunkName: "login_home_user" */ '../components/users/User.vue')

//import Rights from '../components/power/Rights.vue'
//import Roles from '../components/roles/Roles.vue'
const Rights = () => import(/* webpackChunkName: "rights_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "rights_roles" */ '../components/roles/Roles.vue')

//import Category from '../components/goods/Category.vue'
const Category = () => import(/* webpackChunkName: "category_params" */ '../components/goods/Category.vue')
//import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "category_params" */ '../components/goods/Params.vue')
//import Goodslist from '../components/goods/Goodslist.vue'
//import Goodsadd from '../components/goods/Addgoods.vue'
const Goodslist = () => import(/* webpackChunkName: "goodslist_goodsadd" */ '../components/goods/Goodslist.vue')
const Goodsadd = () => import(/* webpackChunkName: "goodslist_goodsadd" */ '../components/goods/Goodslist.vue')

//import Order from '../components/order/Order.vue'
//import Report from '../components/report/Report.vue'
const Order = () => import(/* webpackChunkName: "order_raport" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "order_raport" */ '../components/report/Report.vue')


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
    component: Home,
    children: [
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Category
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goodslist 
      },
      {
        path: '/goods/add',
        component: Goodsadd
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫，在页面跳转之前判断是否有本地token，
router.beforeEach((to, from, next) => {
  // 如果to.path是login，直接放行。
  if (to.path === '/login') return next()
  // 不是login，则判断是否有token
  const token = window.sessionStorage.getItem('token')
  // 如果没有token，回到login页。
  if (!token) return next("/login")
  // 否则说明有token，进行跳转。
  next()
})
export default router
