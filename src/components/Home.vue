<template>
  <el-container class="container_box">
    <!--头部-->
    <el-header>
      <div class="header_left">
        <img src="../assets/heima.png" alt="">
        <h2>后台管理系统</h2>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <!--一级菜单-->
          <el-submenu :index="item1.id+''" v-for='(item1) in menuList' :key=item1.id>
            <!--菜单项-->
            <template slot="title">
              <i :class="menuObj[item1.id]"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!--二级菜单-->
              <el-menu-item :index="item2.id+''" v-for='(item2) in item1.children' :key='item2.id'>
                <!--菜单项-->
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边-->
      <el-main>Main</el-main>
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
        125: "iconfont icon-yonghu",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji"
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取菜单导航数据
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      console.log(res)
      if(res.meta.status!==200) return
      this.menuList = res.data
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
  }
  //header 的颜色
  background: #373d41;
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.container_box {
  height: 100%;
}
.iconfont{
  margin-right:16px;
}
</style>

