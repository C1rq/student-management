<template>
  <div class="header">
    <a href="#">
      <img src="@/assets/logo.png" alt="" width="25px" class="logo" />
      <span class="title">学院管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        lable-width="100px"
        style="width: 400px"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login.js";
import passwordApi from "@/api/password.js";
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    var validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // user://JSON.parse(localStorage.getItem("ssm-user")),
      user: this.$store.state.user.user,
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass: [
          { validator: validateOldPass, trigger: "blur" },
          { required: true, message: "原始密码不能为空", trigger: "blur" },
        ],
        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [
          { validator: validatePass, trigger: "change" },
          { required: true, message: "确认密码不能为空", trigger: "blur" },
        ],
      },
    };
  },

  components: {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.pass)
            .then((response) => {
              const resp = response.data;
              this.$message({
                message: resp.message,
                type: resp.flag ? "success" : "error",
              });
              if (resp.flag) {
                this.handleLogout();
                this.dialogFormVisible = false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handleLogout() {
      this.$store.dispatch("Logout").then((response) => {
        if (response.flag) {
          this.$router.push("/login");
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
            duration: 5 * 1000,
          });
        }
      });

      // logout(localStorage.getItem("ssm-token")).then((response) => {
      //   const resp = response.data;
      //   if (resp.flag) {
      //     localStorage.removeItem("ssm-token");
      //     localStorage.removeItem("ssm-user");
      //     this.$router.push("/login");
      //   } else {
      //     this.$message({
      //       message: resp.message,
      //       type: "warning",
      //     });
      //   }
      // });
    },
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
  },
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
  position: absolute;
  left: 10px;
  top: 15px;
}
.title {
  position: absolute;
  color: #fff;
  left: 85px;
  /* text-align: center; */
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style>
