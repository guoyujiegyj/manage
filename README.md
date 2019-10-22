# vcli3manage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

###### 登录组件
login
token：
登录时，如果用户名和密码正确，服务器向前端返回token，以后每次请求服务器，都要携带token，没有token，则不能访问服务器。


项目用的less 预处理语言，所以需要下载相关依赖
在依赖选项分别安装less依赖和less-loader.(都是开发依赖)

登录样式：
整个背景蓝色：利用高度继承，在全局css里将html,body,#app的高度都设为100%,然后在login组件里将容器高度设为100%。
登录框居中：
        position:absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);

iconfont问题：
elementui的input表单里的图标属性去input输入框找。
在elementui的input里只能用iconfont的类形式，不能用Unicode形式。所以下载时下载第二项（font class）。
使用：

                <el-form-item>
                    <el-input prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>

### 登录的重置功能
为 form绑定ref=loginFormRef,通过ref来获取dom对象。通过调用element的form表单的resetFields方法实现。
 // 重置form表单
        loginFormReset() {
            // 获取dom元素，通过elementui提供的resetFields方法重置。
            this.$refs.loginFormRef.resetFields()
        }
#### 登录前的预校验
为 form绑定ref=loginFormRef,通过ref来获取dom对象。
 login() {
            // 通过elementui提供的validate方法预校验。
            this.$refs.loginFormRef.validate()
        }
### 引用message
这个项目里elemenui采用的是单独引入分方式，message在单独引入时和其他的不一样。
1:import {Message} from 'element-ui'
2:Vue.prototype.$message=Message
这样便可以正常使用
