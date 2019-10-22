import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入axios
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

// 通过拦截器为请求头设置token
axios.interceptors.request.use(config=>{
  // 除了登录请求不需要token验证，其他的请求都需要
  if(config.url!=='login'){
    const token = window.sessionStorage.getItem('token')
    config.headers.Authorization=token
  }
  return config
},error=>{
  return Promise.reject(error)
})

Vue.prototype.$http=axios
// 引入去全局css
import './assets/css/global.css'

// 引入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
