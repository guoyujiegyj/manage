<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 登录框的logo-->
            <div class="logo_box">
                <img src="../assets/logo.png" alt="logo">
            </div>
            <!-- form表单-->
            <el-form :model="loginForm" ref="loginFormRef" :rules="loginRules" label-width="0" class="login_form">
                <!--用户名-->
                <el-form-item prop="uname">
                    <el-input v-model="loginForm.uname" placeholder="用户名" prefix-icon="iconfont icon-yonghu" status-icon></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="upwd">
                    <el-input type="password" placeholder="密码" v-model="loginForm.upwd" prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>
                <!--button-->
                <el-form-item class="login_button">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info" @click="loginFormReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            loginForm: {
                uname: '',
                upwd: ''
            },
            // 验证规则
            loginRules: {
                uname: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
                ],
                upwd: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        // 重置form表单
        loginFormReset() {
            // 获取dom元素，通过elementui提供的方法重置。
            this.$refs.loginFormRef.resetFields()
        }
    }
}
</script>
<style lang="less" scoped>
    .login_container{
        height: 100%;
        background: #2b4b6b;
    }
    /*登录框白色背景样式*/
    .login_box{
        width:410px;
        height:260px;
        background: #fff;
        border-radius: 5px;
        position:absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        .logo_box{
            width:80px;
            height:80px;
            background:#fff;
            padding:10px;
            position:absolute;
            /*水平阴影，垂直阴影，模糊距离，阴影尺寸，阴影颜色 */
            box-shadow:0 0 14px rgb(187, 186, 186);
            border-radius:50%;
            left:50%;
            transform: translate(-50%,-50%);
        }
        img{
            width:100%;
            border-radius: 50%;
            background:#eee;
        }
    }
    .login_form{
        // 让form表单靠下。
        position:absolute;
        bottom:0;
        width:100%;
        box-sizing: border-box;
        padding:0 40px;
    }
    .login_button{
        display: flex;
        /*居右对齐*/
        justify-content: flex-end;
    }
</style>
