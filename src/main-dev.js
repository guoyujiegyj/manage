import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入并注册树形表格插件
import ZkTable from 'vue-table-with-tree-grid'
// 富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入你progress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.component('tree-table', ZkTable)

// 导入公共组件面包屑
import breadcrumb from  './components/common/Breadcrumb.vue'
// 注册面包屑组件
Vue.component(breadcrumb.name,breadcrumb)
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
  // 加载条
  NProgress.start()
  return config
},error=>{
  return Promise.reject(error)
})
axios.interceptors.response.use(config=>{
  // 加载条消失
  NProgress.done()
  return config
})



// 时间过滤器
Vue.filter('dateFormat',(val)=>{
  const date=new Date(val)
  const y = date.getFullYear()
  const month=(date.getMonth().toString()).padStart(2,'0')
  const d = date.getDate().toString().padStart(2,'0')

  const h = date.getHours().toString().padStart(2,'0')
  const m = date.getMinutes().toString().padStart(2,'0')
  return `${y}-${month}-${d} ${h}:${m}`
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
