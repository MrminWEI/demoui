<template>
    <div class="app-container">
        <!-- 条件筛选 -->
        <fieldset class="fieldset">
            <legend class="legend">查询条件</legend>
            <div class="field-box">
                <el-form :inline="true" :model="listQuery">
                    <el-form-item label="表名称" prop="tableNameLike" class="filter-item">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="表名称"
                                  v-model="listQuery.tableNameLike"></el-input>
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
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column align="center" label="表类型" width="100" prop="tableType" :formatter="tableTypeFormatter">
            </el-table-column>
            <el-table-column width="210px" align="center" label="表名" prop="tableName">
            </el-table-column>
            <el-table-column width="150px" align="center" label="表描述" prop="tableTxt">
            </el-table-column>
            <el-table-column width="150px" align="center" label="表分类" prop="tablePurpsoe" :formatter="tablePurpsoeFormatter">
            </el-table-column>
<!--            <el-table-column width="150px" align="center" label="版本" prop="tableVersion">
            </el-table-column>-->
            <el-table-column width="150px" align="center" label="同步数据库状态" prop="isDbSynch" >
                <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.isDbSynch=='0'">未同步</el-tag>
                    <el-tag type="success" v-else-if="scope.row.isDbSynch=='1'">已同步</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="180px" align="center" label="创建时间" prop="createTime">
            </el-table-column>
            <el-table-column align="center" label="操作" width="440px" :fixed="needFixedRight?'right':needFixedRight">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
                    <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="success" @click="updateField(scope.row)">编辑字段</el-button>
                    <el-button size="mini" @click="viewTableData(scope.row)">表单数据</el-button>

                    <el-button size="mini" :disabled="scope.row.isDbSynch==1" type="success" @click="snycTable(scope.row)">同步表</el-button>
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
                   @close="closeDialog" width="50%"  v-el-drag-dialog>
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
                     <el-form-item label="表名称" prop="tableName">
                         <el-input v-model="form.tableName" :disabled="dialogStatus=='view'" placeholder="请输入表名称" ></el-input>
                     </el-form-item>
                     <el-form-item label="表类型" prop="tableType">
                         <el-select class="filter-item" v-model="form.tableType" placeholder="请选择表类型"
                                    :disabled="dialogStatus=='view'" clearable>
                             <el-option v-for="item in  tableTypeOptions" :key="item.value" :label="item.text"
                                        :value="item.value"></el-option>
                         </el-select>
                     </el-form-item>
                    <el-form-item label="表分类" prop="tablePurpsoe">
                        <el-select class="filter-item" v-model="form.tablePurpsoe" placeholder="请选择表分类"
                                   :disabled="dialogStatus=='view'" clearable>
                            <el-option v-for="item in  tablePurpsoeMap" :key="item.value" :label="item.text"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="表说明"  prop="tableTxt">
                         <el-input v-model="form.tableTxt" :disabled="dialogStatus=='view'" placeholder="请输入表说明"></el-input>
                     </el-form-item>
                    <el-form-item label="子表"  prop="subTableStr">
                        <el-input v-model="form.subTableStr" :disabled="dialogStatus=='view'" placeholder="请输入子表"></el-input>
                    </el-form-item>
                    <el-form-item label="表单模板"  prop="formTemplate">
                        <el-input v-model="form.formTemplate" :disabled="dialogStatus=='view'" placeholder="请输入表单模板"></el-input>
                    </el-form-item>
                    <el-form-item prop="fromLayout"  label="表格布局">
                        <el-select class="filter-item" v-model="form.fromLayout" placeholder="请选择表格布局"
                                   :disabled="dialogStatus=='view'" clearable>
                            <el-option v-for="item in  fromLayoutMap" :key="item.value" :label="item.text"
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

        <!--对话框组件er-->
        <el-dialog  :visible.sync="dialogFormVisible2" :close-on-click-modal="false"
                    fullscreen center v-el-drag-dialog>
            <tableField v-bind:isDbSynch="isDbSynchValue" v-bind:cgformHeadId="cgformHeadIdValue" v-if="dialogFormVisible2"></tableField>


        </el-dialog>
        <el-dialog title="表单数据" :visible.sync="formDataLoading" fullscreen>
            <formTemp :headId="selectHeadId" v-if="formDataLoading"></formTemp>
        </el-dialog>
    </div>
</template>

