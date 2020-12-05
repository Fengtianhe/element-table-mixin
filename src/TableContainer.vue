<template>
  <div class="table-container">
    <div class="table">
      <el-table
          :stripe="stripe"
          :data="tableData.lists"
          :border="border"
          :size="size"
      >
        <el-table-column
            v-for="col in columns"
            :key="`${col.label}-${col.prop}`"
            :label="col.label"
            :prop="col.prop"
            :formatter="(row, column, cellValue) => formatterTableColumnValue(row, column, cellValue, col)"
            :width="col.width || 'auto'"
            :align="col.align || 'left'"
        ></el-table-column>
        <!--   插槽     -->
        <slot name="column"></slot>

        <el-table-column label="操作" v-if="tableOps.length" width="50" align="center">
          <template slot-scope="scope">
            <el-dropdown @command="command => handleOpTableItem(command, scope)" size="mini">
              <span class="el-dropdown-link">
                <i class="el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="op in tableOps"
                    :command="op.command"
                    v-if="showBtn(op, scope)"
                >{{op.name}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
          style="margin-left: -10px"
          background
          @current-change="fetchWithPagination"
          :current-page.sync="tableData.pageNumber"
          :page-size="tableData.pageSize"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="tableData.total"
      ></el-pagination>

    </div>
  </div>
</template>

<script>
import TableMixin from './TableMixin';
import TableMixinConfig from './TableMixinConfig'

export default {
  name: 'TableContainer',
  mixins: [TableMixin],
  props: {
    url: {
      type: String,
      required: true,
      default: ''
    },
    columns: {
      type: Array,
      required: true,
      default: function () {
        return [];
      }
    },
    tableOps: {
      type: Array,
      default: function () {
        return []
      }
    },
    elTableStripe: {
      type: Boolean,
      default: undefined
    },
    elTableBorder: {
      type: Boolean,
      default: undefined
    },
    elTableSize: {
      type: String,
      default: undefined
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    filters: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      baseUrl: this.url,
      tableData: {
        pageNumber: TableMixinConfig.PAGE_NUM_DEFAULT,
        pageSize: TableMixinConfig.PAGE_SIZE_DEFAULT
      },
      filterForm: this.filterForm,
      stripe: this.elTableStripe === undefined ? TableMixinConfig.EL_TABLE_STRIPE : this.elTableStripe,
      border: this.elTableBorder === undefined ? TableMixinConfig.EL_TABLE_BORDER : this.elTableBorder,
      size: this.elTableSize || TableMixinConfig.EL_TABLE_SIZE
    };
  },
  created () {
    if (this.baseUrl && this.autoLoad) {
      this.setTableFilter();
    }
  },
  watch: {
    'filters': {
      immediate: true,
      deep: true,
      handler: function (n) {
        this.filterForm = n
      }
    },
    'filterForm': {
      immediate: true,
      deep: true,
      handler: function (n) {
        this.$emit('update:filters', n)
      }
    }
  },
  methods: {
    formatterTableColumnValue (row, column, cellValue, dataitem) {
      if (dataitem.formatter) {
        return dataitem.formatter(row, column, cellValue)
      }
      return cellValue
    },
    handleOpTableItem (command, scope) {
      const opMap = this.tableOps.reduce((res, item) => {
        res[item.command] = item
        return res
      }, {})

      opMap[command].handle && opMap[command].handle(scope)
    },
    showBtn (config, scope) {
      let showBtn = !config.hide || !config.hide(scope)
      return showBtn
    }
  }
};
</script>

<style scoped>
  .table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

  }

  .table {
    flex: 1;
  }

  .pagination {
    padding: 0 10px;
    flex: 0 0 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
