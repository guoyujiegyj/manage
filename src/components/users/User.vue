<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索框和添加按钮-->
      <!--:gutter设置列之间的距离-->
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <el-input placeholder="请输入内容" v-model="searchVal">
              <template slot="append">请搜索</template>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户表格-->
      <el-table :data="usersList" stripe style="width: 100%">
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="moblie" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="修改角色"
              placement="top"
            >
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      usersList: [],
      // 请求用户列表时携带的参数。
      queryInfo: {
        query: '',
        // 页码
        pagenum: 1,
        // 每页的条数
        pagesize: 3
      },
      searchVal: '',
      total: 0
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total=res.data.total
      this.usersList = res.data.users
    },
    // 每页显示的条数。
    handleSizeChange(val) {
      // 获取到每页显示的条数，并赋值。
      this.queryInfo.pagesize=val
      // 然后重新请求数据。
      this.getUsersList()
    },
    // 当前页码改变时触发
    handleCurrentChange(val) {
      // 逻辑：当页码改变时，获取到页码值，即val。将其赋给data的queryInfo的页码
      // 然后重新发起数据请求，即可获得数据。
      this.queryInfo.pagenum=val
      this.getUsersList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
.el-pagination{
  margin-top:10px;
}
</style>
