<template>
  <el-card>
    <!--面包屑导航-->
    <my-breadcrumb level1="商品管理" level2="商品分类" btn="添加分类"></my-breadcrumb>
    <!--树形表格-->
    <tree-table
      :data="cateList"
      :expand-type="false"
      border=""
      :columns="columns"
      show-index
      :selection-type="false"
      index-text="#"
    >
      <!--第一个自定义模板-->
      <template slot-scope="scope" slot="isok">
        <i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted===false"></i>
        <i class="el-icon-error" v-else></i>
      </template>
      <!--第二个自定义模板-->
      <template slot-scope="scope" slot="order">
        <el-tag type="success" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag type="info" size="mini" v-else-if="scope.row.cat_level===1" style="margin-left:50px">二级</el-tag>
        <el-tag type="warning" size="mini"  style="margin-left:80px" v-else>三级</el-tag>
      </template>
      <template slot="opt">
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
      </template>
    </tree-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 获取商品分类列表需要向服务器传递的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据
      cateList: [],
      // 每一列的数据
      columns: [
        // 每一个对象就是一列
        {
          // 每一列的标题
          label: '分类名称',
          // 列的具体内容。
          prop: 'cat_name'
        },
        // 第二列
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 表示当前列是自定义模板。
          type: 'template',
          // 模板对应的作用域插槽
          template: 'isok'
        },
        // 第三列：
        {
          label: '商品等级',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        // 第四列
        {
          label: "操作",
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return
      this.cateList = res.data.result
    }
  }
}
</script>

<style lang='less' scoped>
</style>