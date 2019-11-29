<template>
  <div class="app-container">
      <!-- 条件筛选 -->
     <fieldset class="fieldset">
        <legend class="legend">查询条件</legend>
          <div class="field-box">
            <el-form :inline="true" :model="listQuery" >
              <el-form-item label="管理员账号" prop="userNo"  class="filter-item">
                  <el-input @keyup.enter.native="handleFilter" style="width: 200px;"  placeholder="管理员账号"  v-model="listQuery.userNameLike"> </el-input>
              </el-form-item>
              <el-form-item label="用户姓名" prop="realName"  class="filter-item">
                  <el-input @keyup.enter.native="handleFilter" style="width: 200px;"  placeholder="用户姓名"  v-model="listQuery.realName"> </el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile"  class="filter-item">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;"  placeholder="手机号"  v-model="listQuery.mobileLike"> </el-input>
              </el-form-item>
               <el-form-item label="用户状态" prop="userStatus" class="filter-item">
                   <el-select  v-model="listQuery.userStatus" placeholder="请选择用户状态">
                    <el-option v-for="item in  statusOptions" :key="item.value" :label="item.text" :value="item.value"> </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item class="filter-item">
                <el-button type="primary"   @click="handleFilter">搜索</el-button>
                <el-button   @click="resetQuery()">重置</el-button>
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
    <!--表格组件-->
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border  highlight-current-row style="width: 100%" @selection-change="getSelection"  :row-class-name="tableRowClassName" :height="height" :header-cell-style="{'background-color': '#fafafa'}"	>
       <el-table-column  type="selection"  width="55">
       </el-table-column>
      <el-table-column align="center" label="用户编号" width="100" prop="userId">
      </el-table-column>
      <el-table-column width="210px" align="center" label="管理员账号" prop="userNo">
      </el-table-column>
      <el-table-column width="200px" align="center" label="手机号" prop="mobile">
      </el-table-column>
      <el-table-column width="200px" align="center" label="用户姓名" prop="realName">
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column  align="center"  label="操作" width="200" :fixed="needFixedRight?'right':needFixedRight">
        <template slot-scope="scope">
            <el-button  size="small"  @click="handleView(scope.row)">查看</el-button>
            <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!--对话框组件-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="closeDialog">
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
        <el-form-item label="管理员账号" placeholder="请输入管理员账号" prop="userNo">
          <el-input v-model="form.userNo" :disabled="dialogStatus!=='create'"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName">
          <el-input  v-model="form.realName" placeholder="请输入用户姓名" :readonly="dialogStatus=='view'"></el-input>
        </el-form-item>
        <el-form-item label="手机号" placeholder="请输入手机账号" prop="mobile">
          <el-input  v-model="form.mobile" :readonly="dialogStatus=='view'"></el-input>
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
import {page, addSysObj, getObj, delObjs, putSysObj, checkMobile, checkUserName} from "api/admin/system/user/index";
import { mapGetters } from "vuex";
import {fillterText} from "utils/index";
import { spacelValidator} from "utils/validate";
import { loadGridHeight } from "utils/screen";
export default {
    name: "user",
    data() {
    const userNoValidator = (rule, value, callback) => {
      if (this.dialogStatus == "update") {
        if (this.oldUserNo == this.form.userNo) {
          callback();
        } else {
          checkUserName({
            userName: value.trim()
          }).then(response => {
            if (response.data) {
              callback("管理员账号不能重复");
            } else {
              callback();
            }
          });
        }
      } else {
        checkUserName({
          userName: value.trim()
        }).then(response => {
          if (response.data) {
            callback("管理员账号不能重复");
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
        height:undefined,
        needFixedRight:false,
        oldUserNo: undefined,
        tableKey: 0,
        userSelection: [],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
            page: 1,
            limit: 20,
            userNameLike: undefined,
            mobileLike: undefined,
            realName: undefined,
            userStatus: "1" //只查询有效的数据
        },
        form: {
          userNo: undefined,
          realName: undefined,
          userPwd: "666666",
          mobile: undefined,
          email: undefined,
         },
        rules: {
          realName: [{required: true, message: "请输入姓名", validator: spacelValidator, trigger: "blur"}, {max: 32, message: "长度不能超过32个字符", trigger: "blur"}],
          userNo: [{ required: true,validator: spacelValidator,  message: "请输入管理员账号", trigger: "blur" }, { validator: numberValidator, trigger: "blur" }, { validator: userNoValidator, trigger: "blur" }]
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
    },
    computed: {
        ...mapGetters(["dict"]),
        sexOptions() {
            return this.dict["性别"];
        },
        statusOptions() {
            return this.dict["状态"];
        }
    },
    mounted () {
        this.height=loadGridHeight();
      //首次整个视图都渲染完毕后执行
      this.$nextTick(function () {
        let tableDiv=  this.$el.querySelector('.el-table__body-wrapper');
        this.needFixedRight =!($(tableDiv).attr("class").indexOf("is-scrolling-none")>=0);
      });
      //监听屏幕的改变
      window.onresize = () => {
        let tableDiv=  this.$el.querySelector('.el-table__body-wrapper');
        this.needFixedRight =!($(tableDiv).attr("class").indexOf("is-scrolling-none")>=0);
          this.height=loadGridHeight();
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
          getObj(row.userId).then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = "view";
          });
        },
        handleUpdate(row) {
          getObj(row.userId).then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = "update";
            this.oldUserNo = this.form.userNo;
          });
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
              this.userSelection.forEach(user => {
                idArr.push(user.userId);
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
                .catch(() => {});
            })
            .catch(() => {});
        },
        create(formName) {
          const set = this.$refs;
          set[formName].validate(valid => {
            if (valid) {
              if (this.videoPerFlag) {
                this.form.videoLiveBroadcast = "1";
              } else {
                this.form.videoLiveBroadcast = "0";
              }
              if (this.videoLookBackFlag) {
                this.form.videoLookBack = "1";
              } else {
                this.form.videoLookBack = "0";
              }
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
          const set = this.$refs;
          set[formName].validate(valid => {
            if (valid) {
              if (this.videoPerFlag) {
                this.form.videoLiveBroadcast = "1";
              } else {
                this.form.videoLiveBroadcast = "0";
              }
              if (this.videoLookBackFlag) {
                this.form.videoLookBack = "1";
              } else {
                this.form.videoLookBack = "0";
              }
              this.dialogFormVisible = false;
              this.form.userPwd = undefined;
              putSysObj(this.form.userId, this.form).then(() => {
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
        closeDialog(){
            this.resetForm();
          },
        //重置表单验证和表单数据
        resetForm() {
        this.$nextTick(function() {
            this.$refs["form"].clearValidate();
        });
        this.form = {
            userId: undefined,
            userNo: undefined,
            realName: undefined,
            userPwd: "666666",
            email: undefined,
            mobile: undefined,
        };
      },
        sexFormatter: function(row, column, cellValue) {
          return  fillterText(cellValue, this.dict["性别"]);
        },
        resetQuery() {
          this.listQuery = {
            userNameLike: "",
            userStatus: "1",
            mobileLike: "",
            realName: "",

          };
        },
        getSelection(selection) {
          this.userSelection = selection;
        },

  }
};
</script>

