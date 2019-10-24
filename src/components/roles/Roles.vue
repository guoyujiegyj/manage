<template>
  <el-card class="box-card">
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--添加按鈕-->
    <el-button type="primary">添加角色</el-button>
    <!--角色列表-->
    <el-table :data="rolesList" border="" stripe style="width: 100%">
      <!--展開行-->
      <el-table-column type="expand" header-align="center" align="center">
        <template slot-scope="scope">
          <el-row :class="['border_bottom']" v-for="(item1,id1) in scope.row.children" :key="id1">
            <!--一級權限列-->
            <el-col :span="6">
                <el-tag type="success">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <!----二級權限列和三級權限-->
            <el-col :span="18">
              <el-row v-for="(item2,id2) in item1.children" :key="id2">
                <!--二級權限-->
                <el-col :span="8">
                  <el-tag type="warning">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--三級權限-->
                <el-col :span="16">
                  <el-tag v-for="(item3,id3) in item2.children" :key="id3" type="info">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" header-align="center" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" align="center" width="180"></el-table-column>
      <el-table-column label="操作" align="center">
        <template>
          <el-button type="primary" size="mini" icon="el-icon-edit">編輯</el-button>
          <el-button type="warning" size="mini" icon="el-icon-setting">刪除</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">分配權限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rolesList: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return
      this.rolesList = res.data
    }
  }
}
</script>

<style lang='less' scoped>
.border_bottom{
  border-bottom: 1px solid #eee
}
.el-tag{
  margin:8px;
}
</style>