import TableMixinObjectHelper from 'element-table-mixin/src/TableMixinObjectHelper';
import TableMixinConfig from "./TableMixinConfig";

const {getPropByPath} = TableMixinObjectHelper

const TableMixin = {
  methods: {
    /**
     * 从filterForm中获取筛选项
     */
    setTableFilter () {
      const self = this;
      const baseUrl = self.baseUrl;
      if (baseUrl) {
        console.log('table-mixin: mounted function; baseUrl: ', baseUrl);
        if (!this.filterForm) {
          throw new Error('请在data中定义filterForm属性，类型为Object');
        }
        let urlQuery = self.$route.query;
        if (urlQuery && Object.keys(urlQuery).length > 0) {
          urlQuery = JSON.parse(JSON.stringify(urlQuery));

          for (let key in urlQuery) {
            // 如果筛选项存在
            if (typeof (this.filterForm[key]) !== 'undefined') {
              // 如果定义了筛选项的类型
              if (this.filterType && this.filterType[key]) {
                if (this.filterType[key] === 'array' && typeof (urlQuery[key]) === 'string') {
                  this.filterForm[key] = [urlQuery[key]];
                } else if (this.filterType[key] === 'boolean' && typeof (urlQuery[key]) === 'string') {
                  this.filterForm[key] = urlQuery[key] === 'true';
                }
              } else {
                this.filterForm[key] = urlQuery[key];
              }
            }
          }
        }

        if (urlQuery[TableMixinConfig.REQUEST_FIELD_PAGENUM]) {
          self['tableData'][TableMixinConfig.REQUEST_FIELD_PAGENUM] = urlQuery[TableMixinConfig.REQUEST_FIELD_PAGENUM] ? parseInt(urlQuery[TableMixinConfig.REQUEST_FIELD_PAGENUM]) : TableMixinConfig.PAGE_NUM_DEFAULT;
        }
        if (urlQuery[TableMixinConfig.REQUEST_FIELD_PAGESIZE]) {
          self['tableData'][TableMixinConfig.REQUEST_FIELD_PAGESIZE] = urlQuery[TableMixinConfig.REQUEST_FIELD_PAGESIZE] ? parseInt(urlQuery[TableMixinConfig.REQUEST_FIELD_PAGESIZE]) : TableMixinConfig.PAGE_SIZE_DEFAULT;
        }

        self.setFilter();
      }
    },
    resetFilter (filters = {}) {
      const self = this;
      for (let f in self.filterForm) {
        self.filterForm[f] = null;
      }
      self.setUrlFilters(filters);
    },
    setFilter () {
      const self = this;
      self.setUrlFilters(self.getFilters());
    },
    getFilters: function () {
      const s = {};
      const self = this;
      let filters = self.filterForm;
      for (const f in filters) {
        let filter = filters[f];
        if (filter) {
          if (typeof (filter) === 'number' || typeof (filter) === 'string' || typeof (filter) === 'boolean') {
            s[f] = filter;
            continue;
          }
          if (typeof (filter) === 'object' && filter !== null) {
            const match = JSON.stringify(filter);
            if (match.indexOf('000Z') >= 0) {
              const dt = new Date(filter);
              s[f] = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-').replace(/(?=\b\d\b)/g, '0');
            } else {
              s[f] = filter;
            }
          }
        }
      }
      return s;
    },
    setUrlFilters: function (filters) {
      console.log('table-mixin: setUrlFilters function');
      const self = this;
      filters[TableMixinConfig.REQUEST_FIELD_PAGENUM] = (filters[TableMixinConfig.REQUEST_FIELD_PAGENUM] ? filters[TableMixinConfig.REQUEST_FIELD_PAGENUM] : self['tableData'][TableMixinConfig.REQUEST_FIELD_PAGENUM]) || TableMixinConfig.PAGE_NUM_DEFAULT;
      filters[TableMixinConfig.REQUEST_FIELD_PAGESIZE] = (filters[TableMixinConfig.REQUEST_FIELD_PAGESIZE] ? filters[TableMixinConfig.REQUEST_FIELD_PAGESIZE] : self['tableData'][TableMixinConfig.REQUEST_FIELD_PAGESIZE]) || TableMixinConfig.PAGE_SIZE_DEFAULT;
      self.$router.replace({path: self.$route.path, query: filters});
      self.fetchTableData(filters);
    },
    async fetchTableData (params = {}) {
      const self = this;
      const baseUrl = self.baseUrl;
      const method = (self.tableRequestMethod || 'get').toLocaleLowerCase();
      params[TableMixinConfig.REQUEST_FIELD_PAGENUM] = params[TableMixinConfig.REQUEST_FIELD_PAGENUM] ? params[TableMixinConfig.REQUEST_FIELD_PAGENUM] : this['tableData'][TableMixinConfig.REQUEST_FIELD_PAGENUM] ? this['tableData'][TableMixinConfig.REQUEST_FIELD_PAGENUM] : TableMixinConfig.PAGE_NUM_DEFAULT;
      params[TableMixinConfig.REQUEST_FIELD_PAGESIZE] = params[TableMixinConfig.REQUEST_FIELD_PAGESIZE] ? params[TableMixinConfig.REQUEST_FIELD_PAGESIZE] : this['tableData'][TableMixinConfig.REQUEST_FIELD_PAGESIZE] ? this['tableData'][TableMixinConfig.REQUEST_FIELD_PAGESIZE] : TableMixinConfig.PAGE_SIZE_DEFAULT;
      // options.orderBy = this.filterForm && this.filterForm.orderBy ? this.filterForm.orderBy : ''
      if (baseUrl) {
        const axiosRequestConfig = {
          method,
          url: baseUrl,
          params: method === 'get' ? params : null,
          data: method === 'post' ? params : null
        };
        try {
          const response = await TableMixinConfig.REQUEST.request(axiosRequestConfig);
          if (!response) {
            throw Error('unknown table data response');
          }

          self['tableData'] = {
            lists: getPropByPath(response, TableMixinConfig.RESPONSE_LIST_FIELD) || [],
            pageSize: getPropByPath(response, TableMixinConfig.RESPONSE_PAGESIZE_FIELD) || TableMixinConfig.PAGE_SIZE_DEFAULT,
            pageNumber: getPropByPath(response, TableMixinConfig.RESPONSE_PAGENUM_FIELD) || TableMixinConfig.PAGE_NUM_DEFAULT,
            total: getPropByPath(response, TableMixinConfig.RESPONSE_TOTAL_FIELD) || 0
          };
          self.afterFetchTableData && self.afterFetchTableData();
        } catch (e) {
          throw new Error("request failure, e => ", e)
        }
      }
    },
    // 排序数据
    handleTableSortChange ({column, prop, order}) {
      console.log(column, prop, order);
      let sortType = '';
      // 驼峰转下划线
      prop = prop.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (order === 'ascending') {
        sortType = `${prop} asc`;
      } else if (order === 'descending') {
        sortType = `${prop} desc`;
      }
      this.filterForm.orderBy = sortType;
      this.setFilter();
    },
    // 分页获取数据，先拿到筛选项的数据，再处理分页
    fetchWithPagination: function (currentPage) {
      console.log('table-mixin: fetchWithPagination function');
      const self = this;
      let urlQuery = self.getFilters();
      urlQuery[TableMixinConfig.REQUEST_FIELD_PAGENUM] = currentPage;
      if (self['tableData'].total) {
        self.setUrlFilters(urlQuery);
      }
    },
    fetchWithPageSize: function (pageSize) {
      console.log('table-mixin: fetchWithPageSize function');
      const self = this;
      self['tableData']['pageSize'] = pageSize;
      self.setFilter();
    }
  }
};

export default TableMixin;
