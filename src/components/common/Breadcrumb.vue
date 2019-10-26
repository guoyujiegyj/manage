<template>
  <!--抽离公共组件：面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  props: ['level1','level2'],
  name: 'my-breadcrumb',
  data() {
    return {}
  }
}
</script>

<style lang='less' scoped>
</style>