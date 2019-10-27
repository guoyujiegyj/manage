<template>
  <el-card>
    <!--面包屑导航-->
    <my-breadcrumb level1="商品管理" level2="参数列表"></my-breadcrumb>
    <el-alert show-icon title="提示：只允许为第三极分类设置参数" type="warning"></el-alert>
    <el-row :gutter="10">
      <el-col :span="2.5" class="span_cate">选择商品分类：</el-col>
      <!--级联选择框-->
      <el-cascader
        :options="cateList"
        v-model="selectedCateKeys"
        :props="cateProps"
        @change="cateChange"
      ></el-cascader>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类数据。
      cateList: [],
      // 级联选择器双向绑定的数据。。
      selectedCateKeys: [],
      // 级联选择器的配置项。
      cateProps: {
        //级联框每一项的标识。
        value: 'cat_id',
        // 级联框显示的值
        label: 'cat_name',
        // 要渲染的下一级的对象
        children: 'children',
        expandTrigger: "hover"

      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 页面加载时，获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择器改变时
    cateChange() {

    }
  }
}
</script>

<style lang='less' scoped>
.el-alert {
  margin-bottom: 10px;
}
.span_cate{
  height:28px;
  line-height:28px;
}
</style>