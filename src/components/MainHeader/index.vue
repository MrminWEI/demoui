<template>
    <div class="page-container">
        <!-- LOGO -->
        <div>
            <span class="title">快速开发平台</span>
        </div>

        <!-- 下拉菜单 -->
        <div class="e-dropdown">
            <el-dropdown @command="handleCommand">
                <div class="user-info">
                    欢迎您，{{userInfo.realName}}
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="goHome">
                        <i class="fa fa-undo" aria-hidden="true"></i>
                        回到首页
                    </el-dropdown-item>
                    <el-dropdown-item :command="resetPassword">
                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                        修改密码
                    </el-dropdown-item>
                    <el-dropdown-item :command="logout">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                        退出登录
                    </el-dropdown-item>
                    <el-dropdown-item :command="systemSetting" divided>
                        <i class="fa fa-cog" aria-hidden="true"></i>
                        系统设置
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <!-- 修改密码框 -->
        <el-dialog v-el-drag-dialog title="修改密码" :visible.sync="dialogVisible" @close="closeDialog" width="30%"
                   :close-on-click-modal="false" modal-append-to-body append-to-body>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="旧密码" prop="userPwd_old">
                    <el-input type="password" v-model="form.userPwd_old" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="userPwd">
                    <el-input type="password" v-model="form.userPwd" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="userPwd2">
                    <el-input type="password" v-model="form.userPwd2" placeholder="确认新密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="updatePass()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'MainHeader',
        props: {},
        data() {
            const confirmPass = (rule, p2, callback) => {
                if (this.form.userPwd !== p2) {
                    callback(new Error('确认密码不一致'))
                } else callback();
            };
            const contrastPass = (rule, newPassword, callback) => {
                if (this.form.userPwd_old === newPassword) {
                    callback(new Error('旧密码与输入的新密码一致'))
                } else callback();
            };
            return {
                dialogVisible: false,
                form: {userPwd: '', userPwd_old: '', userPwd2: ''},
                rules: {
                    userPwd_old: [{required: true, message: "请输入旧密码", trigger: "blur"}],
                    userPwd: [{required: true, message: "请输入新密码", trigger: "blur"},
                        {validator: contrastPass, message: "旧密码与输入的新密码一致", trigger: "blur"}],
                    userPwd2: [{required: true, message: "请确认新密码", trigger: "blur"},
                        {validator: confirmPass, message: "确认密码不一致", trigger: "blur"}
                    ]
                }
            };
        },
        components: {},
        mounted() {
        },
        methods: {
            handleCommand(command) {
                command();
            },
            goHome() {
                this.$router.replace('/Home');
            },
            closeDialog() {
                this.$refs['form'].resetFields();
            },
            updatePass() {

                this.$refs['form'].validate(valid => {
                    if (valid) {
                        const param = {userId:this.userInfo.userId, userPwd_old:this.form.userPwd_old, userPwd:this.form.userPwd};
                        this.$store.dispatch('user/resetPwd', param).then(()=>{
                            this.dialogVisible = false;
                            this.$alert('密码修改成功，请重新登录', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$store.dispatch('user/logout').then(() => {
                                        this.$router.replace('/LoginPage');
                                        // 需重载页面清空addRoutes里的异步路由
                                        window.location.reload();
                                    }).catch(e => {
                                        this.$message.error(e);
                                    });
                                }
                            });
                        }).catch(e=>{
                            this.$message.error(e);
                        });
                    } else {
                        this.$message.error('请按提示正确填写密码。');
                        return false;
                    }
                });
            },
            resetPassword() {
                this.dialogVisible = true;
            },
            logout() {
                this.$confirm('确定退出系统吗?', '提示', {
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('user/logout').then(() => {
                        this.$router.replace('/LoginPage');
                        // 需重载页面清空addRoutes里的异步路由
                        window.location.reload();
                    }).catch(e => {
                        this.$message.error(e);
                    });
                }).catch(() => {
                });
            },
            systemSetting() {
                this.$store.dispatch('sysSetting/changeSettingState');
            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        }
    }
</script>

<style scoped lang="scss">

    .page-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        color: #fff;
        user-select: none;
        overflow: hidden;
    }

    .title {
        vertical-align: middle;
        letter-spacing: 2px;
        font-size: 25px;
    }

    .user-info {
        font-size: 14px;
        color: #fff;
        cursor: pointer;
    }

    @media screen and (max-width: 450px){
        .e-dropdown {
            display: none;
        }
    }

</style>
