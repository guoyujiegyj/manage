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

#### 分支问题
当一个分支开发完后（login），已经提交到本地仓库，需要切换到主分支，然后进行合并和推送。
推送后，线上没有子分支，只有一个主分支，需要切换到子分支，然后进行推送
git push -u origin login

#### vscode格式化文件
快捷键：shift + alt + F
存在的问题：
默认会将单引号替换为双引号，会添加分号。
解决：
创建配置文件.prettierrc.json文件
{
  "semi": false, 不适用分号
  "singleQuote": true 使用单引号
}

### 遍历菜单时，为每一项添加图标。
在data里定义对象，key是每一个菜单项对应的key，值是图标的类名。如：
menuObj: {
        125: "iconfont icon-yonghu",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji"
      }
使用：通过遍历的每一项item的id来从对象里获取类名，如：
<i :class="menuObj[item1.id]"></i>

## #侧边栏导航高亮显示及状态的保存。
通过el-menu的default-active属性，将其置设为index的值即可。
通过二级的单击事件获取到当前项的index，将其通过sessionStorage本地存储，然后在create方法里设置default-active的属性为sessionStorage里保存的值即可。