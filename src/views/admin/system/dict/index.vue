<template>
  <div class="app-container calendar-list-container">
    <div ref="dictDiv" v-if="dictLoading">
      <fieldset class="fieldset">
        <legend class="legend">查询条件</legend>
        <div class="field-box">
          <el-form label-width="80px" :inline="true" :model="listQuery">
            <el-form-item class="filter-item" label="字典名称">
              <el-input @keyup.enter.native="handleFilter" v-model="listQuery.dictName" placeholder="请输入字典名称" style="width:200px"></el-input>
            </el-form-item>
              <el-form-item class="filter-item">
                  <el-button @click="handleFilter"  type="primary" class="filter-item">搜索</el-button>
                  <el-button @click="resetQuery"   class="filter-item">重置</el-button>
              </el-form-item>
          </el-form>
        </div>
      </fieldset>
      <div>
        <div class="head-box">
          <div class="item-box">
            <span class="mg-r-15 head-item" @click.stop.prevent="handleAdd('form')">
              <i class="fa fa-plus-square menu-icon vam" aria-hidden="true"></i>添加</span>
            <span class="mg-r-15 head-item" @click.stop.prevent="handleDelete">
              <i class="fa fa-window-close menu-icon vam" aria-hidden="true"></i>删除</span>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableData" border highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :height="height" :header-cell-style="{'background-color': '#fafafa'}">
          <el-table-column type="selection" width="50" prop="dictId" align="center"> </el-table-column>
          <el-table-column prop="dictName" label="字典名称" width="150" align="center"> </el-table-column>
          <el-table-column prop="dictDesc" label="字典描述" width="450" > </el-table-column>
          <el-table-column prop="dictStatus" label="状态" width="80" :formatter="statusFormatter" align="center"> </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="200"> </el-table-column>
          <el-table-column label="操作" width="200" align="center" :fixed="needFixedRight?'right':needFixedRight">
            <template slot-scope="scope">
              <el-button  type="primary" size="small" @click="handleDetailOpertion(scope.row)">详情</el-button>
              <el-button  type="success" size="small"@click.stop.prevent="handleUpdate(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="pageSizes" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
          <div slot="title">
              <template>
                  <i class="el-icon-edit"> 编辑</i>
              </template>
          </div>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="字典名称" prop="dictName" :label-width="formLabelWidth">
            <el-input v-model="form.dictName" size="large" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="字典描述" prop="dictDesc" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.dictDesc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')">取 消</el-button>
          <el-button v-if="dialogStatus=='add'" type="primary" @click="addItem('form')">确 定</el-button>
          <el-button v-else type="primary" @click="update('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--详情-->
    <div ref="detailDiv" v-else>
      <detailDiv :dictId="dictId" @listenDictLoading="showDictDiv"></detailDiv>
    </div>
  </div>
</template>
<script>
import { page, addObj, getObj, delObj, putObj } from "api/admin/system/dict/index";
import { mapGetters } from "vuex";
import {  fillterText } from "utils/index";
import detailDiv from "./detailIndex.vue";
import { loadGridHeight } from "utils/screen";

export default {
  name: "dict",
  data() {
    return {
      dictLoading: true,
      pageSizes: [10, 20, 30, 50],
      listQuery: {
        dictName: "",
        page: 1,
        limit: 20
      },
      tableData: null,
      total: 0,
      multipleSelection: [],
      selectionDictIds: "",
      dialogFormVisible: false, // 编辑表单是否显示标识，默认为false不显示
      form: {
        dictName: "",
        dictDesc: ""
      },
      formLabelWidth: "80px",
      dialogStatus: "",
      rules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
          { max: 32, message: "长度不能超过32个字符", trigger: "blur" }
        ]
      },
      dictId: undefined,
      height: undefined,
      needFixedRight:false,
    };
  },
  components: {
    detailDiv
  },
  created() {
    //生命周期钩子，vue实例一创建好就立即执行
    this.getList();
  },

  mounted() {
    //首次整个视图都渲染完毕后执行
    this.$nextTick(function() {
      let tableDiv = this.$el.querySelector(".el-table__body-wrapper");
      this.needFixedRight = !($(tableDiv).attr("class").indexOf("is-scrolling-none") >= 0);
    });
    //监听屏幕的改变
    window.onresize = () => {
      let tableDiv = this.$el.querySelector(".el-table__body-wrapper");
      this.needFixedRight = !($(tableDiv).attr("class").indexOf("is-scrolling-none") >= 0);
    };
    this.height = loadGridHeight();
  },
  computed: {
    ...mapGetters(["dict"])
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.staffStatus === "0") {
        return "warning-row";
      } else if (row.staffStatus === "1") {
        return "success-row";
      }
      return "";
    },
    // then相当 于ajax中的sucess方法
    // 查询历史数据
    getList() {
      page(this.listQuery).then(response => {
        this.tableData = response.rows;
        this.total = response.total;
        // this.listLoading = false;
      });
    },

    handleSizeChange(val) {
      //根据选择显示的条数，显示数据
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // 显示选择显示的页面显示所显页面的数据
      this.listQuery.page = val;
      this.getList();
    },
    handleFilter() {
      this.getList();
    },
    statusFormatter(row, column, cellValue) {
      // 格式化表格中的值
      return  fillterText(cellValue, this.dict["状态"]);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAdd(formName) {
      this.dialogFormVisible = true;
      this.dialogStatus = "add";
      this.$nextTick(function() {
        this.$refs[formName].resetFields();
      });
    },
    handleUpdate(row) {
      //if (this.multipleSelection.length == 1) {
      getObj(row.dictId).then(response => {
        this.form = response.data;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
      /*} else {
         this.$message({
          showClose: true,
          message: "请选择且只能选择一条记录"
          // type: 'warning'
        });
      }*/
    },

    handleDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.getDictIds();
            delObj(this.selectionDictIds).then(() => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            });
          })
          .catch(() => {
            /** this.$message({
             type: 'info',
             message: '已取消删除'
           });*/
          });
      } else {
        this.$message({
          showClose: true,
          message: "请至少选择一条记录"
          // type: 'warning'
        });
      }
    },
    handleDetailOpertion(row) {
      this.dictLoading = false;
      this.dictId = row.dictId;
    },
    getDictIds() {
      let dictIds = "";
      this.multipleSelection.forEach(dict => {
        dictIds += "," + dict.dictId;
      });
      this.selectionDictIds = dictIds.substring(1, dictIds.length);
    },
    addItem(formName) {
      this.$refs[formName].validate(valid => {
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          putObj(this.form.dictId, this.form).then(() => {
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
    resetQuery() {
      this.listQuery = { dictName: "" };
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$nextTick(function() {
        this.$refs[formName].resetFields();
      });
    },
    showDictDiv(data) {
      this.dictLoading = data;
    }
  }
};
</script>


