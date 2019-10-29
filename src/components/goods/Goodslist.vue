<template>
  <el-card class="box-card">
    <!--面包屑导航组件-->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <!--搜索框和添加按钮-->
    <!--:gutter设置列之间的距离-->
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-input
            v-model="goodsQueryInfo.query"
            @clear="getGoodsList()"
            placeholder="请输入内容"
            clearable
          >
            <el-button @click="getGoodsList()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!--商品表格-->
    <el-table :data="goodsList" border="" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column header-align="center" prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column header-align="center" width="100px" prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column header-align="center" width="100px" prop="goods_number" label="商品数量"></el-table-column>
      <el-table-column header-align="center" align="center" width="150px" label="创建时间">
        <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column width="120px" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button @click="deleteGood(scope.row)" type="danger" size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[4, 6, 10]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 请求商品列表需要携带的参数
      goodsQueryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 商品总数
      total: 0,
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsQueryInfo
      })
      if (res.meta.status !== 200) return
      this.total = res.data.total
      this.goodsList = res.data.goods
      console.log(res)
    },
    // 每页条数改变时，
    handleSizeChange(size) {
      this.goodsQueryInfo.pagesize = size
      this.getGoodsList()
    },
    // 页数改变时
    handleCurrentChange(num) {
      this.goodsQueryInfo.pagenum = num
      this.getGoodsList()
    },
    // 删除商品
    async deleteGood(row) {
      // 弹出警告
      const warn = await this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除
      if (warn !== 'confirm') return
      // 发送请求，
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) return
      this.$message.success('删除成功')
      this.getGoodsList()
      console.log(res)
    },
    // 添加商品
    addGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang='less' scoped>
</style>