<script>
    import {
        page,
        addObj,
        getObj,
        putObj,
        delObjs,
        checkCgformHead,
        createTable
    } from "api/admin/system/formTable/index";
    import {mapGetters} from "vuex";
    import {fillterText, findParentNode} from "utils/index";
    import {validateLowerCase2} from "utils/validate";
    import {loadGridHeight} from "utils/screen";
    import  formTemp from '../formData/index'
    import  tableField from './tableField.vue'


    export default {
        name: "formTable",
        components: {
            tableField,formTemp
        },
        data() {
            const validateTableName = (rule, value, callback) => {
                if (this.dialogStatus == "update") {
                    if (this.oldTableName == this.form.tableName) {
                        callback();
                    } else {
                        checkCgformHead({
                            tableName: value.trim()
                        }).then(response => {
                            if (response.data) {
                                callback("表名不能重复");
                            } else {
                                callback();
                            }
                        });
                    }
                } else {
                    checkCgformHead({
                        tableName: value.trim()
                    }).then(response => {
                        if (response.data) {
                            callback("表名不能重复");
                        } else {
                            callback();
                        }
                    });
                }
            };
            return {

                cgformHeadIdValue:"",
                isDbSynchValue:'',

                height: undefined,
                needFixedRight: false,
                oldEnterprisesNo: undefined,
                oldEnterprisesName:undefined,
                tableKey: 0,
                userSelection: [],
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    tableNameLike: undefined,
                },
                form: {
                    cgformHeadId: undefined,
                    tableName: undefined,
                    tableType: undefined,
                    tableTxt: undefined,
                    formCategory:'BDFL_PTBD',
                    subTableStr:undefined,
                    formTemplate:undefined,
                    isDbSynch:undefined
                },
                rules: {
                    tableName: [{
                        required: true,
                        message: "请输入表名",
                        trigger: "blur"
                    },
                        {validator: validateLowerCase2, trigger: "blur"},
                        {validator: validateTableName, trigger: "blur"},
                        {max: 50, message: "长度不能超过50个字符", trigger: "blur"}],
                    tableTxt: [{
                        required: true,
                        message: "请输入表说明",
                        trigger: "blur"
                    },{max: 50, message: "长度不能超过50个字符", trigger: "blur"}],
                    tableType: [{required: true,message: "请选择表类型",trigger: "blur"}],
                    subTableStr: [{max: 100, message: "长度不能超过100个字符", trigger: "blur"}],
                    formTemplate: [{max: 50, message: "长度不能超过50个字符", trigger: "blur"}]
                },
                dialogFormVisible: false,
                dialogFormVisible2:false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建",
                    view: "查看"
                },
                tablePurpsoeMap: [{text: '业务表', value: '1'}, {text: '工作流表', value: '2'}],
                fromLayoutMap: [{text: 'N*1', value: 1}, {text: 'N*2', value: 2}],
                formDataLoading:false,

            };
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters(["dict"]),
            tableTypeOptions() {
                return this.dict["表类型"];
            },
            isDbSynchOptions() {
                return this.dict["同步状态"];
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
                getObj(row.cgformHeadId).then(response=>{
                    this.form=response.data;
                })
                this.dialogFormVisible = true;
                this.dialogStatus = "view";
            },
            snycTable(row){
                this.$confirm("此操作将同步表, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(()=>{
                    createTable({"tableId":row.cgformHeadId}).then(data=>{
                        if (data.code ==0){
                            this.$notify({
                                title: "成功",
                                message: "同步成功",
                                type: "success",
                                duration: 2000
                            });
                        } else{
                            this.$notify({
                                title: "失败",
                                message: "同步失败",
                                type: "error",
                                duration: 2000
                            });
                        }
                    })
                }).catch(() => {
                });;

            },
            viewTableData(row){
                this.selectHeadId=row.cgformHeadId
                this.formDataLoading=true;
            },
            updateField(row){
                this.cgformHeadIdValue=row.cgformHeadId;
                this.isDbSynchValue=row.isDbSynch;
                this.dialogFormVisible2 = true;
                this.dialogStatus = "update";
            },
            handleUpdate(row) {
                getObj(row.cgformHeadId).then(response=>{
                    this.form=response.data;
                    this.oldTableName=response.data.tableName;
                })
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
                        this.userSelection.forEach(data => {
                            idArr.push(data.cgformHeadId);
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
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        addObj(this.form).then(() => {
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
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false;
                        putObj(this.form.cgformHeadId, this.form).then(() => {
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
                    cgformHeadId: undefined,
                    tableName: undefined,
                    tableType: undefined,
                    tableTxt: undefined,
                    formCategory:'BDFL_PTBD',
                    subTableStr:undefined,
                    formTemplate:undefined,
                    isDbSynch:undefined
                };
            },
            resetQuery() {
                this.listQuery = {
                    tableNameLike: undefined

                };
            },
            getSelection(selection) {
                this.userSelection = selection;
            },
            tableTypeFormatter(row, column, cellValue) {
                return fillterText(cellValue, this.dict['表类型']);
            },
            isDbSynchFormatter(row, column, cellValue) {
                return fillterText(cellValue, this.dict['同步状态']);
            },
            tablePurpsoeFormatter(row, column, cellValue) {
              return fillterText(cellValue, this.tablePurpsoeMap);
            },

        }
    };
</script>

