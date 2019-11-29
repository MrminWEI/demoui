<template>
  <div>
    <div style="margin-top: 5px;margin-bottom: 5px">
      <el-button type="primary"  v-if="groupManager_menu" @click="update">保存</el-button>
    </div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree class="filter-tree"
             style="height:500px;overflow-y: auto;"
             :data="treeData"
             show-checkbox node-key="id"
             highlight-current
             :props="defaultProps"
             :filter-node-method="filterNode"
             ref="menuTree" default-expand-all>
    </el-tree>
  </div>
</template>
<script>
import {
  fetchTree
} from 'api/admin/system/menu/index';
import { getMenuAuthority, modifyMenuAuthority } from 'api/admin/system/role/index';
import { mapGetters } from 'vuex';

export default {
  name: 'authority',
  props: {
    roleId: {
      default: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
    'roleId': function() {
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
      'dict'
    ])
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      groupManager_menu: true
    };
  },
  methods: {
    update() {
      this.$emit('closeAuthorityDialog');
      const nodes = this.$refs.menuTree.getCheckedNodes();
      const ids = [];
      for (let i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id);
      }
      modifyMenuAuthority(this.roleId, {
        menuIds: ids.join()
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    getList() {
      fetchTree().then(data => {
        this.treeData = data;
        this.initAuthoritys();
      });
    },
    initAuthoritys() {
      getMenuAuthority(this.roleId).then(response => {
        const result = [];
        for (let i = 0; i < response.data.length; i++) {
          result.push(response.data[i].menuId);
        }
        this.$refs.menuTree.setCheckedKeys(result);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    }
  }
}
</script>
