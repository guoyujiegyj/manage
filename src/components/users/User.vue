<template>
  <div>
    <!--卡片-->
    <el-card class="box-card">
      <!--面包屑导航组件-->
      <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
      <!--搜索框和添加按钮-->
      <!--:gutter设置列之间的距离-->
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" @click="getUsersList" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogFormVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户表格-->
      <el-table :data="usersList" stripe style="width: 100%">
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center" width="180">
          <template slot-scope="scope">
            <el-switch
              @change="stateChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editUserForm(scope.row.id)"
            ></el-button>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="修改角色"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="modifyRole(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--添加用户模态框-->
      <el-dialog title="添加用户" @close="resetAddForm" :visible.sync="dialogFormVisible">
        <el-form :model="addForm" ref="addUserRef" label-position="right" :rules="addUserRules">
          <!--prop对应验证规则-->
          <el-form-item label="用户名" label-width="80px" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="80px" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" label-width="80px" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改用户模态框-->
      <el-dialog title="添加用户" @close="resetEditForm" :visible.sync="dialogEditVisible">
        <el-form :model="editForm" ref="editUserRef" label-position="right" :rules="editUserRules">
          <!--prop对应验证规则-->
          <el-form-item label="用户名" label-width="80px">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" label-width="80px" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改角色模态框-->
      <el-dialog @close="resetSelect" title="修改角色" :visible.sync="dialogModifyRole" width="30%" height="60%">
        <span class="modifyRoleClass">当前用户：{{roleInfo.username}}</span>
        <br>
        <span class="modifyRoleClass">当前角色：{{roleInfo.role_name}}</span>
        <br>
        <div>
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="(item) in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogModifyRole = false">取 消</el-button>
          <el-button type="primary" @click="saveRole">确 定</el-button>
        </span>
      </el-dialog>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 4, 6, 10]"
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
    // 邮件的自定义验证
    // 自定义验证的步骤：
    // 1:定义验证规则函数，如：checkEmail。
    // 2:在rules里使用：如：{validator: checkEmail}
    // 3:在el-form-item里通过prop使用此验证规则
    var checkEmail = (rule, val, callback) => {
      const regEmail = /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/i
      if (regEmail.test(val)) {
        return callback()
      }
      callback(new Error('邮箱格式不对'))
    }
    // 电话的自定义验证
    var checkMobile = (rule, val, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      // 验证成功
      if (regMobile.test(val)) {
        return callback()
      }
      // 验证失败
      callback(new Error('电话号码格式不正确'))
    }
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
      // 请求来的用户总数
      total: 0,
      // 修改角色时的用户信息。
      roleInfo: {},

      // 添加用户的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 角色列表
      rolesList: [],
      selectedRoleId: '',
      // 修改用户的数据
      editForm: {
        username: '',
        email: '',
        // id.
        mobile: ''
      },
      // 控制添加用户模态框显示隐藏,默认隐藏
      dialogFormVisible: false,
      // 修改角色的模态框
      dialogModifyRole: false,
      // 修改用户
      dialogEditVisible: false,
      // 添加用户de密码规则校验
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用邮箱' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用互的校验规则
      editUserRules: {
        email: [
          { required: true, message: '请输入用邮箱' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
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
        consoel.log('!==200')
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.usersList = res.data.users
    },
    // 封装充值表单方法。
    // resetForm(val) {
    //   //console.log("wwwwwwwwwwwww")
    //   this.$refs.val.resetFields()
    // },
    // 点击添加用户时，执行此方法，清空表单。
    resetAddForm() {
      // 此处和登录页的重置有异曲同工之妙。
      // 通过element的resetfields方法来清空。
      this.$refs.addUserRef.resetFields()
    },
    resetEditForm() {
      this.$refs.editUserRef.resetFields()
    },
    // 每页显示的条数。
    handleSizeChange(val) {
      // 获取到每页显示的条数，并赋值。
      this.queryInfo.pagesize = val
      // 然后重新请求数据。
      this.getUsersList()
    },
    // 当前页码改变时触发
    handleCurrentChange(val) {
      // 逻辑：当页码改变时，获取到页码值，即val。将其赋给data的queryInfo的页码
      // 然后重新发起数据请求，即可获得数据。
      this.queryInfo.pagenum = val
      this.getUsersList()
    },
    // 用户状态改变时
    async stateChange(userInfo) {
      // 只要进入此函数，则userInfo里的状态已经改变，秩序将改变的状态提交给数据库即可。
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      // 如果没有修改成功，则需要将视觉上的状态切换。
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 点击确定时，添加用户
    addUserSure() {
      // 先进行预校验。通过element的validate方法
      this.$refs.addUserRef.validate(async vali => {
        if (vali === false) {
          return this.$message.error('请检查')
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        } else {
          this.$message.success('添加成功')
          // 重新获取数据。
          this.getUsersList()
          // 关闭弹框。
          this.dialogFormVisible = false
        }
      })
    },
    // 修改用户：
    async editUserForm(id) {
      // 通过作用域插槽获取id。
      this.dialogEditVisible = true
      //通过id查询用户数据。
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return
      this.editForm = res.data
    },
    // 确认修改。
    editUserSure() {
      // 先进行预验证，成功了再发送请求。
      this.$refs.editUserRef.validate(async vali => {
        if (vali === false) return
        // 发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.msg('更新失rrrr败')
        }
        this.$message.success(res.meta.msg)
        this.dialogEditVisible = false
        this.getUsersList()
      })
    },
    // 删除用户
    async deleteUser(id) {
      const confirmRes = await this.$confirm('是否确认删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 取消时，执行错误的回调。用catch捕获。
      }).catch(err => err)
      // 当确认删除时，回返回‘confirm’字符串
      // console.log(confirmRes)
      // 如果是取消删除
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 如果是确认删除
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.info('删除失败')
      } else {
        this.$message.success('删除成功')
        this.getUsersList()
        this.dialogEditVisible = false
      }
    },
    // 修改角色,点击修改角色时调用
    async modifyRole(roleInfo) {
      console.log(roleInfo)
      this.dialogModifyRole = true
      // 获取到要修改的用户信息，保存到data
      this.roleInfo = roleInfo
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      // 保存角色列表
      this.rolesList = res.data
    },
    // 修改角色，点击确认时修改
    async saveRole() {
      // 首先得选了角色，即selected不能为空
      if(!this.selectedRoleId){
        return this.$message.error("请选择角色")
      }
      // 发送请求：
      const {data: res} = await this.$http.put(`users/${this.roleInfo.id}/role`,{rid: this.selectedRoleId})
      //console.log(res)
      if(res.meta.status===200){
        this.$message.success('角色更新成功')
        this.getUsersList()
        this.dialogModifyRole=false
      }
    },
    // 当修改角色的莫泰关闭时，触发此事件，清空其数据
    resetSelect() {
      // 清除选中项，让下次点开时默认为请选择。
      this.selectedRoleId=''

    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 10px;
}
.modifyRoleClass {
  height: 30px;
  line-height: 30px;
}
</style>
