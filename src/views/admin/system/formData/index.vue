<template>
    <div class="app-container">
        <!-- 条件筛选 -->
        <fieldset class="fieldset">
            <legend class="legend">查询条件</legend>
            <div class="field-box">
                <el-form :inline="true" :model="listQuery">
                    <el-form-item :label="formItem.label" :prop="formItem.prop" class="filter-item" v-for="(formItem,key) in filterFormData">
                        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" :placeholder="formItem.label" v-model="listQuery[formItem.prop]" v-if="formItem.fieldShowType!=4"></el-input>
                        <el-select  v-model="listQuery[formItem.prop]" :placeholder="formItem.label" clearable v-else>
                            <el-option v-for="item in  dict[formItem.dictField]" :key="item.value" :label="item.text" :value="item.value"> </el-option>
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
                <span class="mg-r-15 head-item" @click.stop.prevent="handleCreate"><i class="fa fa-plus-square menu-icon vam" aria-hidden="true"></i>添加</span>
                <span class="mg-r-15 head-item" @click.stop.prevent="handleDelete"><i class="fa fa-window-close menu-icon vam" aria-hidden="true"></i>删除</span>
            </div>
        </div>
        <el-table :data="tableData" v-loading="listLoading" border highlight-current-row style="width: 100%" :height="height" >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column v-for="(item,key) in tableHeadData" :prop="item.prop" :label="item.label" align="center" show-overflow-tooltip>
                <template slot-scope="scope" >
                    <span v-if="item.dictField">{{formatTableData(scope.row[item.prop],item.dictField)}}</span>
                    <span v-else>{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180" :fixed="needFixedRight?'right':needFixedRight">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleView(scope.row)" >查看</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row)" type="success">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
        <!--表单对话框-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
                   append-to-body
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
            <el-form :model="formData" label-width="100px">
               <el-row v-for="(formItems,keys) in formMetaData">
                   <el-col v-for="(formItem,key) in formItems" :span="24/(formItems.length)">
                       <el-form-item :label="formItem.label" :prop="formItem.prop" >
                           <!--数字框-->
                           <el-input-number v-model="formData[formItem.prop]"
                                            :min="0"
                                            :placeholder="formItem.label"
                                            :label="formItem.label"
                                            :readonly="dialogStatus=='view'"
                                            v-if="formItem.fieldShowType==1">
                           </el-input-number>
                           <!--文本框-->
                           <el-input :placeholder="formItem.label"
                                     v-model="formData[formItem.prop]"
                                     :readonly="dialogStatus=='view'"
                                     v-else-if="formItem.fieldShowType==2">
                           </el-input>
                           <!--文本域-->
                           <el-input type="textarea"
                                     :autosize="{ minRows: 4, maxRows: 4}"
                                     :placeholder="formItem.label"
                                     v-model="formData[formItem.prop]"
                                     :readonly="dialogStatus=='view'"
                                     v-else-if="formItem.fieldShowType==3">
                           </el-input>
                           <!--Select 选择器-->
                           <el-select v-model="formData[formItem.prop]"
                               :placeholder="formItem.label"
                               v-else-if="formItem.fieldShowType==4"
                               :readonly="dialogStatus=='view'">
                               <el-option v-for="item in  dict[formItem.dictField]" :key="item.value" :label="item.text" :value="item.value">
                               </el-option>
                           </el-select>
                           <!--日期（YYYY-MM-DD）-->
                           <el-date-picker
                               v-model="formData[formItem.prop]"
                               :readonly="dialogStatus=='view'"
                               v-else-if="formItem.fieldShowType==5"
                               type="date"
                               value-format="yyyy-MM-dd"
                               :placeholder="formItem.label">
                           </el-date-picker>
                           <!--日期（YYYY-MM-DD hh:mm:ss）-->
                           <el-date-picker
                               v-model="formData[formItem.prop]"
                               :readonly="dialogStatus=='view'"
                               v-else-if="formItem.fieldShowType==6"
                               type="datetime"
                               value-format="yyyy-MM-dd HH:mm:ss"
                               :placeholder="formItem.label">
                           </el-date-picker>
                           <!--多选框-->
                           <el-checkbox-group v-model="a"  v-else-if="formItem.fieldShowType==7" :readonly="dialogStatus=='view'">
                               <el-checkbox v-for="item in  dict[formItem.dictField]" :key="item.value" :label="item.value">{{item.text}}</el-checkbox>
                           </el-checkbox-group>
                           <!--文件-->
                           <el-upload
                               v-else-if="formItem.fieldShowType==8"
                               class="upload-demo"
                               action="https://jsonplaceholder.typicode.com/posts/"
                               :on-preview="handlePreview"
                               :on-remove="handleRemove"
                               :before-remove="beforeRemove"
                               multiple
                               :limit="3"
                               :on-exceed="handleExceed"
                               :file-list="fileList">
                               <el-button size="small" type="primary">点击上传</el-button>
                               <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                           </el-upload>
                           <!--图片-->
                           <template v-else-if="formItem.fieldShowType==9">
                               <el-upload
                                           action="https://jsonplaceholder.typicode.com/posts/"
                                           list-type="picture-card"

                                           :on-remove="handleRemove">
                                   <i class="el-icon-plus"></i>
                               </el-upload>
                               <el-dialog :visible.sync="dialogVisible">
                                   <img width="100%" :src="dialogImageUrl" alt="">
                               </el-dialog>
                           </template>

                           <!--下拉选择框-->
                           <!--部门选择器-->
                           <!--用户选择器-->
                           <!--富文本编辑器-->
                           <quill-editor v-model="formData[formItem.prop]" :options="editorOption"  v-else-if="formItem.fieldShowType==13"></quill-editor>

                       </el-form-item>
                   </el-col>
               </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <template v-if="dialogStatus!='view'">
                    <el-button @click="cancel()">取 消</el-button>
                    <el-button v-if="dialogStatus=='create'" type="primary" @click="create()">确 定</el-button>
                    <el-button v-else type="primary" @click="update()">确 定</el-button>
                </template>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {pageCgformField,getObj} from "api/admin/system/formTable/index";
    import {getFormPage,addForm,updateForm} from "api/admin/system/formData/index";
    import {loadGridHeight} from "utils/screen";
    import { mapGetters } from "vuex";
    import {fillterText} from "utils/index";
    export default {
        name: "index",
        data(){
            return {
                cities:['上海', '北京', '广州', '深圳'],
                height:undefined,
                needFixedRight: false,
                filterFormData:[],//筛选框表单元数据
                tableHeadData:[],//表头数据
                formMetaData:[],//对话框表单元数据
                tableData:undefined,
                total: null,
                listLoading:false,
                listQuery:{
                    page: 1,
                    limit: 10,
                },
                a:[],
                dialogFormVisible:false,
                dialogStatus: "",
                textMap: {
                    update: "编辑",
                    create: "创建",
                    view: "查看"
                },
                formData:{
                    a:[]
                },
                editorOption:{},
                formLayout:undefined,//表单布局
                fileList:[]
            }
        },
        props:["headId"],
        computed:{
            ...mapGetters(["dict"]),
            cgformHeadId(){
                if(this.$route.path.indexOf("/formData/index")!==-1){
                    return this.$route.path.slice(this.$route.path.lastIndexOf("/")+1,this.$route.path.length)
                }else{
                    return this.headId;
                }
            }
        },
        created(){
            this.initData();
        },
        mounted(){
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
            console.log(this.dict["企业类型"])
        },
        methods:{
            //初始化数据
            initData(){
                this.getCgForm(this.cgformHeadId).then(data=>{
                    if(data){
                        //加载完表单元数据后再加载表格数据，否则会报错
                        this.getCgformField(this.cgformHeadId).then(resp=>{
                            if(resp){
                                this.height = loadGridHeight();
                                this.getList() ;
                            }
                        })
                    }
                })
            },
            //获取表名对象数据
            getCgForm(id){
                return new Promise(resolve => {
                    getObj(id).then(resp=>{
                        this.formLayout = resp.data.fromLayout;
                        resolve(true)
                    })
                })

            },
            //获取表单元素据
            getCgformField(id){
                return new Promise(resolve => {
                    pageCgformField({"cgformHeadId":id}).then(resp=>{
                        let data =resp.data.sort(this.compare("orderNum"));
                        let a = [];//保存表单需要布局排列的属性
                        let b = [];//保存表单不需要布局排列的属性
                        data.forEach(item=>{
                            if(item.isQuery){
                                let obj = {};
                                obj.label=item.dbFieldTxt;
                                obj.prop=item.dbFieldName;
                                obj.dictField=item.dictField;
                                obj.fieldShowType = item.fieldShowType;
                                this.filterFormData.push(obj);
                            }
                            if(item.isShowList){
                                let obj = {};
                                obj.label=item.dbFieldTxt;
                                obj.prop=item.dbFieldName;
                                obj.dictField=item.dictField;
                                this.tableHeadData.push(obj);
                            }
                            if(item.isShowForm){
                                let obj = {};
                                obj.label=item.dbFieldTxt;
                                obj.prop=item.dbFieldName;
                                obj.dictField=item.dictField;
                                obj.fieldShowType = item.fieldShowType;
                                let fieldTypes =[3,7,8,9,13];
                                if(fieldTypes.some(v=>v==item.fieldShowType)){
                                    let arr=[];
                                    arr.push(obj);
                                    b.push(arr);
                                }else{
                                   a.push(obj);
                                }

                            }
                        })
                        a = this.sliceArry(a,this.formLayout);
                        this.formMetaData=a.concat(b)
                        console.log(this.formMetaData)
                        resolve(true);
                    })
                })
            },
            //获取表格数据
            getList() {
                this.listLoading = true;
                this.listQuery.tableId=this.cgformHeadId;
                getFormPage(this.listQuery).then(resp=>{
                    this.tableData = resp.rows;
                    this.total = resp.total;
                    this.listLoading = false;
                })
            },
            //修改分页数
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            //修改当前页
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            //条件查询
            handleFilter(){
                this.getList();
            },
            //重置条件查询
            resetQuery(){
                let obj = {}
                Object.assign(obj,this.listQuery);
                this.listQuery={
                    page: 1,
                    limit: obj.limit,
                };
            },
            //新增
            handleCreate(){
                this.dialogStatus="create";
                this.dialogFormVisible=true;
            },
            //删除
            handleDelete(){

            },
            //查看表单数据
            handleView(row){
                this.formData=row;
                this.dialogStatus="view";
                this.dialogFormVisible=true;
            },
            //编辑表单数据
            handleEdit(row){
                this.formData=row;
                this.dialogStatus="update";
                this.dialogFormVisible=true;
            },
            //关闭对话框
            closeDialog(){
                this.formData={};
            },
            cancel(){
                this.dialogFormVisible=false;
            },
            create(){
                addForm({"tableId":this.cgformHeadId,"form":this.formData}).then(resp=>{
                    if(resp.msg="success"){
                        this.$message({
                            showClose: true,
                            message: "新增数据成功！",
                            type:"success"
                        });
                    }else{
                        this.$message({
                            showClose: true,
                            message: "新增数据失败！",
                            type:"error"
                        });
                    }
                    this.dialogFormVisible=false;
                    this.getList();
                })
            },
            //更新提交
            update(){
                updateForm({"tableId":this.cgformHeadId,"form":this.formData}).then(resp=>{
                    if(resp.msg="success"){
                        this.$message({
                            showClose: true,
                            message: "更新数据成功！",
                            type:"success"
                        });
                    }else{
                        this.$message({
                            showClose: true,
                            message: "更新数据失败！",
                            type:"error"
                        });
                    }
                    this.dialogFormVisible=false;
                    this.getList();
                })
            },
            //格式化表格数据
            formatTableData(value,dictFiled){
                return  fillterText(value, this.dict[dictFiled]);
            },
            //数组元素比较（工具函数）
            compare(property){
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },
            /**
             * 按照指定长度切割数组，返回一个新的数组
             * @param arr 传入数组
             * @param len 切割长度
             */
            sliceArry(arr,len){
                let result = [];
                let num = 0;
                arr.forEach((item,index)=>{
                    if(index%len==0&&index!=0){
                        result.push(arr.slice(num,index));
                        num = index;
                    }
                    if(index+1==arr.length){
                        result.push(arr.slice(num,index+1))
                    }
                })
                return result;
            }
        }
    }
</script>

<style scoped>

</style>
