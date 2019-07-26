<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div class="imgBox">
                <img src="@/assets/acm.png" alt="" width="100%">
            </div>
            <div class="page-title">
                <b>User Login</b>
            </div>
            <el-divider><i class="el-icon-postcard"></i></el-divider>
            <div class="form-box">
                <el-form :model="FormData" status-icon :rules="rules" ref="FormData" class="demo-ruleForm">
                    <el-form-item prop="username">
                        <el-input
                                v-model="FormData.username"
                                placeholder="Please enter your username."
                                prefix-icon="el-icon-user">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password"
                                  v-model="FormData.password"
                                  placeholder="Please enter your password."
                                  prefix-icon="el-icon-key">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="submitBox">
                            <el-button class="submitButton" type="primary" @click="submitForm('FormData')">Login</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'login-page',
  data () {
    return {
      FormData: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: 'Please enter your username!', trigger: 'blur' }],
        password: [{ required: true, message: 'Please enter your password!', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.commit('login', {username: this.FormData.username, password: this.FormData.password})
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
    .box-card{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 400px;
    }
    .imgBox{
        position: absolute;
        margin-top: 10px;
        left: 50%;
        transform: translate(-50%,0);
    }
    .form-box{
        width: 80%;
        float: left;
        transform: translate(12%,0);
    }
    .page-title{
        width: 100%;
        margin-top: 150px;
        margin-bottom: 20px;
        text-align: center;
        font-size: 30px;
    }
    .submitBox{
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .submitButton{
        width: 100%;
        height: auto;
    }
</style>
