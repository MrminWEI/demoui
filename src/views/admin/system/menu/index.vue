<template>
  <div class="app-container calendar-list-container">
      <div style="margin-top: 5px;margin-bottom: -5px">
          <el-button-group>
              <el-button type="primary" icon="el-icon-check" @click="handlerAdd">添加</el-button>
              <el-button type="success" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
              <el-button type="danger"  icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-button-group>
      </div>

    <el-row  style='margin-top:15px;'>
      <el-col :span="8">
          <el-card >
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree class="filter-tree"
                       :style="'height:'+(height-140)+'px;'+'overflow-y: auto'"
                       :data="treeData"
                       :expand-on-click-node="false"
                       node-key="id"
                       highlight-current
                       :props="defaultProps"
                       :filter-node-method="filterNode"
                       ref="menuTree"
                       @node-click="getNodeData"
                       default-expand-all>
              </el-tree>
          </el-card>
      </el-col>
      <el-col :span="16" >
        <el-card  style="margin-left: 10px">
          <el-form label-width="80px" :model="form" ref="form" :rules="rules" :style="'height:'+(height-100)+'px;'+'overflow-y: auto'">
            <el-form-item label="菜单路径" prop="menuUrl">
              <el-input v-model="form.menuUrl" :disabled="formEdit" placeholder="请输入路径编码"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" :disabled="formEdit" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="父级节点" prop="parentName">
              <el-input v-model="form.parentName" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="menuIcon">
              <el-input v-model="form.menuIcon" :disabled="formEdit" placeholder="请输入图标"></el-input>
            </el-form-item>
            <el-form-item label="菜单级别" prop="menuLevel">
              <el-input v-model="form.menuLevel" :disabled="formEdit" placeholder="请输入级别" readonly></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
              <el-select  v-model="form.menuType" :disabled="formEdit" placeholder="请输入菜单类型">
                <el-option v-for="item in  typeOptions" :key="item.value" :label="item.text" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单状态" prop="menuStatus">
              <el-select  v-model="form.menuStatus" :disabled="formEdit" placeholder="请输入状态">
                <el-option v-for="item in  statusOptions" :key="item.value" :label="item.text" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="menuOrder">
              <el-input v-model="form.menuOrder" :disabled="formEdit" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="menuDesc">
              <el-input v-model="form.menuDesc" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {fetchTree, getObj, addObj, delObj, putObj} from "api/admin/system/menu/index";
import { mapGetters } from "vuex";
import { validateNumber } from "@/utils/validate.js";
import { loadGridHeight } from "utils/screen";
export default {
  name: "index",
  data() {
    const validateMenuUrl = (rule, value, callback) => {
      if (this.form.menuLevel === 2) {
        //叶子节点
        if (value === undefined || value === "") {
          callback(new Error("请输入菜单路径"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    const checkNumber = (rule, value, callback) => {
      if (value !== undefined && !validateNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      height:undefined,
      filterText: "",
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: this.$store.getters.dict["菜单类型"],
      statusOptions: this.$store.getters.dict["状态"],
      listQuery: {
        menuName: undefined
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "text"
      },
      form: {
        menuId: undefined,
        menuUrl: undefined,
        menuName: undefined,
        menuPid: undefined,
        menuIcon: undefined,
        menuType: undefined,
        menuOrder: undefined,
        menuStatus: undefined,
        parentName: undefined,
        menuLevel: undefined,
        menuDesc: undefined
      },
      rules: {
        menuUrl: [{ validator: validateMenuUrl, trigger: "blur" }],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
        ],
        menuIcon: [
          { min: 1, max: 128, message: "长度在 1 到 128 个字符", trigger: "blur" }
        ],
        menuType: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
        menuOrder: [{ validator: checkNumber, trigger: "blur" }]
      },
      currentId: -1
    };
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  mounted(){
      this.height=loadGridHeight();
      //监听屏幕的改变
      window.onresize = () => {
          this.height=loadGridHeight();
      }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["dict"])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(data => {
        this.treeData = data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    getNodeData(data) {
      this.$refs["form"].resetFields();
      if (!this.formEdit) {
        this.formStatus = "update";
      }
      getObj(data.id).then(response => {
        this.form = response.data;
        this.form.menuStatus += "";
        this.form.menuType += "";
      });
      this.currentId = data.id;
      this.showElement = true;
    },
    handlerEdit() {
      if (this.form.menuName) {
        this.formEdit = false;
        this.formStatus = "update";
      } else {
        this.$message({
          showClose: true,
          message: "请选择菜单进行编辑",
          type: "error"
        });
      }
    },
    handlerAdd() {
      let errMsg;
      if (this.form.menuName) {
        //新增
        if (this.form.menuLevel < 2) {
          this.resetForm();
          this.formEdit = false;
          this.formStatus = "create";
        } else {
          errMsg = "无法在二级菜单上增加新菜单";
        }
      } else {
        errMsg = "请选择父级菜单";
      }
      if (errMsg) {
        this.$message({
          showClose: true,
          message: errMsg,
          type: "error"
        });
      }
    },
    handleDelete() {
      if (this.form.menuName) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delObj(this.currentId).then(() => {
              this.getList();
              this.$refs["form"].resetFields();
              this.formEdit = false;
              this.form.parentName = undefined;
              this.form.menuLevel = undefined;
              this.onCancel();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
            });
          })
          .catch(() => {});
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要删除的记录",
          type: "error"
        });
      }
    },
    update() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          putObj(this.form.id, this.form).then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          console.log("保存出错！");
          return false;
        }
      });
    },
    create() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          console.log("保存出错！");
          return false;
        }
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = "";
    },
    resetForm() {
      this.form = {
        menuId: undefined,
        menuUrl: undefined,
        menuPid: this.currentId,
        menuIcon: undefined,
        menuType: undefined,
        menuOrder: undefined,
        menuName: undefined,
        parentName: this.form.menuName,
        menuStatus: "1",
        menuLevel: this.form.menuLevel + 1,
        menuDesc: undefined,
        enabled: undefined
      };
    }
  }
};
</script>

