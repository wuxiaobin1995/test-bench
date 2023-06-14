<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-14 11:03:02
 * @LastEditTime: 2023-06-14 11:32:15
 * @Description : 寿命测试-数据记录
-->
<template>
  <div class="life-record">
    <!-- 顶部 -->
    <div class="top">
      <!-- 标题 -->
      <el-page-header
        title="返回寿命测试"
        content="寿命测试-数据记录"
        @back="handleToLifeTest"
      ></el-page-header>
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
      tableData: [],
      loading: false // 表格加载动画
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
    // 标题
    .text {
      font-size: 32px;
      color: green;
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
