# element-table-mixin
基于ElementUI 封装的TableMixin

特性
- [x] 请求列表数据  
- [x] 带筛选项的列表数据请求  
- [x] 支持自定义返回体取值
- [x] 支持自定义基于Axios封装的请求函数

***
### 安装
`yarn add element-table-mixin` or `npm i element-table-mixin`

### 使用
main.js
```javascript
import axios from 'axios'
import {TableMixinConfig} from 'element-table-mixin'

// 其他配置详见文档
TableMixinConfig.REQUEST = axios
```

```vue
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
### 效果图
![alt 效果图](http://blog.fengtianhe.cn/images/element-table-mixin.png)

***
### 参数
##### props
|  prop    | require | 描述       | type                | 说明 |
|  ----    | ----    | ----       |  ----               | ---- |
| columns  | true    | 表格的列    | Array<ColumnObject> | ColumnObject 见下面例子 |
| tableOps | false   | 行数据操作项 | Array<OpObject>     | OpObject = {command: '', name: '', handle: (scope) => {}} |
| url      | true    | 列表请求地址 | String              |
| elTableStripe      | false    | 表格是否使用斑马线 | Boolean              | 全局可使用TableMixinConfig配置 
| elTableBorder      | false    | 表格是否使用边框 | Boolean              | 全局可使用TableMixinConfig配置
| elTableSize      | false    | 表格的尺寸 | String              | 'mini, small, medium' 全局可使用TableMixinConfig配置
##### ColumnObject
```json
{
    "label": "创建时间", 
    "prop": "createdAt", 
    "align": "center", 
    "width": "130px", 
    "formatter": tableFormatDate,
}
```

##### event
|  事件名   | 说明  |
|  ----  | ----  |
##### methods
|  方法           | 说明  |
|  ----          | ----  |
| resetFilter()  | 重置筛选项并查询 |
| setFilter()    | 设置筛选项并查询 |
##### slot
| name | 说明 |
| --- | --- |
| column | 自定义列 |
##### TableMixinConfig
| name | 说明 |
| --- | --- |
| REQUEST | 默认请求使用 axios, |
| PAGE_SIZE_DEFAULT | 每页默认数量 15, |
| PAGE_NUM_DEFAULT | 默认页码 1, |
| REQUEST_PAGENUM_FIELD | 请求的页码字段 pageNum, |
| REQUEST_PAGESIZE_FIELD | 请求的每页条数字段 pageSize, |
| RESPONSE_LIST_FIELD | 列表数据对应字段 data.lists, |
| RESPONSE_PAGESIZE_FIELD | 每页数量对应的字段 data.size, |
| RESPONSE_PAGENUM_FIELD | 页码对应的字段 data.pageNum, |
| RESPONSE_TOTAL_FIELD | 总条数对应的字段 data.total, |
| EL_TABLE_STRIPE | 全局设置表格样式：斑马线 |
| EL_TABLE_BORDER | 全局设置表格样式：边框 |
| EL_TABLE_SIZE | 全局设置表格样式：尺寸 |

##### 默认配置的返回值
如果后端的返回值和默认不一致，请调整配置项
```json
{
  ...,
  "data": {
    "lists": [],
    "size": 15,
    "pageNum": 1,
    "total": 50
  }
}
```
***
交流联系方式：
QQ：545704061

微信：fth545704061
