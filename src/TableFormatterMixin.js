const TableFormatterMixin = {
  methods: {
    dateTimeFormat(format, time = new Date()) {
      const o = {
        "M+": time.getMonth() + 1, // month
        "d+": time.getDate(), // day
        "h+": time.getHours(), // hour
        "m+": time.getMinutes(), // minute
        "s+": time.getSeconds(), // second
        "q+": Math.floor((time.getMonth() + 3) / 3), // quarter
        "S": time.getMilliseconds() // millisecond
      }

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length))
        }
      }
      return format
    },

    numberFormat(value) {
      if (value === null || value === undefined) return '-'

      let isMinus = value < 0 // 是否是负数

      value = isMinus ? value.toString().substr(1) : value.toString()
      value = value.replace(/^(\d*)$/, '$1.')
      value = (`${value}00`).replace(/(\d*\.\d\d)\d*/, '$1')
      value = value.replace('.', ',')
      const re = /(\d)(\d{3},)/

      while (re.test(value)) {
        value = value.replace(re, '$1,$2')
      }

      value = value.replace(/,(\d\d)$/, '.$1')

      return isMinus ? '-' + value.replace(/^\./, '0.') : value.replace(/^\./, '0.')
    },


    tableFormatDateTime(row, column, cellValue) {
      if (!cellValue) return '-';
      // cellValue = cellValue.replace(new RegExp(/-/gm), '/');
      let dt = new Date(Number(cellValue));

      return this.dateTimeFormat('yyyy-MM-dd hh:mm:ss', dt);
    },


// 格式化时间 Date 兼容 Safari
    tableFormatDate(row, column, cellValue) {
      if (!cellValue) return '-';
      // cellValue = cellValue.replace(new RegExp(/-/gm), '/');
      let dt = new Date(Number(cellValue));

      return this.dateTimeFormat('yyyy-MM-dd', dt);
    },


    tableFormatNumber(row, column, cellValue) {
      return numberFormat(cellValue);
    },


    tableFormatPercent(row, column, cellValue) {
      return Number(cellValue * 100).toFixed(2) + '%';
    },


    tableIsNull(row, column, cellValue) {
      if (cellValue) {
        return cellValue;
      }
      return '-';
    }
  }
  /**
   * yyyy-MM-dd hh:mm:ss q S
   * @param format
   * @param time
   * @returns {*}
   */

}

export default TableFormatterMixin