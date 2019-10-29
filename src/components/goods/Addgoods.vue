<template>
  <el-card>
    <my-breadcrumb level1="商品管理" level2="添加商品"></my-breadcrumb>
    <el-alert title="警告提示的文案" type="warning" show-icon></el-alert>
    <!--步骤条-->
    <!--减0是将字符串转为数字-->
    <el-steps :space="200" :active="stepIndex-0" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!---选项卡-->
    <el-form
      :model="addForm"
      ref="addFormRef"
      :rules="addFormRules"
      label-position="'left'"
      label-width="80px"
    >
      <el-tabs
        :tab-position="'left'"
        @tab-click="tabClick1"
        :before-leave="tabsLeave"
        v-model="stepIndex"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="活动名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input type="number" v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input type="number" v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input type="number" v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              :props="cateProps"
              v-model="addForm.goods_cat"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="(item) in manyTableData" :key="item.attr_id" :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border v-for="(item1,i) in item.attr_vals" :key="i"  :label="item1"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="(item, i) in onlyTableData" label-width="190px" :key="i" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">配置管理</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 步骤条和选项卡的联动：步骤条的active绑定stepIndex，选项卡的v-model
      // 也绑定stepIndex，当选项卡切换时，stepIndex改变，步骤条也随之改变。
      // 步骤条的激活项，默认为第一项
      stepIndex: 0,
      // Form表单数据
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 保存各级分类的id
        goods_cat: []
      },
      //级联选择器的配置数据
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },

      // 商品分类列表。
      cateList: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, message: '长度不够', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { min: 1, message: '长度不够', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { min: 1, message: '长度不够', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { min: 1, message: '长度不够', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      manyTableData: [],
      onlyTableData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表的方法。页面加载时调用。
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
      // console.log(res)
    },
    handleChange() {
      // 如果选择的不是三级分类，则清空级联选择器。
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // console.log(this.addForm.goods_cat)
    },
    // tabs 切换时的钩子函数。
    // 第一个参数是旧tab的name.returnfalse时，切换失败。
    tabsLeave(n, o) {
      console.log(typeof o)
      // 只有当三级分类选了时，标签才可以进行切换。
      if (o === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.warning('请先选择商品的分类')
        return false
      }
    },
    // tab切换时的点击事件
    async tabClick1() {
      if (this.stepIndex === '1') {
        const { data: manyRes } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (manyRes.meta.status !== 200) return
        // 将attr_vals字符串截取为数组。
        manyRes.data.forEach(item => {
          item.attr_vals = item.attr_vals.length===0?
          []:item.attr_vals.split(',')
        })
        this.manyTableData = manyRes.data
        // console.log(this.manyTableData)
      }else if(this.stepIndex === '2'){
        const { data: onlyRes } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          })
          if (onlyRes.meta.status !== 200) return
          console.log(onlyRes)
          this.onlyTableData = onlyRes.data
      }
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-steps {
  margin: 20px 0;
}
</style>