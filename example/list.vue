<template>
  <div class="page">
    <div class="filter-container">
      <el-form inline size="mini">
        <el-form-item label="应用ID">
          <el-input v-model="filterForm.appId"></el-input>
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model="filterForm.appName"></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="filterForm.creator"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$refs['table'].setFilter()">查询</el-button>
          <el-button @click="$refs['table'].resetFilter()">重置条件</el-button>
          <el-button @click="showDetailDialog({})">新增应用</el-button>
        </el-form-item>
      </el-form>
    </div>

    <table-container
        :url='tableDataUrl'
        style="flex:1"
        :columns="tableColumns"
        :table-ops="tableOps"
        ref="table">
      <template slot="column">

      </template>
    </table-container>

    <el-dialog :visible.sync="dialog">
      <div slot="title">{{dialogType}}应用</div>

      <el-form label-width="80px">
        <el-form-item label="应用ID" required>
          <el-input v-model="dialogForm.appId"></el-input>
        </el-form-item>
        <el-form-item label="应用名称" required>
          <el-input v-model="dialogForm.appName"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onCancelSubmit()">取消</el-button>
        <el-button type="primary" @click="onConfirmSubmit()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {TableContainer} from 'element-table-mixin';
import {AppApplicationService} from '@web/service';
import {tableFormatDate} from "@common/utils/table";

export default {
  name: 'list',
  components: {TableContainer},
  data () {
    return {
      tableDataUrl: AppApplicationService.URL_APP_APPLICATION_LIST,
      filterForm: {
        appId: '',
        appName: '',
        creator: ''
      },
      tableColumns: [
        {label: '应用ID', prop: 'appId'},
        {label: '应用名称', prop: 'appName'},
        {label: '创建人', prop: 'creatorName'},
        {label: '创建时间', prop: 'createdAt', align: 'center', width: '130px', formatter: tableFormatDate}
      ],
      tableOps: [
        {command: 'EDIT', name: '编辑', handle: this.showEditDialog},
        {command: 'DISABLE', name: '停用', handle: this.showEditDialog},
        {command: 'CAT_RESOURCE', name: '查看资源', handle: this.showEditDialog},
      ],
      dialog: false,
      dialogType: '新增',
      dialogForm: {
        appId: '',
        appName: ''
      }
    };
  },
  methods: {
    showDetailDialog (data = {}) {
      this.dialogForm = data;
      this.dialog = true;
    },
    onCancelSubmit () {
      this.dialog = false;
      this.dialogForm = {};
    },
    async onConfirmSubmit () {
      const response = await AppApplicationService.add(this.dialogForm)
      if (response.code === 200) {
        this.$message.success('添加成功')
        this.onCancelSubmit()
        this.$refs['table'].resetFilter()
      }
    },
    showEditDialog (scope) {
      console.log(scope)
    }
  }
};
</script>

<style scoped lang="less">
  .page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 5px;

    .filter-container {
      padding: 10px;
    }
  }
</style>
