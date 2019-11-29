<template>
  <div class="app-container calendar-list-container">
    <fieldset class="fieldset">
      <legend class="legend">查询条件</legend>
      <div class="field-box">
        <el-form :inline="true" :model="listQuery">
            <el-form-item label="角色名称"  class="filter-item">
              <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="角色名称" v-model="listQuery.roleNameLike"> </el-input>
            </el-form-item>
            <el-form-item label="角色状态"  class="filter-item">
                <el-select  v-model="listQuery.roleStatus" placeholder="请选择角色状态">
                <el-option v-for="item in  statusOptions" :key="item.value" :label="item.text" :value="item.value"> </el-option>
              </el-select>
          </el-form-item>
           <el-form-item class="filter-item">
              <el-button type="primary"  @click="handleFilter">搜索</el-button>
              <el-button  @click="resetQuery()">重置</el-button>
           </el-form-item>
        </el-form>
    </div>
     </fieldset>
    <div class="head-box">
          <div class="item-box">
            <span class="mg-r-15 head-item" @click.stop.prevent="handleCreate"><i class="fa fa-plus-square menu-icon vam" aria-hidden="true"></i>添加</span>
            <span class="mg-r-15 head-item" @click.stop.prevent="handlerAuthority"><i class="fa fa-key menu-icon vam" aria-hidden="true"></i>权限分配</span>
            <span class="mg-r-15 head-item" @click.stop.prevent="handlerUser"><i class="fa fa-user-plus menu-icon vam" aria-hidden="true"></i>关联操作员</span>
            <span class="mg-r-15 head-item" @click.stop.prevent="handleDelete"><i class="fa fa-window-close menu-icon vam" aria-hidden="true"></i>删除</span>
          </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border  highlight-current-row style="width: 100%" @selection-change="getSelection"  :row-class-name="tableRowClassName" :height="height" :header-cell-style="{'background-color': '#fafafa'}"	>
      <el-table-column  type="selection"  width="50" align="center">
      </el-table-column>
      <el-table-column align="center" label="角色编号" width="80" prop="roleId">

      </el-table-column>
      <el-table-column width="200px" align="center" label="角色名称" prop="roleName">

      </el-table-column>
      <el-table-column width="110px" align="center" label="状态" prop="roleStatus" :formatter="statusFormatter">

      </el-table-column>
      <el-table-column width="110px" align="center" label="排序" prop="roleOrder">

      </el-table-column>
      <el-table-column width="300px" align="center" label="描述" prop="roleDesc">

      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间" prop="createTime">

      </el-table-column>
      <el-table-column width="180px" align="center" label="更新时间" prop="updateTime">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" :fixed="needFixedRight?'right':needFixedRight">
        <template slot-scope="scope">
           <el-button size="small" @click="handleView(scope.row)">查看
          </el-button>
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <div slot="title">
          <template v-if="textMap[dialogStatus] === '创建'">
              <i class="el-icon-document"> {{textMap[dialogStatus]}}</i>
          </template>
          <template v-else-if="textMap[dialogStatus] === '编辑'">
              <i class="el-icon-edit"> {{textMap[dialogStatus]}}</i>
          </template>
          <template v-else-if="textMap[dialogStatus] === '查看'">
              <i class="el-icon-view"> {{textMap[dialogStatus]}}</i>
          </template>
          <template v-else="textMap[dialogStatus] === '查看'">
              <i class="el-icon-view"> {{textMap[dialogStatus]}}</i>
          </template>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" :disabled="disabledFlag"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="roleOrder">
          <el-input v-model="form.roleOrder" placeholder="请输入顺序" :disabled="disabledFlag"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="roleStatus" v-if="dialogStatus=='update'">
          <el-select class="filter-item" v-model="form.roleStatus" placeholder="请输入状态" :disabled="disabledFlag">
            <el-option v-for="item in  statusOptions" :key="item.value" :label="item.text" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" placeholder="请输入描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" :disabled="disabledFlag"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="roleManager_update">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogUserName" size="large" :visible.sync="dialogUserVisible" :close-on-click-modal="false">
      <div slot="title">
          <template >
              <i class="fa fa-key  vam">{{dialogUserName}}</i>
          </template>
      </div>
      <role-user :roleId="getCurrentId()" @closeUserDialog="closeUserDialog" ref="roleUser"></role-user>
    </el-dialog>
    <el-dialog :title="dialogAuthorityName" size="large" :visible.sync="dialogAuthorityVisible" width="50%" :close-on-click-modal="false">
      <div slot="title">
        <template >
            <i class="fa fa-user-plus  vam">{{dialogAuthorityName}}</i>
        </template>
      </div>
      <role-authority :roleId="getCurrentId()" @closeAuthorityDialog="closeAuthorityDialog" ref="roleAuthority"></role-authority>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObjs, putObj } from "api/admin/system/role/index";
