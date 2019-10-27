<template>
  <el-container class="container_box">
    <!--头部-->
    <el-header>
      <div class="header_left">
        
        <h2>后台管理系统</h2>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCllapse?'64px':'200px'">
        <!--实现侧边隐藏，需要添加下面一个元素-->
        <div class="cllapse_btn" @click="asideCllapse" :class="isCllapse?'el-icon-arrow-right':'el-icon-arrow-left'"></div>
        <el-menu
          :collapse-transition="false"
          :default-active="navActive"
          :collapse="isCllapse"
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          router
        >
          <!--一级菜单-->
          <el-submenu :index="item1.id+''" v-for="(item1) in menuList" :key="item1.id">
            <!--菜单项-->
            <template slot="title">
              <i :class="menuObj[item1.id]"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item 
              @click="handleNavActive(item2.path)"  
              :index="item2.path+''" 
              v-for="(item2) in item1.children" 
              :key="item2.id"
              >
              <!--菜单项-->
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      // 通过menuObj，在遍历menu时，为每一个菜单项添加图标。
      // key是返回数据的每项菜单的id
      menuObj: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-shujutongji'
      },
      // 左侧栏显示隐藏
      isCllapse: true,
      // 左侧栏导航高亮显示。
      navActive:''
    }
  },
  created() {
    this.getMenuList()
    this.navActive=window.sessionStorage.getItem('navActive')
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 侧边栏高亮显示
    handleNavActive(navPath){
      window.sessionStorage.setItem('navActive',navPath)
      this.navActive=navPath
    },
    // 获取菜单导航数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return
      this.menuList = res.data
    },
    // 折叠侧边栏
    asideCllapse() {
      this.isCllapse = !this.isCllapse
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  /*元素在垂直方向居中*/
  align-items: center;
  > .header_left {
    display: flex;
    align-items: center;
    /*文字颜色*/
    > h2 {
      color: #fff;
      margin-left: 20px;
    }
    >img{
      width:100px;
    }
  }
  //header 的颜色
  background: #1a1b20;
}
.el-aside {
  user-select: none;
  background: #1a1b20;
  > .el-menu {
    // 侧边栏右边框一像素问题。
    border-right: 0px;
    padding-top:0px;
  }
  // 显示隐藏左侧栏的样式
  > .cllapse_btn {
    height: 20px;
    line-height:20px;
    width: 100%;
    background: #4a5064;
    text-align: center;
    // 文本间距。
    letter-spacing: 0.3rem;
    font-size: 14px;
    cursor: pointer;
    color: #fff;
  }
}
.el-main {
  background: #eaedf1;
}
.container_box {
  height: 100%;
}
.iconfont {
  margin-right: 16px;
}
</style>

