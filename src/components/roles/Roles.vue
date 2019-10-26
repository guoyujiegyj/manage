<template>
  <el-card class="box-card">
    <div class="title">
        <!--面包屑导航-->
      <my-breadcrumb level1="角色管理" level2="角色列表"></my-breadcrumb>
      <!--添加按鈕-->
      <el-button type="primary">添加角色</el-button>
    </div>
    <!--角色列表-->
    <el-table :data="rolesList" border="" height="400" stripe style="width: 100%">
      <!--展開行-->
      <el-table-column type="expand" header-align="center" align="center">
        <template slot-scope="scope">
          <!--如果scope.row.children.length===0，说明二级权限无数据，则表格展开项为空。-->
          <div class="span" v-if="scope.row.children.length===0">暂无数据</div>
          <div v-else>
            <el-row
              :class="['border_bottom','vcenter']"
              v-for="(item1,id1) in scope.row.children"
              :key="id1"
            >
              <!--一级权限-->
              <el-col :span="6">
                <el-tag
                  closable
                  @close="removeRight(scope.row,item1.id)"
                  type="success"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!----二級權限列和三級權限-->
              <el-col :span="18">
                <el-row
                  :class="['vcenter','border_bottom']"
                  v-for="(item2,id2) in item1.children"
                  :key="id2"
                >
                  <!--二級權限-->
                  <el-col :span="8">
                    <el-tag
                      closable
                      @close="removeRight(scope.row,item2.id)"
                      type="warning"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三級權限-->
                  <el-col :span="16">
                    <el-tag
                      closable
                      @close="removeRight(scope.row,item3.id)"
                      v-for="(item3,id3) in item2.children"
                      :key="id3"
                      type="info"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" header-align="center" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" align="center" width="180"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="warning" size="mini" icon="el-icon-setting">删除</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="setRights(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑权限模态框-->
    <el-dialog title="提示" :visible.sync="setRightsDialog" @close="havedNode=[]" width="30%">
      <span>编辑权限</span>
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        :default-checked-keys="havedNode"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allogRight()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表数据。
      rolesList: [],
      // 修改权限模态框
      setRightsDialog: false,
      // 权限列表
      rightsList: [],
      // 树形结构数据
      defaultProps: {
        // children指要循环的下一级数据。
        children: 'children',
        // label是复选框的文本标识。
        label: 'authName'
      },
      // 角色已有的权限的节点id,在刚打开时显示。
      havedNode: [],
      // 修改后的权限节点，需要提交数据库。
      allogNodeKey: [],
      // 权限确认修改时，传递给服务器的roleid
      roleId: ''
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
      console.log(this.rolesList)
    },
    // 删除权限,参数是：当前角色，要删除的权限id。
    async removeRight(role, rightId) {
      // 先弹出提示框，是否删除？
      const confRes = await this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果点击的是确定，则返回‘confirm'字符串。
      if (confRes !== 'confirm') return
      // 进行数据库请求。
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 返回的数据是当前角色的数据。
      role.children = res.data
    },
    // 设置权限,点击分配权限时触发。
    async setRights(role) {
      // 将roleId保存到data，确认修改时要用。
      this.roleId=role.id
      // 先将已有权限让其默认勾选，需要通过递归函数获取。
      this.havedNodeFun(role, this.havedNode)
      // 打开分配权限模态框,树形结构复选框。
      this.setRightsDialog = true
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) return
      this.rightsList = res.data
      // console.log(this.rightsList)
    },
    // 获取已有权限的递归函数。
    havedNodeFun(role, arr) {
      //console.log(role)
      // 先判断role是否是三级权限。
      // 如果是三级权限
      if (!role.children) {
        return arr.push(role.id)
      }
      // 不是三级权限
      role.children.forEach(item => {
        this.havedNodeFun(item, arr)
      })
    },
    // 点击确认，修改权限
    async allogRight(){
      // 通过element提供的获得已选节点的方法。
      // console.log(this.$refs.treeRef.getCheckedKeys())
      // console.log(this.$refs.treeRef.getHalfCheckedKeys())
      // 将选中的节点和半选的节点的id保存到数组中。
      this.allogNodeKey = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将选中的节点数组转换为字符串，提交数据库
      let strAllogNode = this.allogNodeKey.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:strAllogNode})
      if(res.meta.status!==200) {
        return this.$message.error("权限修改失败")
      }else{
        console.log(res)
        this.$message.success('权限修改成功')
        this.getRolesList()
        this.setRightsDialog=false
      }
    }
  }
}
</script>

<style lang='less' scoped>
.border_bottom {
  border-bottom: 1px solid #eee;
}
.el-table {
  margin-top: 10px;
}
.el-tag {
  margin: 8px;
}
// 一级权限，二级权限的样式。
.vcenter {
  display: flex;
  align-items: center;
}
// 暂无数据的样式。
.span{
  display: flex;
  justify-content: center;
}
// 面包屑导航和添加按钮的位置布局。
.title{
  display: flex;
  justify-content: space-between;
}
</style>