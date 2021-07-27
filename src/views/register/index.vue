<template>
 <div class="register-container">
     
<el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="register-form">
    <h2>注册</h2>
    <el-form-item label="昵称" prop="nickname">
        <el-input v-model.number="form.nickname"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="username">
        <el-input v-model.number="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="goLogin">去登录</el-button>
    </el-form-item>
</el-form>
 </div>
</template>

<script>
import {register} from '@/api/login';
export default {
 data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
        form:{
            username:"",
            nickname:"",
            password:"",
            checkpass:"",
        },
        rules:{
            username:[
                { required: true, message: '用户名', trigger: 'blur' }
            ],
            nickname:[
                { required: true, message: '昵称', trigger: 'blur' }
            ],
            pass: [
                { validator: validatePass, trigger: 'blur' }
            ],
          checkPass: [
                { validator: validatePass2, trigger: 'blur' }
            ],
        }
 }
 },

 components: {},

 methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(this.form.username,this.form.nickname,this.form.pass).then((response)=>{
                const resp = response.data;
                // console.log(resp);
                if(resp.flag){
                  // 跳转到登录界面
                  this.$router.push("/login")
                }else{
                  this.$message({
                  message: resp.message,
                  type: 'warning'
                  });
                }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      goLogin(){
        this.$router.push("/login");
      }
    }
}
</script>

<style scoped>
    .register-container{
        position:absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: url(../../assets/bg.jpg);
        background-size: cover;
    }
    .register-form{
        width: 350px;
        margin: 160px auto;
        background-color: rgba(255,255,255,0.5);
        padding: 30px;
        border-radius: 20px;
    }
    h2{
        text-align: center;
    }
</style>