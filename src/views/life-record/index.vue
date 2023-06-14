<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-14 11:03:02
 * @LastEditTime: 2023-06-14 14:10:38
 * @Description : 寿命测试-数据记录
-->
<template>
  <div class="life-record">
    <!-- 顶部 -->
    <div class="top">
      <!-- 标题 -->
      <el-page-header
        class="item"
        title="返回寿命测试"
        content="寿命测试-数据记录"
        @back="handleToLifeTest"
      ></el-page-header>
      <!-- 导出Excel按钮 -->
      <el-button
        class="item"
        :loading="exportExcelLoading"
        icon="el-icon-download"
        type="warning"
        @click="handleExportExcel"
        >导出 Excel</el-button
      >
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      class="table"
      style="width: 96%"
      height="100%"
      :default-sort="{ prop: 'startTime', order: 'ascending' }"
      :stripe="true"
      :border="true"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column type="index" width="50" align="center" />
      <el-table-column
        align="center"
        prop="electric"
        label="型号"
        width="100"
        sortable
      />
      <el-table-column
        align="center"
        prop="startTime"
        label="开始时间"
        width="200"
      />
      <el-table-column
        align="center"
        prop="endTime"
        label="结束时间"
        width="200"
        sortable
      />
      <el-table-column align="center" prop="num" label="往复次数" />
      <el-table-column
        align="center"
        prop="displacementMax"
        label="最大位移"
        width="100"
      />
      <el-table-column
        align="center"
        prop="displacementMin"
        label="最小位移"
        width="100"
      />
      <el-table-column
        align="center"
        prop="pressureAverage"
        label="平均压力"
        width="100"
      />

      <!-- 删除按钮 -->
      <el-table-column label="删除操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="btn">
      <el-button class="item" type="danger" @click="handleRefresh"
        >刷新页面</el-button
      >
    </div>
  </div>
</template>

<script>
import { initDB } from '@/db/index.js'

export default {
  name: 'life-record',

  data() {
    return {
      loading: false, // 表格加载动画
      exportExcelLoading: false, //导出加载动画

      tableData: []
    }
  },

  created() {
    this.initData()
  },

  methods: {
    /**
     * @description: 返回寿命测试页
     */
    handleToLifeTest() {
      this.$router.push({
        path: '/life-test'
      })
    },

    /**
     * @description: 表格数据初始化
     */
    initData() {
      this.loading = true
      const db = initDB()
      db.life_data
        .toArray()
        .then(res => {
          this.tableData = res
        })
        .catch(err => {
          this.$confirm(`${err}。获取数据失败，请点击刷新按钮重试！`, '提示', {
            type: 'warning',
            center: true,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '刷 新',
            cancelButtonText: '返 回'
          })
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.handleToLifeTest()
            })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * @description: 删除按钮
     * @param {*} index
     * @param {*} row
     */
    handleDelete(index, row) {
      this.$confirm('此操作将"永久删除"该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          const db = initDB()
          db.life_data
            .where({
              electric: row.electric,
              startTime: row.startTime,
              endTime: row.endTime
            })
            .delete()
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .then(() => {
              this.initData()
            })
            .catch(() => {
              this.$message({
                message: '删除失败',
                type: 'error',
                duration: 3000
              })
            })
        })
        .catch(() => {})
    },

    /**
     * @description: 导出Excel按钮
     */
    handleExportExcel() {
      if (this.tableData.length) {
        this.exportExcelLoading = true
        // 此处使用懒加载的方式
        import('@/utils/Export2Excel.js')
          .then(excel => {
            const excelTitle = {
              electric: '型号',
              startTime: '开始时间',
              endTime: '结束时间',
              num: '往复次数',
              displacementMax: '最大位移mm',
              displacementMin: '最小位移mm',
              pressureAverage: '平均压力值kg'
            }
            const tHeader = Object.values(excelTitle)
            // 会根据key键的顺序、属性值等动态变化
            const filterVal = Object.keys(excelTitle)
            const exportData = this.formatJson(filterVal, this.tableData)
            excel.export_json_to_excel({
              header: tHeader, // 表头 必填
              data: exportData, // 具体数据 必填
              filename:
                '下蹲与控制反馈系统训练仪-单机版-所有用户信息 ' +
                this.$moment().format('YYYY-MM-DD HH_mm_ss'), // 导出文件名，非必填
              autoWidth: true, // 自适应列宽，非必填
              bookType: 'xlsx' // 导出格式，非必填
            })
          })
          .then(() => {
            this.$message({
              message: '导出Excel成功',
              type: 'success',
              duration: 3000
            })
          })
          .catch(err => {
            this.$message({
              message: `导出Excel失败：${err}`,
              type: 'error',
              duration: 5000
            })
          })
          .finally(() => {
            this.exportExcelLoading = false
          })
      } else {
        this.$message({
          message: '表格数据不能为空！',
          type: 'error',
          duration: 3000
        })
      }
    },
    /**
     * @description: 数据格式化，将 [{},{},...] => [[],[],...]
     * @param {Array} filterVal key键
     * @param {Array} jsonData [{},{},...]
     * @return {Array} 二维数组 [[],[],...]
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/life-record'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.life-record {
  width: 100%;
  height: 100%;
  @include flex(column, stretch, center);

  /* 顶部 */
  .top {
    margin: 10px 0;
    @include flex(row, center, center);
    .item {
      margin-right: 50px;
    }
  }

  /* 表格 */
  .table {
    flex: 1;
  }

  .btn {
    margin: 10px 0;
    @include flex(row, center, center);
    .item {
      font-size: 22px;
    }
  }
}
</style>
