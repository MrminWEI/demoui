<template>
  <div>
    <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" height="500" style="width: 100%">
      <el-table-column v-if="roleManager_element" type="selection" width="55"> </el-table-column>
      <el-table-column  align="center" label="用户编号" prop="userId">
      </el-table-column>
      <el-table-column  align="center" label="管理员账号" prop="mobile">
      </el-table-column>
      <el-table-column  align="center" label="用户名称" prop="realName">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="update()">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  page
} from 'api/admin/system/user/index';
import {
  getUsers,
  modifyUsers
} from 'api/admin/system/role/index';
import {  fillterText } from 'utils/index';
import { mapGetters } from 'vuex';
export default {
  props: {
    roleId: {
      default: '-1'
    }
  },
  data() {
    return {
      roleManager_user: true,
      list: [],
      roleManager_element: true,
      selection: []
    }
  },
  created() {
    this.getList();
    this.initUsers();
  },
  computed: {
    ...mapGetters([
      'dict'
    ])
  },
  watch: {
    'roleId': function() {
      this.getList();
      //  this.initUsers();
    }
  },
  updated() {
    this.initUsers();
  },
  methods: {
    getList() {
      page({ userStatus: 1 ,page: 1,limit: 17,})
        .then(response => {
          this.list = response.rows;
        })
    },
    update() {
      const userIds = [];
      if (this.selection && this.selection.length > 0) {
        this.selection.forEach(user => {
          userIds.push(user.userId);
        });
      }
      modifyUsers(this.roleId, userIds.join(',')).then(() => {
        this.$emit('closeUserDialog');
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    initUsers() {
      getUsers(this.roleId).then(response => {
        const users = response.data;
        if (users && users.length > 0) {
          users.forEach(user => {
            this.selectRow(user);
          });
        }
      });
    },
    selectRow(user) {
      this.list.forEach(row => {
        if (row.userId === user.userId) {
          this.$refs.elementTable.toggleRowSelection(row, true);
        }
      });
    },
    sexFormatter(row, col, cellValue) {
      return  fillterText(cellValue, this.dict['性别']);
    },
    handleSelectionChange(selection, row) {
      this.selection = selection;

    }
  }
}
</script>
