<template>
  <div class="pagination-container">
    <div class="pagination-summary">共{{ tableData.total }}条</div>
    <el-pagination
        style="margin-left: -10px"
        background
        @current-change="fetchWithPagination"
        :current-page.sync="tableData.pageNumber"
        :page-size="tableData.pageSize"
        :layout="layout"
        :total="tableData.total"
    ></el-pagination>
  </div>
</template>

<script>
import TableMixin from "./TableMixin";

export default {
  name: "TablePagination",
  mixins: [TableMixin],
  props: {
    baseUrl: {
      type: String,
      required: true
    },
    datasource: {
      type: Object,
      required: true
    },
    filterForm: {
      type: Object,
      default: function () {
        return {}
      }
    },
    layout: {
      type: String,
      default: "sizes, prev, pager, next, jumper, ->, total, slot"
    }
  },
  data() {
    return {
      tableData: this.datasource
    }
  },
  methods: {},
  watch: {
    datasource: {
      deep: true,
      immediate: true,
      handler: function () {
        this.tableData = this.datasource
      }
    },
    tableData: {
      deep: true,
      immediate: true,
      handler: function () {
        this.$emit("update:datasource", this.tableData)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  flex: 0 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container .pagination-summary {
  font-weight: 700;
  color: #909399;
  font-size: 12px;
}
</style>
