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
      <!--侧边-->
      <el-aside width="200px">Aside</el-aside>
      <!--右边-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
  .el-header{
    display: flex;
    justify-content: space-between;
    /*元素在垂直方向居中*/
    align-items: center;
    >.header_left{
      display:flex;
      align-items: center;
      /*文字颜色*/
      >h2{
        color:#fff;
        margin-left:20px;
      }
    }
    //header 的颜色
    background: #373d41;
  }
  .el-aside{
    background: #333744;
  }
  .el-main{
    background:#eaedf1;
  }
  .container_box{
    height:100%;
  }
  
</style>

