<template>
    <div class="app-container">
        <!-- 条件筛选 -->
        <fieldset class="fieldset">
            <legend class="legend">查询条件</legend>
            <div class="field-box">
                <el-form :inline="true" :model="listQuery">
                    <el-form-item label="企业名称" prop="enterprisesNameLike" class="filter-item">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="企业名称"
                                  v-model="listQuery.enterprisesNameLike"></el-input>
                    </el-form-item>
                    <el-form-item label="企业状态" prop="status" class="filter-item">
                        <el-select v-model="listQuery.status" placeholder="请选择企业状态">
                            <el-option v-for="item in  statusOptions" :key="item.value" :label="item.text"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filter-item">
                        <el-button type="primary" @click="handleFilter">搜索</el-button>
                        <el-button @click="resetQuery()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </fieldset>

        <!-- 表头操作块 -->
        <div class="head-box">
            <div class="item-box">
                <span class="mg-r-15 head-item" @click.stop.prevent="handleCreate"><i
                    class="fa fa-plus-square menu-icon vam" aria-hidden="true"></i>添加</span>
                <span class="mg-r-15 head-item" @click.stop.prevent="handleDelete"><i
                    class="fa fa-window-close menu-icon vam" aria-hidden="true"></i>删除</span>
            </div>
        </div>
        <!--表格组件-->
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border highlight-current-row
                  style="width: 100%" @selection-change="getSelection" :row-class-name="tableRowClassName"
                  :height="height" :header-cell-style="{'background-color': '#fafafa'}">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column align="center" label="企业编号" width="100" prop="enterprisesNo">
            </el-table-column>
            <el-table-column width="210px" align="center" label="企业名称" prop="enterprisesName">
            </el-table-column>
            <el-table-column width="150px" align="center" label="所属地区" prop="areaId" :formatter="areaFormatter">
            </el-table-column>
            <el-table-column width="150px" align="center" label="企业类型" prop="enterprisesType"
                             :formatter="enterprisesTypeFormatter">
            </el-table-column>
            <el-table-column width="150px" align="center" label="详细地址" prop="enterprisesAddress">
            </el-table-column>
            <el-table-column width="150px" align="center" label="企业描述" prop="enterprisesDesc">
            </el-table-column>
            <el-table-column width="150px" align="center" label="企业负责人" prop="enterprisesLeading">
            </el-table-column>
            <el-table-column width="150px" align="center" label="联系电话" prop="enterprisesTel">
            </el-table-column>
            <el-table-column width="180px" align="center" label="创建时间" prop="createTime">
            </el-table-column>
            <el-table-column width="110px" align="center" label="状态" :formatter="statusFormatter" prop="status">
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px" :fixed="needFixedRight?'right':needFixedRight">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleView(scope.row)">查看</el-button>
                    <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!--对话框组件-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
                   @close="closeDialog">
            <div slot="title">
                <template v-if="textMap[dialogStatus] === '创建'">
                    <i class="el-icon-document"> {{textMap[dialogStatus]}}</i>
                </template>
                <template v-else-if="textMap[dialogStatus] === '编辑'">
                    <i class="el-icon-edit"> {{textMap[dialogStatus]}}</i>
                </template>
                <template v-else="textMap[dialogStatus] === '查看'">
                    <i class="el-icon-view"> {{textMap[dialogStatus]}}</i>
                </template>
            </div>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="企业编号" prop="enterprisesNo">
                    <el-input v-model="form.enterprisesNo" :disabled="dialogStatus=='view'" placeholder="请输入企业编号" ></el-input>
                </el-form-item>
                <el-form-item label="企业名称" prop="enterprisesName">
                    <el-input v-model="form.enterprisesName" placeholder="请输入企业名称"
                              :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="所属区域" prop="selectAreaOptions">
                    <el-cascader
                        v-model="form.selectAreaOptions"
                        :options="areaOptions"
                        :disabled="dialogStatus=='view'"
                        clearable
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="企业负责人"  prop="enterprisesLeading">
                    <el-input v-model="form.enterprisesLeading" :disabled="dialogStatus=='view'" placeholder="请输入企业负责人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话"  prop="enterprisesTel">
                    <el-input v-model="form.enterprisesTel" :disabled="dialogStatus=='view'" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="enterprisesAddress">
                    <el-input v-model="form.enterprisesAddress" :disabled="dialogStatus=='view'" placeholder="请输入详细地址" ></el-input>
                </el-form-item>
                <el-form-item label="企业描述"  prop="enterprisesDesc">
                    <el-input v-model="form.enterprisesDesc" :disabled="dialogStatus=='view'"placeholder="请输入企业描述"></el-input>
                </el-form-item>
                <el-form-item label="企业类型" prop="enterprisesType">
                    <el-select class="filter-item" v-model="form.enterprisesType" placeholder="请选择企业类型"
                               :disabled="dialogStatus=='view'" clearable>
                        <el-option v-for="item in  enterprisesTypeOptions" :key="item.value" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="dialogStatus!='view'">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        page,
        addSysObj,
        getObj,
        delObjs,
        putSysObj,
        checkEnterprises,
        getAreaTree,
        getAreaMap
    } from "api/admin/organizations/enterprises/index";
    import {mapGetters} from "vuex";
    import {fillterText, findParentNode} from "utils/index";
    import {spacelValidator,validatPhone2} from "utils/validate";
    import {loadGridHeight} from "utils/screen";

    export default {
        name: "enterprises",
        data() {
            const enterprisesNoValidator = (rule, value, callback) => {
                if (this.dialogStatus == "update") {
                    if (this.oldEnterprisesNo == this.form.enterprisesNo) {
                        callback();
                    } else {
                        checkEnterprises({
                            enterprisesNo: value.trim()
                        }).then(response => {
                            if (response.data) {
                                callback("企业编码不能重复");
                            } else {
                                callback();
                            }
                        });
                    }
                } else {
                    checkEnterprises({
                        enterprisesNo: value.trim()
                    }).then(response => {
                        if (response.data) {
                            callback("企业编码不能重复");
                        } else {
                            callback();
                        }
                    });
                }
            };
            const enterprisesNameValidator = (rule, value, callback) => {
                if (this.dialogStatus == "update") {
                    if (this.oldEnterprisesName == this.form.enterprisesName) {
                        callback();
                    } else {
                        checkEnterprises({
                            enterprisesName: value.trim()
                        }).then(response => {
                            if (response.data) {
                                callback("企业名称不能重复");
                            } else {
                                callback();
                            }
                        });
                    }
                } else {
                    checkEnterprises({
                        enterprisesName: value.trim()
                    }).then(response => {
                        if (response.data) {
                            callback("企业名称不能重复");
                        } else {
                            callback();
                        }
                    });
                }
            };
            const numberValidator = (rule, value, callback) => {
                const reg = /^\+?[1-9][0-9]*$/;
                if (reg.test(value.trim())) {
                    callback("不能输入纯数字");
                } else {
                    callback();
                }
            };
            return {
                height: undefined,
                needFixedRight: false,
                oldEnterprisesNo: undefined,
                oldEnterprisesName:undefined,
                tableKey: 0,
                userSelection: [],
                areaMap: [],
                areaOptions: [],
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    enterprisesNameLike: undefined,
                    status: "1" //只查询有效的数据
                },
                form: {
                    enterprisesNo: undefined,
                    enterprisesName: undefined,
                    enterprisesLeading: undefined,
                    enterprisesTel: undefined,
                    enterprisesAddress: undefined,
                    enterprisesType: undefined,
                    areaId: undefined,
                    enterprisesDesc: undefined,
                    status: undefined,
                    createOpId:undefined,
                    createTime:undefined,
                    selectAreaOptions: []
                },
                rules: {
                    enterprisesName: [{
                        required: true,
                        message: "请输入企业名称",
                        validator: spacelValidator,
                        trigger: "blur"
                    }, {max: 128, message: "长度不能超过128个字符", trigger: "blur"},{validator:enterprisesNameValidator,trigger:"blur"}],
                    enterprisesNo: [{
                        required: true,
                        validator: spacelValidator,
                        message: "请输入企业编号",
                        trigger: "blur"
                    },{max: 32, message: "长度不能超过32个字符", trigger: "blur"},{validator: enterprisesNoValidator, trigger: "blur"}],
                    enterprisesTel: [{validator: validatPhone2, trigger: "blur"}],
                    enterprisesLeading: [{max: 128, message: "长度不能超过128个字符", trigger: "blur"}],
                    enterprisesDesc: [{max: 256, message: "长度不能超过256个字符", trigger: "blur"}],
                    enterprisesAddress: [{max: 256, message: "长度不能超过256个字符", trigger: "blur"}]
                },
                dialogFormVisible: false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建",
                    view: "查看"
                },
            };
        },
        created() {
            this.getList();
            this.getAreaMap();
            this.getAreaTree();
        },
        computed: {
            ...mapGetters(["dict"]),
            statusOptions() {
                return this.dict["状态"];
            },
            enterprisesTypeOptions() {
                return this.dict["企业类型"];
            }
        },
        mounted() {
            this.height = loadGridHeight();
            //首次整个视图都渲染完毕后执行
            this.$nextTick(function () {
                let tableDiv = this.$el.querySelector('.el-table__body-wrapper');
                this.needFixedRight = !($(tableDiv).attr("class").indexOf("is-scrolling-none") >= 0);
            });
            //监听屏幕的改变
            window.onresize = () => {
                let tableDiv = this.$el.querySelector('.el-table__body-wrapper');
                this.needFixedRight = !($(tableDiv).attr("class").indexOf("is-scrolling-none") >= 0);
                this.height = loadGridHeight();
            }

        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.status === '0') {
                    return 'warning-row';
                } else if (row.status === '1') {
                    return 'success-row';
                }
                return '';
            },
            getList() {
                this.listLoading = true;
                page(this.listQuery).then(response => {
                    this.list = response.rows;
                    this.total = response.total;
                    this.listLoading = false;
                });
            },
            getAreaMap() {
                getAreaMap().then(data => {
                    this.areaMap = data.data;
                })
            },
            getAreaTree() {
                getAreaTree().then(response => {
                    this.areaOptions = response;
                })
            },
            handleFilter() {
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleCreate() {
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
            },
            handleView(row) {
                let str = findParentNode(this.areaOptions, row.areaId);
                this.form.selectAreaOptions = str.split(",");
                this.form.selectAreaOptions.push(row.areaId + '');
                this.form.selectAreaOptions.splice(0, 1);
                getObj(row.enterprisesId).then(response=>{
                    this.form.enterprisesId=response.data.enterprisesId;
                    this.form.enterprisesNo=response.data.enterprisesNo;
                    this.form.enterprisesName=response.data.enterprisesName;
                    this.form.enterprisesLeading=response.data.enterprisesLeading;
                    this.form.enterprisesTel=response.data.enterprisesTel;
                    this.form.enterprisesAddress=response.data.enterprisesAddress;
                    this.form.enterprisesType=response.data.enterprisesType;
                    this.form.enterprisesDesc=response.data.enterprisesDesc;
                });
                this.dialogFormVisible = true;
                this.dialogStatus = "view";
            },
            handleUpdate(row) {
                if(row.areaId !=null){
                    let str = findParentNode(this.areaOptions, row.areaId);
                    this.form.selectAreaOptions = str.split(",");
                    this.form.selectAreaOptions.push(row.areaId + '');
                    this.form.selectAreaOptions.splice(0, 1);
                }
                getObj(row.enterprisesId).then(response=>{
                    this.form.enterprisesId=response.data.enterprisesId;
                    this.form.enterprisesNo=response.data.enterprisesNo;
                    this.form.enterprisesName=response.data.enterprisesName;
                    this.form.enterprisesLeading=response.data.enterprisesLeading;
                    this.form.enterprisesTel=response.data.enterprisesTel;
                    this.form.enterprisesAddress=response.data.enterprisesAddress;
                    this.form.enterprisesType=response.data.enterprisesType;
                    this.form.status=response.data.status;
                    this.form.createOpId=response.data.createOpId;
                    this.form.createTime=response.data.createTime;
                    this.form.enterprisesDesc=response.data.enterprisesDesc;
                    this.oldEnterprisesNo = this.form.enterprisesNo;
                    this.oldEnterprisesName = this.form.enterprisesName;
                });
                this.dialogFormVisible = true;
                this.dialogStatus = "update";
            },
            handleDelete() {
                if (!this.userSelection.length) {
                    this.$message({
                        showClose: true,
                        message: "请先选择一条信息！"
                    });
                    return;
                }
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        const idArr = [];
                        this.userSelection.forEach(enterprises => {
                            idArr.push(enterprises.enterprisesId);
                        });
                        delObjs(idArr.join(","))
                            .then(() => {
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    type: "success",
                                    duration: 2000
                                });
                                this.getList();
                            })
                            .catch(() => {
                            });
                    })
                    .catch(() => {
                    });
            },
            create(formName) {
                if(typeof  this.form.selectAreaOptions !=="undefined" && this.form.selectAreaOptions.length>0){
                    let opt = this.form.selectAreaOptions;
                    this.form.areaId = opt[opt.length - 1];
                }else{
                    this.form.areaId ="";
                }
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addSysObj(this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                                title: "成功",
                                message: "创建成功",
                                type: "success",
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancel(formName) {
                this.dialogFormVisible = false;
            },
            update(formName) {
                if(typeof  this.form.selectAreaOptions !=="undefined" && this.form.selectAreaOptions.length>0){
                    let opt = this.form.selectAreaOptions;
                    this.form.areaId = opt[opt.length - 1];
                }else{
                    this.form.areaId ="";
                }
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        putSysObj(this.form.enterprisesId, this.form).then(() => {
                            this.dialogFormVisible = false;
                            this.getList();
                            this.$notify({
                                title: "成功",
                                message: "创建成功",
                                type: "success",
                                duration: 2000
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            //在关闭对话框时调用清除表单验证方法
            closeDialog() {
                this.resetForm();
            },
            //重置表单验证和表单数据
            resetForm() {
                this.$nextTick(function () {
                    this.$refs["form"].clearValidate();
                });
                this.form = {
                    enterprisesId: undefined,
                    enterprisesNo: undefined,
                    enterprisesName: undefined,
                    enterprisesLeading: undefined,
                    enterprisesTel: undefined,
                    enterprisesAddress: undefined,
                    enterprisesType: undefined,
                    areaId: undefined,
                    enterprisesDesc: undefined
                };
            },
            resetQuery() {
                this.listQuery = {
                    status: "1",
                    enterprisesNameLike: undefined

                };
            },
            getSelection(selection) {
                this.userSelection = selection;
            },
            statusFormatter(row, column, cellValue) {
                return fillterText(cellValue, this.dict['状态']);
            },
            areaFormatter(row, column, cellValue) {
                return fillterText(cellValue, this.areaMap);
            },
            enterprisesTypeFormatter(row, column, cellValue) {
                return fillterText(cellValue, this.dict['企业类型']);
            },

        }
    };
</script>