import { mapGetters } from "vuex";
import { fillterText } from "utils/index";
import { validateNumber } from "utils/validate";
import { loadGridHeight } from "utils/screen";
export default {
  name: "role",
  components: {
    "role-user": () => import("./components/user"),
    "role-authority": () => import("./components/authority")
  },
  data() {
    const roleOrderValidator = (rule, value, callback) => {
      if (value !== undefined && !validateNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      needFixedRight:false,
      disabledFlag:false,
      height:undefined,
      form: {
        roleName: undefined,
        roleDesc: undefined,
        roleOrder: undefined
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          },
          {
            max: 32,
            message: "长度不能超过32个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [
          {
            max: 256,
            message: "长度不能超过32个字符",
            trigger: "blur"
          }
        ],
        roleOrder: [{ validator: roleOrderValidator, trigger: "blur" }]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        roleNameLike: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
        view: "查看",
      },
      roleManager_update: true,
      tableKey: 0,
      dialogUserVisible: false,
      dialogAuthorityVisible: false,
      dialogUserName: "绑定用户",
      dialogAuthorityName: "绑定权限",
      currentId: -1,
      roleSelection: []
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["dict"]),
    statusOptions() {
      return this.dict["状态"];
    }
  },
  mounted () {
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
      this.height=loadGridHeight();
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
        if (row.staffStatus === '0') {
          return 'warning-row';
        } else if (row.staffStatus === '1') {
          return 'success-row';
        }
        return '';
      },
    getCurrentId() {
      return this.currentId;
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
      this.roleManager_update = true;
      this.disabledFlag = false;
      this.resetTmp();
    },
    handleUpdate(row) {
      getObj(row.roleId).then(response => {
        this.form = response.data;
        this.form.roleStatus += "";
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        this.roleManager_update = true;
        this.disabledFlag = false;
      });
    },
    handleView(row) {
      getObj(row.roleId).then(response => {
        this.form = response.data;
        this.form.roleStatus += "";
        this.dialogFormVisible = true;
        this.dialogStatus = "view";
        this.roleManager_update = false;
        this.disabledFlag = true;
      });
    },
    handleDelete() {
      if (!this.roleSelection.length) {
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
          this.roleSelection.forEach(role => {
            idArr.push(role.roleId);
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
    handlerAuthority() {
      if (this.roleSelection.length === 0 || this.roleSelection.length > 1) {
        this.$message({
          showClose: true,
          message: "只能选择一条信息！"
        });
        return;
      }

      this.currentId = this.roleSelection[0].roleId;
      if (this.currentId > -1) {
        this.dialogAuthorityVisible = true;
        this.dialogUserVisible = false;
      } else {
        this.$message({
          showClose: true,
          message: "请先选择一个角色",
          type: "error"
        });
      }
    },
    handlerUser() {
      if (this.roleSelection.length === 0 || this.roleSelection.length > 1) {
        this.$message({
          showClose: true,
          message: "只能选择一条信息！"
        });
        return;
      }

      this.currentId = this.roleSelection[0].roleId;
      if (this.currentId > -1) {
        this.dialogUserVisible = true;
        this.dialogAuthorityVisible = false;
      } else {
        this.$message({
          showClose: true,
          message: "请先选择一个角色",
          type: "error"
        });
      }
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
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          putObj(this.form.roleId, this.form).then(() => {
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
    resetTmp() {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    statusFormatter(row, column, cellValue) {
      return  fillterText(cellValue, this.dict["状态"]);
    },
    closeUserDialog() {
      this.dialogUserVisible = false;
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false;
    },
    handleSelect(val) {
      this.currentId = val.roleId;
    },
    resetQuery() {
      this.listQuery = { roleNameLike: "", roleStatus: "" };
    },
    getSelection(selection) {
      this.roleSelection = selection;
    }
  }
};
</script>
