<template>
  <el-card>
    <!--面包屑导航组件-->
    <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
    <!--搜索框和添加按钮-->
    <!--:gutter设置列之间的距离-->
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-input placeholder="请输入内容"   clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格-->
    <el-table :data="orderList" border="" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_id" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
      <el-table-column prop="pay_status" label="是否付款" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status==='shi'" type="success">已付款</el-tag>
          <el-tag v-else type="error">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="180"></el-table-column>
      <el-table-column prop="update_time" label="下单时间" width="180">
        <template slot-scope="scope">{{scope.row.update_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template>
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="success" icon="el-icon-location"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      orderList: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return
      this.orderList = res.data.goods
      console.log(this.orderList)
      this.total = res.data.total
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize=size
      this.getOrderList()
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum=num
      this.getOrderList()
    }
  }
}
</script>

<style lang='less' scoped>
</style>