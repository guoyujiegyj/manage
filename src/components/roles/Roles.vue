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
    <el-table :data="rolesList" border="" height="400" stripe style="width: 100%">
      <!--展開行-->
      <el-table-column type="expand" header-align="center" align="center">
        <template slot-scope="scope">
          <el-row :class="['border_bottom','vcenter']" v-for="(item1,id1) in scope.row.children" :key="id1">
            <!--一级权限-->
            <el-col :span="6">
                <el-tag closable @close="removeRight(scope.row,item1.id)" type="success">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <!----二級權限列和三級權限-->
            <el-col :span="18">
              <el-row :class="['vcenter','border_bottom']" v-for="(item2,id2) in item1.children" :key="id2">
                <!--二級權限-->
                <el-col :span="8">
                  <el-tag closable @close="removeRight(scope.row,item2.id)" type="warning">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--三級權限-->
                <el-col :span="16">
                  <el-tag closable @close="removeRight(scope.row,item3.id)" v-for="(item3,id3) in item2.children" :key="id3" type="info">{{item3.authName}}</el-tag>
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
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="warning" size="mini" icon="el-icon-setting">删除</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">分配权限</el-button>
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
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return
      this.rolesList = res.data
    },
    // 删除权限,参数是角色id，要删除的权限id
    async removeRight(role,rightId) {
      // 先弹出提示框，是否删除？
       const confRes = await this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // 如果点击的是确定，则返回‘confirm'字符串。
        if(confRes!=='confirm') return 
        // 进行数据库请求。
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        // 返回的数据是当前角色的数据。
        role.children=res.data
    }
  }
}
</script>

<style lang='less' scoped>
.border_bottom{
  border-bottom: 1px solid #eee
}
.el-table{
  margin-top:10px;
}
.el-tag{
  margin:8px;
}
.vcenter{
  display:flex;
  align-items: center;
}
</style>