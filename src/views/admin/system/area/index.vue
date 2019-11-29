<template>
  <div class="app-container calendar-list-container">
      <div style="margin-top: 5px;margin-bottom: -5px">
      <el-button-group>
        <el-button type="primary" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
      </el-button-group>
    </div>
    <el-row style='margin-top:15px;'>
      <el-col :span="8" >
          <el-card>
              <el-tree :style="'height:'+(height+30)+'px;'+'overflow-y: auto'"
                       class="filter-tree"
                       node-key="id"
                       :props="props"
                       :load="loadNode"
                       lazy
                       highlight-current
                       :filter-node-method="filterNode"
                       ref="menuTree"
                       v-if="treeShow"
                       @node-click="getNodeData" default-expand-all>
              </el-tree>
          </el-card>
      </el-col>

      <el-col :span="16" >
          <el-card style="margin-left: 10px">
              <el-table :key='tableKey' :data="list" v-loading.body="listLoading" stripe border  highlight-current-row :height="height" style="width: 100%">
                  <el-table-column align="center" label="编号" width="90px" prop="areaId">

                  </el-table-column>
                  <el-table-column width="145px" align="center" label="区域名称" prop="areaName">

                  </el-table-column>
                  <el-table-column width="150px" align="center" label="区域编码" prop="code">

                  </el-table-column>

                  <el-table-column width="110px" align="center" label="状态" :formatter="statusFormatter" prop="status">
                  </el-table-column>

                  <el-table-column width="110px" align="center" label="经度" prop="longitude">

                  </el-table-column>

                  <el-table-column width="110px" align="center" label="纬度" prop="latitude">

                  </el-table-column>
                  <el-table-column  align="center" label="操作" width="200" :fixed="needFixedRight?'right':needFixedRight">
                      <template slot-scope="scope">
                          <el-button v-if="menuManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
                          </el-button>
                          <el-button v-if="menuManager_btn_del" size="small" type="danger" @click="deleteArea(scope.row)">删除
                          </el-button>
                          <el-button v-if="menuManager_btn_recover" size="small" type="danger" @click="recoverArea(scope.row)">恢复
                          </el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div v-show="!listLoading" class="pagination-container">
                  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
              </div>
          </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">

          <el-form-item label="上级区域名称" prop="pareaName">
              <el-input v-model="form.pareaName" readonly></el-input>
          </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入区域名称" ></el-input>
        </el-form-item>
        <el-form-item label="区域编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入区域编码"></el-input>
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="经度" placeholder="请输入经度" prop="longitude">
          <el-input v-model="form.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" placeholder="请输入纬度" prop="latitude">
          <el-input v-model="form.latitude"></el-input>
        </el-form-item>
        <el-form-item label="排序" placeholder="请输入纬度" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchTree,fetchTree1, page, getArea, putArea, addArea, delArea, recoverArea} from 'api/admin/system/area/index';
  import { mapGetters } from 'vuex';
  import {  fillterText } from 'utils/index';
  import { loadGridHeight } from "utils/screen";
  export default {
    name: 'index',
    data() {
      return {
        treeShow:true,
        height:undefined,
        needFixedRight:false,
        form: {
          areaId: undefined,
          areaName: undefined,
          pareaName:undefined,
          longitude: undefined,
          latitude: undefined,
          code: undefined,
          pareaId: undefined,
          address: undefined,
          level: undefined,
          status: undefined,
          sort: undefined
        },
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        props: {
          label: 'label',
          children: 'zones',
          isLeaf: 'leaf'
        },
        menuManager_btn_add: true,
        menuManager_btn_edit: true,
        menuManager_btn_del: true,
        menuManager_btn_recover: false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          areaName: undefined,
          areaId: undefined
        },
        status: '',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        level: '',
        rules: {
          areaName: [
            {
              max: 50,
              message: '长度不能超过50个字符',
              trigger: 'blur'

            },
            {
              required: true,
              message: '请输入区域名称',
              trigger: 'blur'
            }
          ],
          longitude: [
            {
              required: true,
              message: '请输入经度',
              trigger: 'blur'
            }
          ],
          latitude: [
            {
              required: true,
              message: '请输入纬度',
              trigger: 'blur'
            }
          ],
          code: [
            {
              max: 50,
              message: '长度不能超过50个字符',
              trigger: 'blur'
            },
            {
              required: true,
              message: '请输入区域编码',
              trigger: 'blur'
            }
          ],
          address: [
            {
              max: 256,
              message: '长度不能超过256个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      }
    },
    computed: {
      ...mapGetters([
        'dict'
      ])

    },
    mounted(){
        //首次整个视图都渲染完毕后执行
        this.$nextTick(function () {
            let tableDiv=  this.$el.querySelector('.el-table__body-wrapper');
            this.needFixedRight =!($(tableDiv).attr("class").indexOf("is-scrolling-none")>=0);
        });
        //监听屏幕的改变
        window.onresize = () => {
            let tableDiv=  this.$el.querySelector('.el-table__body-wrapper');
            this.needFixedRight =!($(tableDiv).attr("class").indexOf("is-scrolling-none")>=0);
            this.height=loadGridHeight()-80;
        }
        this.height=loadGridHeight()-80;
    },
    created() {
      this.getList();
    },
    methods: {
      getTree() {
        fetchTree(this.listQuery).then(data => {
          this.treeData = data;
        });
      },
      loadNode(node, resolve){
        let parentId = "";
        if (node.level === 0) {
          parentId = 0;
        }else {
          parentId = node.data.id;
        }
        fetchTree1(parentId).then(response => {
          resolve(response);
        });
      },
      getList() {
        this.treeShow=false;
        if (this.status === '') {
          this.listQuery.status = 1;
          this.menuManager_btn_edit = true;
          this.menuManager_btn_del = true;
          this.menuManager_btn_recover = false;
        } else {

          this.listQuery.status = this.status;
          if (this.status === '0') {
            this.menuManager_btn_edit = false;
            this.menuManager_btn_del = false;
            this.menuManager_btn_recover = true;
          } else {
            this.menuManager_btn_edit = true;
            this.menuManager_btn_del = true;
            this.menuManager_btn_recover = false;
          }
        }
        page(this.listQuery)
          .then(response => {
            this.list = response.rows;
            this.total = response.total;
            this.listLoading = false;
            this.treeShow=true;
          })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.text.indexOf(value) !== -1;
      },
      getNodeData(data) {
        this.listQuery.areaId = data.id;
        this.listQuery.status = this.status;
        this.getList();
        this.level = data.level;
        this.form.pareaId = data.id;
        this.form.pareaName = data.text;
      },
      handlerAdd() {
        let errMsg;
        if (this.level) {
          if (this.level < 4) {

            this.dialogFormVisible = true;
            this.dialogStatus = 'create';
          } else {
            errMsg = '无法在最后一级地址上增加新地址';
          }
        } else {
          errMsg = '请选择父级菜单';
        }
        if (errMsg) {
          this.$message({
            showClose: true,
            message: errMsg,
            type: 'error'
          });
        }
      },
      deleteArea(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delArea(row.areaId)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                this.getTree();
                this.getList();
              }).catch(() => { });
          }).catch(() => { });
      },
      handleUpdate(row) {
        getArea(row.areaId)
          .then(response => {
            this.form = response.data;
           // this.form.sex = this.form.sex + '';  //需要转为字符
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      recoverArea(row) {
        this.$confirm('此操将恢复数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recoverArea(row.areaId).then(() => {
            this.$notify({
              title: '成功',
              message: '恢复成功',
              type: 'success',
              duration: 2000
            });
            this.getTree();
            this.getList();
          }).catch(() => { });
        }).catch(() => { });
      },
      statusFormatter(row, column, cellValue) {
        return  fillterText(cellValue, this.dict['状态']);
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addArea(this.form)
              .then(() => {
                this.dialogFormVisible = false;
                this.getTree();
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            putArea(this.form.areaId, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getTree();
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
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
    closeDialog(){
        this.resetForm();
    },
      resetForm() {
          this.$nextTick(function() {
              this.$refs["form"].clearValidate();
          });
        this.form = {
          areaId: undefined,
          areaName: undefined,
          longitude: undefined,
          latitude: undefined,
          code: undefined,
          pareaId: this.listQuery.areaId,
          address: undefined,
          level: parseInt(this.level) + parseInt(1),
          status: '1',
          sort: undefined
        }
      }
    }
  }
</script>
