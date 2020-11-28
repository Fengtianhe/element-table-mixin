# element-table-mixin
基于ElementUI 封装的TableMixin

特性
- [x] 请求列表数据  
- [x] 带筛选项的列表数据请求  
- [x] 支持自定义返回体取值
- [x] 支持自定义基于Axios封装的请求函数

***
### 使用
```javascript
<template>
  <div>
    ...
    <table-container
        :url='tableDataUrl'
        style="flex:1"
        :columns="tableColumns"
        :table-ops="tableOps"
        ref="table">
          <template slot="column">
            <el-table-cloumn></el-table-cloumn>
          </template>
    </table-container>
    ...
  </div>
</template>

<script>
import {TableContainer} from 'element-table-mixin';

export default {
  ...,
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
        {label: '创建时间', prop: 'createdAt', formatter: this.tableFormatDate}
      ],
      tableOps: [
        {command: 'EDIT', name: '编辑', handle: this.showEditDialog},
        {command: 'DISABLE', name: '停用', handle: this.showEditDialog}
      ],
      ...
    };
  },
  ...,
  methods:{
    showEditDialog(scope){
      
    },
    tableFormatDate(row, column, cellValue){
      
    }
  }
};
</script>
```

***
###参数
#####props
|  prop    | require | 描述       | type                | 说明 |
|  ----    | ----    | ----       |  ----               | ---- |
| columns  | true    | 表格的列    | Array<ColumnObject> | ColumnObject = {label: '', prop: '', formatter: (row, column, cellValue) => {}} |
| tableOps | false   | 行数据操作项 | Array<OpObject>     | OpObject = {command: '', name: '', handle: (scope) => {}} |
| url      | true    | 列表请求地址 | String              |
#####event
|  事件名   | 说明  |
|  ----  | ----  |
#####methods
|  方法           | 说明  |
|  ----          | ----  |
| resetFilter()  | 重置筛选项并查询 |
| setFilter()    | 设置筛选项并查询 |
#####slot
| name | 说明 |
| --- | --- |
| column | 自定义列 |
***
交流联系方式：
QQ：545704061

微信：fth545704061
