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
    <!--tab导航-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" @click="tabBtnClick" :disabled="isBtnDisabled">添加参数</el-button>
        <!--动态参数表格-->
        <el-table :data="manyTableData" border="" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!--循环遍历tag标签-->
              <el-tag
                @close="deleteTag(i,scope.row)"
                closable
                type="success"
                v-for="(item,i) in scope.row.attr_vals"
                :key="i"
              >{{item}}</el-tag>
              <!--动态编辑tag标签-->
              <el-input
                style="width:120px"
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="edidParams(scope.row)"
                size="mini"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                type="danger"
                @click="deleteParams(scope.row.attr_id)"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" @click="tabBtnClick" :disabled="isBtnDisabled">添加参数</el-button>
        <el-table :data="onlyTableData" border="" style="width: 100%">
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="edidParams(scope.row)"
                size="mini"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                type="danger"
                @click="deleteParams(scope.row.attr_id)"
                size="mini"
                icon="el-icon-delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--添加商品参数的模态框-->
    <el-dialog
      :title="'添加'+paramsDialogTitle"
      @close="resetParamsForm('paramsAddFormRef')"
      :visible.sync="dialogAddParams"
      width="30%"
    >
      <el-form :model="paramsInfo" :rules="paramsRules" ref="paramsAddFormRef" label-width="100px">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="paramsInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddParams = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改商品参数的模态框-->
    <el-dialog
      :title="'修改'+paramsDialogTitle"
      @close="resetParamsForm('paramsEditFormRef')"
      :visible.sync="dialogEditParams"
      width="30%"
    >
      <el-form
        :model="editParamsInfo"
        :rules="paramsRules"
        ref="paramsEditFormRef"
        label-width="100px"
      >
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="editParamsInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditParams = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
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
        expandTrigger: 'hover'
      },
      // tab导航的数据双向绑定
      activeName: 'many',
      // 动态参数的参数数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 添加商品参数的模态框显示隐藏
      dialogAddParams: false,
      dialogEditParams: false,

      // 添加商品form表单的数据。
      paramsInfo: {
        attr_name: ''
      },
      // 修改商品的数据
      editParamsInfo: {
        attr_name: '',
        attr_id: ''
      },
      paramsRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      
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
      // console.log(this.cateList)
    },
    // 级联选择器改变时
    cateChange() {
      this.getParamsData()
    },
    // tab标签页点击事件
    handleClick() {
      // tab切换时，重新获取参数数据
      this.getParamsData()
    },
    // 获取商品参数数据
    async getParamsData() {
      // 因为为商品设置参数，只能为第三级商品设置，一级和二级都不是具体的商品。
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 是三级分类，发送请求。
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      // 遍历，将attr_vals转换为数组
      res.data.forEach(item => {
        // 三元表达式：排除是空的情况。
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible=false
        item.inputValue=""
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 点击添加分类按钮时。
    tabBtnClick() {
      this.dialogAddParams = true
    },
    // 确认添加属性时。
    addParams() {
      //表单的预验证。结果通过回调函数获取
      this.$refs.paramsAddFormRef.validate(async val => {
        // 预验证失败
        if (!val) return
        // 预验证成功，发送请求。
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.paramsInfo.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status === 201) {
          this.$message.success('添加成功')
          // 关闭模态框
          this.dialogAddParams = false
          // 刷新数据
          this.getParamsData()
          console.log(res)
        }
      })
    },
    // 确认修改时
    editParams() {
      console.log(this.cateId)
      console.log(this.editParamsInfo.attr_id)
      console.log(this.activeName)
      //预校验
      this.$refs.paramsEditFormRef.validate(async vali => {
        // 如果预校验不成功
        if (!vali) return
        // 如果预校验成功，发送修改的数据请求
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamsInfo.attr_id}`,
          {
            attr_name: this.editParamsInfo.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) return
        this.$message.success('修改商品参数成功')
        this.dialogEditParams = false
        this.getParamsData()
      })
    },
    // 当模态框关闭时，清空数据
    resetParamsForm(resForm) {
      this.$refs[resForm].resetFields()
    },
    // 当点击编辑分类按钮时
    async edidParams(scope) {
      this.dialogEditParams = true
      // 先让参数显示在form表单
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${scope.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      this.editParamsInfo.attr_name = res.data.attr_name
      this.editParamsInfo.attr_id = res.data.attr_id
    },
    // 点击删除按钮，删除商品参数
    async deleteParams(attr_id) {
      const res = await this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 当确认删除时，返回的时confirm。
      if (res !== 'confirm') return
      // 发送请求
      const { data: delRes } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )
      if (delRes.meta.status !== 200) return
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // tag动态编辑标签的input事件，
    async handleInputConfirm(row) {
      // 让button按钮显示，input隐藏
      row.inputVisible=false
      // 判断input输入的值,如果是空，或空格
      if(row.inputValue.trim().length===0){
        // 清空。
        row.inputValue=''
        return
      }
      // 不是空 ，发送请求
      // 将input框的值放入 attr_vals数组
      console.log(row.attr_sel)
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=''
      // 调用修改tag的方法。
      this.saveTagData(row)
    },
    // 将修改tag标签的数据抽离为一个方法。
    async saveTagData(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        // 传三个参数。
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(",")
      })
      if(res.meta.status!==200) return
      this.$message.success("更新成功")
    },
    // 点击按钮时切换到input。
    showInput(row) {
      row.inputVisible = true
      // 点击button时，切换到input框，自动获焦。
      // 这代码时element提供好的。
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击tag标签的差，删除
    deleteTag(i,row) {
      row.attr_vals.splice(i,1)
      // 调用修改tag的方法。
      this.saveTagData(row)
    }
  },

  computed: {
    // 如果selectedCateKeys的长度不为3，则禁用 添加参数 这个按钮。
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 获取到三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return this.$message.error('error')
    },
    // 通过切换tab，控制添加参数模态框的title，两个tab用的一个模态框。
    paramsDialogTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang='less' scoped>
.el-alert {
  margin-bottom: 10px;
}
.span_cate {
  height: 28px;
  line-height: 28px;
}
</style>