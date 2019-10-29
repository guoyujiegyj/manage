<template>
  <el-card>
    <my-breadcrumb level1="商品管理" level2="添加商品"></my-breadcrumb>
    <el-alert title="警告提示的文案" type="warning" show-icon></el-alert>
    <!--步骤条-->
    <!--减0是将字符串转为数字-->
    <el-steps :space="200" :active="stepIndex-0" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!---选项卡-->
    <el-tabs :tab-position="'left'" v-model="stepIndex">
      <el-tab-pane label="基本信息" name='0'>用户管理</el-tab-pane>
      <el-tab-pane label="商品参数" name='1'>配置管理</el-tab-pane>
      <el-tab-pane label="商品属性" name='2'>角色管理</el-tab-pane>
      <el-tab-pane label="商品图片" name='3'>定时任务补偿</el-tab-pane>
      <el-tab-pane label="商品内容" name='4'>配置管理</el-tab-pane>
      
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 步骤条和选项卡的联动：步骤条的active绑定stepIndex，选项卡的v-model
      // 也绑定stepIndex，当选项卡切换时，stepIndex改变，步骤条也随之改变。
      // 步骤条的激活项，默认为第一项
      stepIndex: 0
    }
  }
}
</script>

<style lang='less' scoped>
.el-steps {
  margin: 20px 0;
}
</style>