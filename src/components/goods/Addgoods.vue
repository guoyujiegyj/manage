<template>
  <el-card>
    <my-breadcrumb level1="商品管理" level2="添加商品"></my-breadcrumb>
    <el-alert title="警告提示的文案" type="warning" show-icon></el-alert>
    <!--步骤条-->
    <el-steps :space="200" :active="0" align-center finish-status="success">
      <el-step title="已完成"></el-step>
      <el-step title="进行中"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="已完成"></el-step>
      <el-step title="进行中"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
  </el-card>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang='less' scoped>
.el-steps{
  margin-top:20px;
}
</style>