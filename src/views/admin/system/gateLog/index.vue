<template>
  <div class="app-container calendar-list-container">
 <fieldset class="fieldset">
      <legend class="legend">查询条件</legend>
      <div class="field-box">
        <el-form :inline="true" :model="listQuery">
          <el-form-item label="用户名"  class="filter-item">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="用户名" v-model="listQuery.userName"> </el-input>
          </el-form-item>

            <el-form-item label="开始时间" prop="startDate"  class="filter-item" >
              <el-date-picker v-model="startTime" type="date" placeholder="开始日期" ></el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间" prop="endDate"  class="filter-item">
              <el-date-picker v-model="endTime" type="date" placeholder="结束日期" ></el-date-picker>
            </el-form-item>

          <el-form-item>
            <el-button class="filter-item" type="primary"   icon="search" @click="handleFilter">搜索</el-button>
          </el-form-item>
          </el-form>
      </div>
 </fieldset>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" height="400">
      <el-table-column align="center" label="访问人" width="200"    prop="userName">
      </el-table-column>
      <el-table-column width="350px" align="center" label="访问URL" prop="actionUrl">

      </el-table-column>
      <el-table-column width="200px" align="center" label="访问类名" prop="controllerName">

      </el-table-column>
      <el-table-column width="300px" align="center" label="访问方法" prop="controllerMethod">

      </el-table-column>
       <el-table-column width="300px" align="center" label="访问时间" prop="logTime">

      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
import { page,parseTime } from "api/admin/system/gateLog/index";
export default {
  name: "gateLog",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userName: undefined,
        createTimeStart:"",
        createTimeEnd:"",
      },
      startTime:'',
      endTime:'',
      tableKey: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      if(this.compareDate(this.startTime,this.endTime)){
          alert("开始时间不能大于结束时间");
          return;
      }
      this.listLoading = true;
      this.listQuery.createTimeStart=this.startTime? parseTime(this.startTime, "{y}-{m}-{d} {h}:{i}:{s}"):"";
      this.listQuery.createTimeEnd=this.endTime? parseTime(this.endTime, "{y}-{m}-{d} {h}:{i}:{s}"):"";
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
    compareDate(d1,d2)
    {
      //1把字符串格式转换为日期类
      var startTime = new Date(Date.parse(d1));
      var endTime = new Date(Date.parse(d2));
      //2进行比较
      return (startTime>endTime);
    }
  }
};
</script>
