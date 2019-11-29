<template>
    <div class="login-container">

        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">

            <h3 class="title">系统登录</h3>

            <el-form-item prop="username">
                <span class="icon-container">
                    <i class="fa fa-user" style="" aria-hidden="true"></i>
                </span>
                <el-input name="username" type="text" v-model.trim="loginForm.username" :maxlength="18" clearable placeholder="用户名"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                  <span class="icon-container">
                      <i class="fa fa-unlock-alt" aria-hidden="true"></i>
                  </span>
                  <el-input name="password" type="password" @keyup.enter.native="userLogin" v-model="loginForm.password" :maxlength="18" show-password placeholder="密码"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="isLoading" @click.native.prevent="userLogin">
                    {{isLoading?'登录中':'登录'}}
                </el-button>
            </el-form-item>

        </el-form>

    </div>
</template>

<script>

    export default {
        name: 'LoginPage',
        data() {
            const validateUser = (rule, value, callback) => {
                if (value.length < 1) {
                    callback(new Error('请输入用户名'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length < 1) {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    username: 'super',
                    password: 'z'
                },
                loginRules: {
                    username: [{
                        required: true,
                        trigger: 'blur',
                        validator: validateUser
                    }],
                    password: [{
                        required: true,
                        trigger: 'blur',
                        validator: validatePass
                    }]
                },
                isLoading: false,
                redirect: ''
            }
        },
        watch: {
            $route: {
                handler: function(route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        methods: {
            userLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        this.$store.dispatch('user/userLogin', this.loginForm).then(() => {
                            this.isLoading = false;
                            !this.redirect && this.$store.dispatch('tagViews/resetTags');
                            this.$router.replace({path: this.redirect || '/Home'});
                        }).catch(err => {
                            this.isLoading = false;
                            this.$message({
                                message: err,
                                type: 'error'
                            });
                        });
                    } else {
                        this.$message({
                            message: '请正确填写用户名和密码',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .login-container {
        position: relative;
        height: 100vh;
        background-color: #2d3a4b;

        input {
            border: 0;
            border-radius: 0;
            padding: 12px 5px 12px 15px;
            font-size: 15px;
            letter-spacing: 1px;
            color: #eee;
            -webkit-appearance: none;
            background: transparent;
        }

        .el-input {
            display: inline-block;
            height: 47px;
            line-height: 47px;
            width: 85%;
        }

        .icon-container {
            font-size: 20px;
            vertical-align: middle;
            padding: 6px 5px 6px 15px;
            color: #889aa4;
        }

        .title {
            font-size: 26px;
            margin: 0 auto 40px;
            text-align: center;
            font-weight: bold;
            letter-spacing: 5px;
            color: #eee;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px;
            margin: 150px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

    }
</style>
