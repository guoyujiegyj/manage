<template>
  <div class="title">
    <!--抽离公共组件：面包屑导航-->
    <!--将添加按钮和面包屑抽离为一个组件，当btn为undefined，说明父组件没有传，所以通过v-if判断。-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 当btn不是null，不渲染el-button-->
    <el-button type="primary" v-if="btn!==undefined">{{btn}}</el-button>
  </div>
</template>
<script>
export default {
  props: ['level1', 'level2', 'btn'],
  name: 'my-breadcrumb',
  data() {
    return {}
  }
}
</script>

<style lang='less' scoped>
.title{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>