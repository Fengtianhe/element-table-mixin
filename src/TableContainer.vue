<template>
  <div class="table-container">
    <div class="table">
      <el-table stripe :data="tableData.lists">
        <el-table-column
            v-for="col in columns"
            :key="`${col.label}-${col.prop}`"
            :label="col.label"
            :prop="col.prop"
            :formatter="(row, column, cellValue) => formatterTableColumnValue(row, column, cellValue, col)"
        ></el-table-column>
        <!--   插槽     -->
        <slot name="column"></slot>

        <el-table-column label="操作" v-if="tableOps.length">
          <template slot-scope="scope">
            <el-dropdown @command="command => handleOpTableItem(command, scope)" size="mini">
              <span class="el-dropdown-link">
                <i class="el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="op in tableOps"
                    :command="op.command"
                    :key="op.command"
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
    }
  },
  data() {
    return {
      baseUrl: this.url,
      tableData: {},
      filterForm: {}
    };
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
    }
  }
};
</script>

<style scoped lang="less">
  .table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

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
  }
</style>