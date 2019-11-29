<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="数据库属性" name="dbField">
                <!-- 页面内容 -->
                <div style="width: 100%; height: 67vh;">
                    <el-form  class="divForm" :model="inServForm" ref="inServForm" :rules="inServFormRules">
                        <el-table :data="inServForm.infiledList" v-loading="listLoading" border
                                   highlight-current-row fit   :header-cell-style="{'background-color': '#fafafa'}" height="57vh">
                            <el-table-column width="50px" align="left" label="#">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column    align="left" label="字段名字" prop="dbFieldTxt">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.dbFieldTxt'"
                                                  :rules="inServFormRules.dbFieldTxtRules">
                                        <el-input v-model="scope.row.dbFieldTxt" placeholder="字段名字" maxlength="15"
                                                  :disabled="isDbSynchFlag && scope.$index<listSize ||　scope.$index <disableSize"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column   align="left" label="字段长度" prop="dbLength">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.dbLength'"
                                                  :rules="inServFormRules.dbLengthRules">
                                        <el-input v-model="scope.row.dbLength" placeholder="字段长度" maxlength="10"
                                                  :disabled="isDbSynchFlag && scope.$index<listSize ||　scope.$index <disableSize"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left"  label="是否为空" prop="dbIsNull">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.dbIsNull'">
                                        <el-select v-model="scope.row.dbIsNull" clearable size="mini"
                                                   :disabled="isDbSynchFlag && scope.$index<listSize ||　scope.$index <disableSize">
                                            <el-option v-for="item in isorNotMap" :key="item.value" :label="item.text"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="默认值" prop="dbDefaultVal">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.dbDefaultVal'">
                                        <el-input v-model="scope.row.dbDefaultVal" placeholder="默认值" maxlength="20"
                                                  :disabled="isDbSynchFlag && scope.$index<listSize ||　scope.$index <disableSize"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="表单控件类型" prop="fieldShowType">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.fieldShowType'"
                                                  :rules="inServFormRules.fieldShowTypeRules">
                                        <el-select v-model="scope.row.fieldShowType" size="mini"
                                                   :disabled="isDbSynchFlag && scope.$index<listSize ||　scope.$index <disableSize">
                                            <el-option v-for="item in fieldShowTypeMap" :key="item.id"
                                                       :label="item.text"
                                                       :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left"style="height: 40px"  label="字典CODE" prop="dictField">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.dictField'"
                                                  v-if="scope.row.fieldShowType=='4'||scope.row.fieldShowType=='10'||scope.row.fieldShowType=='7'"
                                                  :rules="dictFieldRules">
                                        <el-input v-model="scope.row.dictField" placeholder="字典CODE" maxlength="20"
                                                  :disabled="isDbSynchFlag  && scope.$index<listSize ||　scope.$index <disableSize"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.dictField'"
                                                  v-if="scope.row.fieldShowType !='4'&&scope.row.fieldShowType !='10'&&scope.row.fieldShowType !='7'">
                                        <el-input v-model="scope.row.dictField" placeholder="字典CODE" maxlength="20"
                                                  :disabled="true||isDbSynchFlag  && scope.$index<listSize ||　scope.$index <disableSize"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="操作" >
                                <template slot-scope="scope">
                                    <el-form-item    >
                                        <el-button size="small"  icon="el-icon-delete" type="danger"
                                                   :disabled="scope.$index <disableSize"
                                                   @click="deleteRow(scope.$index,scope.row)" >移除</el-button>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </div>
            </el-tab-pane>


            <el-tab-pane label="控件属性" name="commandField">
                <div style="width: 100%; height: 67vh;">
                    <el-form class="divForm">
                        <el-table :data="inServForm.infiledList" v-loading="listLoading" border
                                  highlight-current-row  fit  :header-cell-style="{'background-color': '#fafafa'}" height="57vh">
                            <el-table-column width="50px" align="left" label="#">
                                <template slot-scope="scope">
                                    <span style="width: 50px;"> {{scope.$index+1}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="字段名字" prop="dbFieldTxt">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'infiledList.' + scope.$index + '.dbFieldTxt'">
                                        <el-input style="width: 200px;" v-model="scope.row.dbFieldTxt"
                                                  placeholder="字段名字" maxlength="15"
                                                  :disabled="isDbSynchFlag && scope.$index<listSize ||　scope.$index <disableSize"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="是否查询条件" prop="isQuery">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.isQuery'">
                                        <el-select v-model="scope.row.isQuery" clearable size="mini">
                                            <el-option v-for="item in isorNotMap" :key="item.value" :label="item.text"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="表单是否显示" prop="isShowForm">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.isShowForm'">
                                        <el-select v-model="scope.row.isShowForm" clearable size="mini">
                                            <el-option v-for="item in isorNotMap" :key="item.value" :label="item.text"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>


                            <el-table-column  align="left" label="列表是否显示" prop="isShowList">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.isShowList'">
                                        <el-select v-model="scope.row.isShowList" clearable size="mini">
                                            <el-option v-for="item in isorNotMap" :key="item.value" :label="item.text"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column  align="left" label="控件长度" prop="fieldLength">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.fieldLength'">
                                        <el-input v-model="scope.row.fieldLength" placeholder="控件长度" maxlength="3"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>

                            <el-table-column  align="left" label="字段排序" prop="orderNum">
                                <template slot-scope="scope">
                                    <el-form-item
                                                  :prop="'infiledList.' + scope.$index + '.orderNum'">
                                        <el-input v-model="scope.row.orderNum" placeholder="字段排序" maxlength="3"
                                                  show-word-limit size="mini"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </div>
            </el-tab-pane>

        </el-tabs>

        <el-button icon="el-icon-plus" size="small" type="primary" @click="addRow(inServForm.infiledList)">新增
        </el-button>

        <el-button type="primary" size="small" icon="el-icon-check" style="float: right;margin-top: 15px"
                   @click="addSave('inServForm')">保存
        </el-button>

    </div>

</template>

<script>

    import {
        pageCgformField,
        addCgformField,
        delCgformField,
        getFieldType
    } from "api/admin/system/formTable/index";
    import {loadGridHeight} from "utils/screen";
    import DictDetail from "../dict/detailIndex";

    export default {
        components: {DictDetail},
        props: {
            cgformHeadId: Number,
            isDbSynch: String,
        },
        name: "tableField",
        data() {
            const zhongwenValidator = (rule, value, callback) => {
                let reg = /^[\u4e00-\u9fa5]{1,15}$/;
                if (!value) {
                    callback("不能为空");
                } else if (!reg.test(value)) {
                    return callback("请输入1到15个汉字");
                } else {
                    callback();
                }
            };
            return {
                listQuery: {
                    cgformHeadId: this.cgformHeadId
                },
                inServForm: {
                    infiledList: [{
                        cgformHeadId: this.cgformHeadId,
                        dbFieldName: '',
                        dbType: '',
                        dbDefaultVal: '',
                        dbIsKey: '',
                        dbLength: '',
                        dbIsNull: '',
                        fieldShowType: '',
                        dictField: '',
                        dbFieldTxt: '',
                        isQuery: '',
                        isShowForm: '',
                        isShowList: '',
                        orderNum: ''
                    }]
                },
                listLoading: true,
                disableSize: '',
                activeName: 'dbField',
                isDbSynchFlag: undefined,
                listSize: undefined,
                height: '',
                needFixedRight: false,
                fieldShowTypeMap: [],
                isorNotMap: [{text: '否', value: 0}, {text: '是', value: 1}],
                dictFieldRules: [{required: true, message: "请输入字典CODE", trigger: "change"}],
                inServFormRules: {
                    dbFieldTxtRules: [{
                        required: true,
                        message: "请输入表说明",
                        trigger: "change"
                    }, {validator: zhongwenValidator, trigger: "change"}],
                    dbLengthRules: [{required: true, message: "请输入字段长度", trigger: "change"}],
                    fieldShowTypeRules: [{required: true, message: "请选择控件类型", trigger: "change"}],
                }
            }
        },
        mounted() {
            this.getList();
            this.getFieldType();
        },
        watch: {
            cgformHeadId(id) {
                this.listQuery.cgformHeadId = id;
                this.getList();
            }
        },
        methods: {
            getList() {
                this.isDbSynchFlag = this.isDbSynch == '1';
                pageCgformField(this.listQuery).then(response => {
                    this.inServForm.infiledList = response.data;
                    if (response.status==200){
                        let indexForm = this.inServForm.infiledList.filter(t =>
                            t.dbFieldName == "ZJ" || t.dbFieldName == "GDLZJ" || t.dbFieldName == "CJRQ" || t.dbFieldName == "ZT" || t.dbFieldName == "CJR"
                            || t.dbFieldName == "ID" || t.dbFieldName == "CREATE_TIME" || t.dbFieldName == "CREATE_BY" || t.dbFieldName == "STATUS" || t.dbFieldName == "WORKFLOW_ID")
                        this.disableSize = indexForm.length;
                        this.listSize = this.inServForm.infiledList.length;
                        this.listLoading = false
                    }
                });
            },
            getFieldType() {
                getFieldType().then(data => {
                    this.fieldShowTypeMap = data;
                })
            },
            //删除改行
            deleteRow(index, rows) {
                this.inServForm.infiledList.splice(index, 1);
            },
            addRow(tableData, event) {
                tableData.push({
                    cgformHeadId: this.cgformHeadId,
                    dbFieldName: '',
                    dbType: '',
                    dbDefaultVal: '',
                    dbIsKey: 0,
                    dbLength: '',
                    dbIsNull: 0,
                    fieldShowType: '',
                    dictField: '',
                    dbFieldTxt: '',
                    isQuery: 1,
                    isShowForm: 1,
                    isShowList: 1,
                    orderNum: ''
                })
            },
            //保存字段信息
            addSave(formName) {
                let dbFieldNameMap = [];
                let pinyin = require('js-pinyin');
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.inServForm.infiledList.forEach((item, index, arr) => {
                            item.dbFieldName = pinyin.getCamelChars(item.dbFieldTxt);
                            if (dbFieldNameMap.indexOf(item.dbFieldName) >= 0) {
                                item.dbFieldName = item.dbFieldName + index;
                            }
                            dbFieldNameMap.push(item.dbFieldName);
                        })
                        addCgformField(this.cgformHeadId,this.inServForm.infiledList).then(()=>{
                            this.$notify({
                                title: "成功",
                                message: "保存成功",
                                type: "success",
                                duration: 2000
                            });
                            this.getList();
                        })
                    } else {
                        this.activeName= 'dbField';
                        this.$notify({
                            title: "提示",
                            message: "字段必填",
                            type: "warning",
                            duration: 2000
                        });
                        return false;
                    }
                });
            }
        }
    }
</script>


<style >
.divForm .el-form-item {
    margin-bottom: 0px;
}
</style>
