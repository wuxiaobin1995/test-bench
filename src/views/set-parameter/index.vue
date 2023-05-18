<!--
 * @Author      : Mr.bin
 * @Date        : 2023-04-18 09:57:41
 * @LastEditTime: 2023-05-18 17:02:17
 * @Description : 设置参数（导程、减速比）
-->
<template>
  <div class="set-parameter">
    <div class="wrapper">
      <el-page-header
        class="page"
        title="返回首页"
        content="设置参数"
        @back="handleToHome"
      ></el-page-header>

      <div class="box">
        <div class="miniature">
          <div class="title">微型</div>
          <div class="lead">
            <span>导程(mm)：</span>
            <div class="item">
              <el-input-number
                v-model="leadMin"
                :precision="1"
                :step="1"
                :min="0"
                :max="10000"
                @change="handleChangeLeadMin"
              ></el-input-number>
            </div>
          </div>

          <div class="reduction">
            <span>减速比：</span>
            <div class="item">
              <el-input-number
                v-model="reductionMin"
                :precision="1"
                :step="1"
                :min="1"
                :max="10000"
                @change="handleChangeReductionMin"
              ></el-input-number>
            </div>
          </div>
        </div>

        <div class="small">
          <div class="title">小型</div>
          <div class="lead">
            <span>导程(mm)：</span>
            <div class="item">
              <el-input-number
                v-model="leadSmall"
                :precision="1"
                :step="1"
                :min="0"
                :max="10000"
                @change="handleChangeLeadSmall"
              ></el-input-number>
            </div>
          </div>

          <div class="reduction">
            <span>减速比：</span>
            <div class="item">
              <el-input-number
                v-model="reductionSmall"
                :precision="1"
                :step="1"
                :min="1"
                :max="10000"
                @change="handleChangeReductionSmall"
              ></el-input-number>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'set-parameter',

  data() {
    return {
      // 导程
      leadMin: 2.5,
      leadSmall: 2.5,
      // 减速比
      reductionMin: 1,
      reductionSmall: 7
    }
  },

  created() {
    this.leadMin = JSON.parse(window.localStorage.getItem('lead-min'))
    this.leadSmall = JSON.parse(window.localStorage.getItem('lead-small'))
    this.reductionMin = JSON.parse(window.localStorage.getItem('reduction-min'))
    this.reductionSmall = JSON.parse(
      window.localStorage.getItem('reduction-small')
    )
  },

  methods: {
    /**
     * @description: 回到首页
     */
    handleToHome() {
      this.$router.push({
        path: '/'
      })
    },

    /**
     * @description: 值变化时触发
     * @param {*} value
     */
    handleChangeLeadMin(value) {
      window.localStorage.setItem('lead-min', JSON.stringify(value))
      this.$message({
        message: '修改微型电缸导程成功',
        type: 'success',
        duration: 1500
      })
    },

    /**
     * @description: 值变化时触发
     * @param {*} value
     */
    handleChangeReductionMin(value) {
      window.localStorage.setItem('reduction-min', JSON.stringify(value))
      this.$message({
        message: '修改微型电缸减速比成功',
        type: 'success',
        duration: 1500
      })
    },

    /**
     * @description: 值变化时触发
     * @param {*} value
     */
    handleChangeLeadSmall(value) {
      window.localStorage.setItem('lead-small', JSON.stringify(value))
      this.$message({
        message: '修改小型电缸导程成功',
        type: 'success',
        duration: 1500
      })
    },

    /**
     * @description: 值变化时触发
     * @param {*} value
     */
    handleChangeReductionSmall(value) {
      window.localStorage.setItem('reduction-small', JSON.stringify(value))
      this.$message({
        message: '修改小型电缸减速比成功',
        type: 'success',
        duration: 1500
      })
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/set-parameter'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.set-parameter {
  width: 100%;
  height: 100%;
  @include flex(row, center, center);

  .wrapper {
    width: 86%;
    height: 90%;
    border-radius: 34px;
    background-color: #ffffff;
    box-shadow: 0 0 10px #929292;
    padding: 40px;
    @include flex(column, center, center);
    position: relative;

    .page {
      position: absolute;
      top: 20px;
      left: 30px;
    }

    .box {
      width: 100%;
      @include flex(row, space-around, center);
      .miniature {
        font-size: 20px;
      }

      .small {
        font-size: 20px;
      }

      .title {
        font-size: 30px;
        margin-bottom: 20px;
      }

      .lead {
        @include flex(row, flex-start, center);
        margin-bottom: 40px;
      }
      .reduction {
        @include flex(row, flex-start, center);
      }
    }
  }
}
</style>
