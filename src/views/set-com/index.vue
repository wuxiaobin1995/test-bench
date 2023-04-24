<!--
 * @Author      : Mr.bin
 * @Date        : 2023-03-10 15:16:12
 * @LastEditTime: 2023-04-20 14:11:33
 * @Description : 设置com口
-->
<template>
  <div class="set-com">
    <div class="wrapper">
      <el-page-header
        class="page"
        title="返回首页"
        content="设置COM口"
        @back="handleToHome"
      ></el-page-header>

      <div class="box">
        <div class="item">
          <span class="text">接收数据口：</span>
          <el-select
            v-model="comReceive"
            placeholder="请选择接收数据口"
            @change="handleChangeComReceive"
          >
            <el-option
              v-for="item in comArray"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="item">
          <span class="text">微型电缸控制口：</span>
          <el-select
            v-model="comSendMiniature"
            placeholder="请选择微型电缸控制口"
            @change="handleChangeComSendMiniature"
          >
            <el-option
              v-for="item in comArray"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="item">
          <span class="text">小型电缸控制口：</span>
          <el-select
            v-model="comSendSmall"
            placeholder="请选择小型电缸控制口"
            @change="handleChangeComSendSmall"
          >
            <el-option
              v-for="item in comArray"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'

export default {
  name: 'set-com',

  data() {
    return {
      comArray: [],

      comReceive: '',
      comSendMiniature: '',
      comSendSmall: ''
    }
  },

  created() {
    this.comReceive = window.localStorage.getItem('com-receive')
    this.comSendMiniature = window.localStorage.getItem('com-send-miniature')
    this.comSendSmall = window.localStorage.getItem('com-send-small')

    this.initSerialPort()
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
     * @description: 初始化串口对象，遍历串口
     */
    initSerialPort() {
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          this.comArray = []
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              this.comArray.push({ value: port.path })
            }
          }
        })
        .catch(err => {
          this.$confirm(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              center: true,
              confirmButtonText: '刷新页面',
              cancelButtonText: '返回首页'
            }
          )
            .then(() => {
              this.handleRefresh()
            })
            .catch(() => {
              this.handleToHome()
            })
        })
    },

    /**
     * @description: 接收数据口的值变化时触发
     * @param {*} value
     */
    handleChangeComReceive(value) {
      window.localStorage.setItem('com-receive', value)
      this.$message({
        message: '修改com-receive的值成功',
        type: 'success',
        duration: 1500
      })
    },

    /**
     * @description: 微型电缸发送指令口的值变化时触发
     * @param {*} value
     */
    handleChangeComSendMiniature(value) {
      window.localStorage.setItem('com-send-miniature', value)
      this.$message({
        message: '修改微型电缸发送指令口的值成功',
        type: 'success',
        duration: 1500
      })
    },

    /**
     * @description: 小型电缸发送指令口的值变化时触发
     * @param {*} value
     */
    handleChangeComSendSmall(value) {
      window.localStorage.setItem('com-send-small', value)
      this.$message({
        message: '修改小型电缸发送指令口的值成功',
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
          routerName: JSON.stringify('/set-com'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.set-com {
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
      @include flex(row, center, center);
      .item {
        margin: 0 60px;
        @include flex(column, center, stretch);
        .text {
          margin-bottom: 10px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
