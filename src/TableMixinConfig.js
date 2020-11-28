import axios from "axios";

const TableMixinConfig = {
  // 默认请求
  REQUEST: axios,

  // 每页默认数量
  PAGE_SIZE_DEFAULT: 15,
  // 默认页码
  PAGE_NUM_DEFAULT: 1,
  // 请求的页码字段
  REQUEST_PAGENUM_FIELD: 'pageNum',
  // 请求的每页条数字段
  REQUEST_PAGESIZE_FIELD: 'pageSize',

  // 列表数据对应字段
  RESPONSE_LIST_FIELD: 'data.lists',
  // 每页数量对应的字段
  RESPONSE_PAGESIZE_FIELD: 'data.size',
  // 页码对应的字段
  RESPONSE_PAGENUM_FIELD: 'data.pageNum',
  // 总条数对应的字段
  RESPONSE_TOTAL_FIELD: 'data.total',

  // tableData 对应的字段
  TABLE_DATA_FIELD: 'tableData',

  // el table 全局配置
  EL_TABLE_STRIPE: true,
  EL_TABLE_BORDER: true,
  EL_TABLE_SIZE: 'small'
}
export default TableMixinConfig;
