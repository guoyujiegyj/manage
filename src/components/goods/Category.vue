<template>
  <el-card>
    <div class="title">
      <!--面包屑导航-->
      <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
      <el-button type="primary" @click="addCate">添加分类</el-button>
    </div>
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
        <el-tag
          type="info"
          size="mini"
          v-else-if="scope.row.cat_level===1"
          style="margin-left:50px"
        >二级</el-tag>
        <el-tag type="warning" size="mini" style="margin-left:80px" v-else>三级</el-tag>
      </template>
      <template slot="opt">
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
      </template>
    </tree-table>
    <!--添加分类模态框-->
    <el-dialog class="dialog" title="添加分类" :visible.sync="dialogAddCate" width="50%">
      <!-- :model是此表单要绑定的数据对象。
      prop是校验规则
      form表单里的每一个input的数据都和model对应。 --->
      <el-form
        :model="addCateInfo"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <div class="block">
          <el-form-item label="父及分类">
          <el-cascader
            clearable
            expand-trigger="hover"
           
            v-model="selectedKeys"
            :options="parentCate"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCate = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4,6,8,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 获取商品分类列表需要向服务器传递的参数,以下值为默认值，和view双先绑定。
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4
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
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 分页数据
      pageInfo: {
        pagesize: 5,
        pagenum: 1
      },
      total: 0,
      // 添加分类的数据。
      dialogAddCate: false,
      addCateInfo: {
        cat_name: '',
        cat_pid: 0,
        // // 父及分类：默认为0.
        cat_level: 0
      },
      // 请求回来的父及的分类数据
      parentCate: [],
      // 添加分类的校验规则。
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 选中的分类id，数组格式。
      selectedKeys: [],
      // 级联框的配置信息
      cascaderProps: {
        // 级联框选中的值得id。
        value: 'cat_id',
        // 级联框显示的值
        label: 'cat_name',
        children: 'children'
      }
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
      this.total = res.data.total
    },
    // 当每页的条数改变时触发的方法。
    handleSizeChange(newPageSize) {
      // 修改data里对应的值。
      this.queryInfo.pagesize = newPageSize
      // 重新请求数据
      this.getCateList()
    },
    // 当当前页码改变时
    handleCurrentChange(newPageNum) {
      // 修改data里对应的值。
      this.queryInfo.pagenum = newPageNum
      // 重新发起请求
      this.getCateList()
    },
    // 点击添加分类时，弹出模态框
    addCate() {
      this.getParentCate()
      this.dialogAddCate = true
      
    },
    // 请求父及分类数据
    async getParentCate() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }})
      if (res.meta.status !== 200) return
      this.parentCate = res.data
      console.log(res)
    },
    // 父及分类改变
    parentCateChange() {
      console.log(this.selectedKeys)
    }
  }
}
</script>

<style lang='less' scoped>
.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

// 级联选择器的样式。
.dialog{
  .block{
    >.el-scrollbar__wrap{
      max-height:200px;
      overflow: scroll;
    }
  }
}
</style>