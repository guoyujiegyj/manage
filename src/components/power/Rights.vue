<template>
  <el-card class="box-card">
    <!--面包屑导航-->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <!--权限列表-->
    <el-table :data="rightsList" height="450px" border stripe style="width: 100%">
      <el-table-column type="index" header-align="center" align="center"></el-table-column>
      <el-table-column prop="authName" align="center" label="名称" width="180"></el-table-column>
      <el-table-column prop="path" align="center" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" align="center" label="权限等级">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level==='1'">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
