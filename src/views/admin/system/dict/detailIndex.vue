<template>
    <div class="app-container calendar-list-container">
        <fieldset class="fieldset">
          <legend class="legend">查询条件</legend>
          <div class="field-box">
              <el-form :inline="true" :model="listQuery">
                  <el-form-item class="filter-item" label="字段名称">
                      <el-input @keyup.enter.native="listQuery.detailName" v-model="listQuery.detailName"
                                placeholder="请输入字段名称" style="width:200px"></el-input>
                  </el-form-item>
                  <el-form-item  class="filter-item">
                      <el-button  @click="handleFilter" type="primary">搜索</el-button>
                      <el-button  @click="resetQuery" >重置</el-button>
                  </el-form-item>
              </el-form>
          </div>
        </fieldset>
        <div>
            <div class="head-box">
              <div class="item-box">
                    <span class="mg-r-15 head-item" @click.stop.prevent="handleAdd('detailform')"><i class="fa fa-plus-square menu-icon vam" aria-hidden="true"></i>添加</span>
                    <span class="mg-r-15 head-item" @click.stop.prevent="handleDelete"><i class="fa fa-window-close menu-icon vam" aria-hidden="true"></i>删除</span>
                    <span class="mg-r-15 head-item" @click.stop.prevent="handRetuan"><i class="fa fa-hand-o-left menu-icon vam" aria-hidden="true"></i>返回</span>
              </div>
            </div>

            <el-table :data="detialList" border  highlight-current-row  style="width: 100%"  @selection-change="handleSelectionChange" :height="height" :header-cell-style="{'background-color': '#fafafa'}">
                <el-table-column type="selection" width="50" prop="detailId" align="center"> </el-table-column>
                <el-table-column prop="detailValue" label="字段值" width="180"></el-table-column>
                <el-table-column prop="detailName" label="字段名称" width="180"></el-table-column>
                <el-table-column prop="detailDesc" label="字段描述" width="180"></el-table-column>
                <el-table-column prop="detailStatus" label="状态" :formatter="statusFormatter" width="80"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
                <el-table-column  align="center" fixed="right" label="操作" width="150" :fixed="needFixedRight?'right':needFixedRight">
                  <template slot-scope="scope">
                    <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,40]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <div slot="title">
              <template>
                  <i class="el-icon-edit"> 编辑</i>
              </template>
          </div>
            <el-form :model="detailform" :rules="rules" ref="detailform">
                <el-form-item label="字段名称" :label-width="formLabelWidth" prop="detailName">
                    <el-input v-model="detailform.detailName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="字段值" :label-width="formLabelWidth" prop="detailValue">
                    <el-input v-model="detailform.detailValue" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="字段描述" :label-width="formLabelWidth" prop="detailDesc">
                    <el-input v-model="detailform.detailDesc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('detailform')">取 消</el-button>
                <el-button v-if="dialogStatus=='add'" type="primary" @click="addItem('detailform')">确 定</el-button>
                <el-button v-else type="primary" @click="update('detailform')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {page, addObj, getObj, delObj, putObj} from "api/admin/system/dict/detailIndex";
import { mapGetters } from "vuex";
import {  fillterText } from "utils/index";
import { loadGridHeight } from "utils/screen";

export default {
  name: "dictDetail",
  data() {
    return {
      height: undefined,
      needFixedRight:false,
      listQuery: {
        detailName: undefined,
        dictId: undefined,
        page: 1,
        limit: 10
      },
      total: 0,
      detialList: null,
      multipleSelection: [], // 选中的对象
      selectionIds: "", // 选中对象的ID,以逗号间隔
      dialogFormVisible: false,
      dialogStatus: "",
      detailform: {
        detailId: undefined,
        dictId: undefined,
        detailName: undefined,
        detailValue: undefined,
        detailDesc: undefined
      },
      rules: {
        detailName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
          { max: 32, message: "长度不能超过32个字符", trigger: "blur" }
        ]
      },
      formLabelWidth: "80px",
      userManager_btn_edit:true
    };
  },
  props: ["dictId"],
  computed: {
    ...mapGetters(["dict"])
  },
  mounted() {
    //首次整个视图都渲染完毕后执行
    this.$nextTick(function() {
        let tableDiv = this.$el.querySelector(".el-table__body-wrapper");
        this.needFixedRight = !($(tableDiv).attr("class").indexOf("is-scrolling-none") >= 0
        );
    });
    //监听屏幕的改变
    window.onresize = () => {
        let tableDiv = this.$el.querySelector(".el-table__body-wrapper");
        this.needFixedRight = !($(tableDiv).attr("class").indexOf("is-scrolling-none") >= 0);
        this.height = loadGridHeight();
    };
    this.height = loadGridHeight();
  },
  created() {
    this.listQuery.dictId = this.dictId;
    this.detailform.dictId = this.dictId;
    this.getList();
  },
  methods: {
    statusFormatter(row, column, cellValue) {
      // 格式化表格中的值
      return  fillterText(cellValue, this.dict["状态"]);
    },
    getList() {
      page(this.listQuery).then(response => {
        this.detialList = response.rows;
        this.total = response.total;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleFilter() {
      this.getList();
    },
    handleSelectionChange(val) {
      // 多选
      this.multipleSelection = val;
    },
    handleAdd(formName) {
      this.dialogFormVisible = true;
      this.dialogStatus = "add";
      this.$nextTick(function() {
        this.$refs[formName].resetFields();
      });
      //this.$refs[formName].resetFields();
    },
    handleUpdate(row) {
        getObj(row.detailId).then(response => {
          this.detailform = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = "update";
        });
    },
    handleDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.getIds();
            delObj(this.selectionIds).then(() => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            });
          })
          .catch(() => {});
      } else {
        this.$message({
          showClose: true,
          message: "请至少选择一条记录"
          // type: 'warning'
        });
      }
    },
    handRetuan() {
      this.$emit("listenDictLoading", "true");
    },
    addItem(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addObj(this.detailform).then(() => {
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putObj(
            this.detailform.detailId,
            this.detailform
          ).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          console.log("error update!!");
          return false;
        }
      });
    },
    getIds() {
      let ids = "";
      this.multipleSelection.forEach(detail => {
        ids += "," + detail.detailId;
      });
      this.selectionIds = ids.substring(1, ids.length);
    },
     resetQuery(){
      this.listQuery={detailName:''};
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$nextTick(function() {
        this.$refs[formName].resetFields();
      });
    }
  }
};
</script>
