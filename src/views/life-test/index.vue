<!--
 * @Author      : Mr.bin
 * @Date        : 2023-05-16 09:29:06
 * @LastEditTime: 2023-05-26 11:48:58
 * @Description : 寿命测试
-->
<template>
  <div class="life-test">
    <!-- 微型电缸 -->
    <div class="miniature">
      <el-divider>微型电缸</el-divider>

      <div class="btn">
        <el-button
          type="primary"
          class="item"
          :disabled="isMiniature"
          @click="handleStartMiniature"
          >开 始</el-button
        >
        <el-button
          type="danger"
          class="item"
          :disabled="!isMiniature"
          @click="handleStopMiniature"
          >结 束</el-button
        >
        <el-button type="info" class="item" @click="handleBack"
          >返 回</el-button
        >
        <el-button type="info" class="item" @click="handleRecordMiniature"
          >数据记录</el-button
        >
        <el-button type="info" class="item" @click="handleRefresh"
          >刷 新</el-button
        >
      </div>

      <el-divider></el-divider>

      <div class="num">
        <div class="value">往返次数：{{ numMiniature }}</div>
        <div class="value">位移的值：{{ displacementMiniature }}</div>
        <div class="value">位置标志位：{{ numIsMiniature }}</div>
      </div>

      <div class="set">
        <!-- 转速 -->
        <div class="speed">
          <el-radio-group v-model="radioMiniature">
            <el-radio label="开启">开启</el-radio>
            <el-radio label="关闭">关闭</el-radio>
          </el-radio-group>
          <div class="value">
            <span>请输入转速的值(转/分钟)：</span>
            <el-input-number
              v-model="speedMiniature"
              :precision="0"
              :step="1"
              :min="1"
              :max="1000000"
            ></el-input-number>
          </div>
          <el-button
            type="success"
            class="btn-speed"
            :disabled="isMiniature"
            @click="handleSetSpeedMiniature"
            >设定转速</el-button
          >
        </div>
      </div>
    </div>

    <el-divider class="divider" direction="vertical"></el-divider>

    <!-- 小型电缸 -->
    <div class="small">
      <el-divider>小型电缸</el-divider>

      <div class="btn">
        <el-button
          type="primary"
          class="item"
          :disabled="isSmall"
          @click="handleStartSmall"
          >开 始</el-button
        >
        <el-button
          type="danger"
          class="item"
          :disabled="!isSmall"
          @click="handleStopSmall"
          >结 束</el-button
        >
        <el-button type="info" class="item" @click="handleBack"
          >返 回</el-button
        >
        <el-button type="info" class="item" @click="handleRecordSmall"
          >数据记录</el-button
        >
        <el-button type="info" class="item" @click="handleRefresh"
          >刷 新</el-button
        >
      </div>

      <el-divider></el-divider>

      <div class="num">
        <div class="value">往返次数：{{ numSmall }}</div>
        <div class="value">位移的值：{{ displacementSmall }}</div>
        <div class="value">位置标志位：{{ numIsSmall }}</div>
      </div>

      <div class="set">
        <!-- 转速 -->
        <div class="speed">
          <el-radio-group v-model="radioSmall">
            <el-radio label="开启">开启</el-radio>
            <el-radio label="关闭">关闭</el-radio>
          </el-radio-group>
          <div class="value">
            <span>请输入转速的值(转/分钟)：</span>
            <el-input-number
              v-model="speedSmall"
              :precision="0"
              :step="1"
              :min="1"
              :max="1000000"
            ></el-input-number>
          </div>
          <el-button
            type="success"
            class="btn-speed"
            :disabled="isSmall"
            @click="handleSetSpeedSmall"
            >设定转速</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'
import ByteLength from '@serialport/parser-byte-length'
import Readline from '@serialport/parser-readline'

export default {
  name: 'life-test',

  data() {
    return {
      /* 串口相关变量 */
      usbPortReceive: null,
      parserReceive: null,
      scmBaudRateReceive: 115200,

      usbPortMiniature: null,
      parserMiniature: null,
      scmBaudRateMiniature: 115200,

      usbPortSmall: null,
      parserSmall: null,
      scmBaudRateSmall: 115200,

      comReceive: '',
      comSendMiniature: '',
      comSendSmall: '',

      /* 开关 */
      isMiniature: false, // 是否开始测试（微型）
      isSmall: false, // 是否开始测试（小型）

      // 位移值
      displacementMiniature: 0, // 微型，0.00~200.00mm
      displacementSmall: 0, // 小型，0.00~200.00mm

      // 转速值（转/分钟）
      speedMiniature: 5000, // 默认5000
      speedSmall: 5000, // 默认5000

      // 转速是否开启
      radioMiniature: '关闭',
      radioSmall: '关闭',

      // 往返次数
      numMiniature: 0,
      numSmall: 0,

      // 位置标志位
      numIsMiniature: 0, // 越过180mm，0->1一次；低于50mm，0->2一次（微型）
      numIsSmall: 0 // 越过180mm，0->1一次；低于50mm，0->2一次（小型）
    }
  },

  created() {
    this.comReceive = window.localStorage.getItem('com-receive')
    this.comSendMiniature = window.localStorage.getItem('com-send-miniature')
    this.comSendSmall = window.localStorage.getItem('com-send-small')
  },
  mounted() {
    setTimeout(() => {
      if (this.comReceive && this.comSendMiniature && this.comSendSmall) {
        // this.initSerialPortReceive()
        // this.initSerialPortSendMiniature()
        // this.initSerialPortSendSmall()
      } else {
        this.$alert(
          `请重新连接USB线，然后点击"刷新页面"按钮！`,
          `初始化COM口列表失败`,
          {
            type: 'error',
            showClose: false,
            center: true,
            confirmButtonText: '刷新页面',
            callback: () => {
              this.handleRefresh()
            }
          }
        )
      }
    }, 1000)
  },
  beforeDestroy() {
    // 关闭接收数据串口通信
    if (this.usbPortReceive) {
      if (this.usbPortReceive.isOpen) {
        this.usbPortReceive.close()
      }
    }
    // 关闭微型电缸发送指令串口通信
    if (this.usbPortMiniature) {
      if (this.usbPortMiniature.isOpen) {
        this.usbPortMiniature.close()
      }
    }
    // 关闭小型电缸发送指令串口通信
    if (this.usbPortSmall) {
      if (this.usbPortSmall.isOpen) {
        this.usbPortSmall.close()
      }
    }
  },

  methods: {
    /**
     * @description: 返回首页
     */
    handleBack() {
      this.$router.push({
        path: '/'
      })
    },

    /**
     * @description: 初始化接收数据串口对象
     */
    initSerialPortReceive() {
      SerialPort.list()
        .then(ports => {
          let comPath = this.comReceive

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            this.$notify({
              title: '通知',
              message: `连接到接收数据串口：${comPath}；波特率为：${this.scmBaudRateReceive}`,
              type: 'success',
              position: 'bottom-left',
              duration: 4000
            })

            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPortReceive = new SerialPort(comPath, {
              baudRate: this.scmBaudRateReceive,
              autoOpen: true // 是否自动开启串口
            })
            /* 调用 this.usbPortReceive.open() 成功时触发（开启串口成功） */
            this.usbPortReceive.on('open', () => {
              console.log('接收数据-开启成功')
            })
            /* 调用 this.usbPortReceive.open() 失败时触发（开启串口失败） */
            this.usbPortReceive.on('error', () => {
              this.$alert(
                `请重新连接USB线，然后点击"刷新页面"按钮！`,
                '接收数据开启串口失败',
                {
                  type: 'error',
                  showClose: false,
                  center: true,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    this.handleRefresh()
                  }
                }
              )
            })

            this.parserReceive = this.usbPortReceive.pipe(
              new Readline({ delimiter: '\n' })
            )
            this.parserReceive.on('data', data => {
              // console.log(data)

              const dataArray = data.split(',')

              const dataOne = dataArray[0] // 微型
              const dataTwo = dataArray[1] // 小型
              const dataThree = dataArray[2]

              const dataArrayOne = dataOne.split(' ')
              const dataArrayTwo = dataTwo.split(' ')
              const dataArrayThree = dataThree.split(' ')

              this.displacementMiniature = parseFloat(dataArrayOne[0]) // 位移（微型）
              this.displacementSmall = parseFloat(dataArrayTwo[0]) // 位移（小型）

              this.numIsMiniature = parseFloat(dataArrayThree[0]) // 越过180mm，0->1一次；低于50mm，0->2一次
              this.numIsSmall = parseFloat(dataArrayThree[1]) // 越过180mm，0->1一次；低于50mm，0->2一次
              // console.log('微型：', this.numIsMiniature, ' 小型：', this.numIsSmall)

              /* 微型电缸往复运动 */
              if (this.isMiniature === true) {
                if (this.numIsMiniature === 2) {
                  // 让它推出
                  this.positionMiniature()
                } else if (this.numIsMiniature === 1) {
                  // 让它收回
                  this.zeroMiniature()
                }
                /* 计算往复次数 */
                if (this.numIsMiniature === 1) {
                  this.numMiniature += 1
                }
              }

              /* 小型电缸往复运动 */
              if (this.isSmall === true) {
                if (this.numIsSmall === 2) {
                  // 让它推出
                  this.positionSmall()
                } else if (this.numIsSmall === 1) {
                  // 让它收回
                  this.zeroSmall()
                }
                /* 计算往复次数 */
                if (this.numIsSmall === 1) {
                  this.numSmall += 1
                }
              }
            })
          } else {
            this.$alert(
              `请重新连接USB线，然后点击"刷新页面"按钮！`,
              '没有检测到接收数据串口',
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$alert(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              center: true,
              confirmButtonText: '刷新页面',
              callback: () => {
                this.handleRefresh()
              }
            }
          )
        })
    },

    /**
     * @description: 初始化微型电缸发送指令串口对象
     */
    initSerialPortSendMiniature() {
      SerialPort.list()
        .then(ports => {
          let comPath = this.comSendMiniature

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            this.$notify({
              title: '通知',
              message: `连接到微型电缸串口：${comPath}；波特率为：${this.scmBaudRateMiniature}`,
              type: 'success',
              position: 'top-right',
              duration: 4000
            })

            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPortMiniature = new SerialPort(comPath, {
              baudRate: this.scmBaudRateMiniature, // 默认波特率115200
              autoOpen: true // 是否自动开启串口
            })
            /* 调用 this.usbPortMiniature.open() 成功时触发（开启串口成功） */
            this.usbPortMiniature.on('open', () => {
              console.log('微型电缸-串口开启成功')
            })
            /* 调用 this.usbPortMiniature.open() 失败时触发（开启串口失败） */
            this.usbPortMiniature.on('error', () => {
              this.$alert(
                `请重新连接USB线，然后点击"刷新页面"按钮！`,
                '微型电缸串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  center: true,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    this.handleRefresh()
                  }
                }
              )
            })

            this.parserMiniature = this.usbPortMiniature.pipe(
              new ByteLength({ length: 8 })
            )
            this.parserMiniature.on('data', data => {
              // console.log('微型电缸返回数据：', data)
            })
          } else {
            this.$alert(
              `请重新连接USB线，然后点击"刷新页面"按钮！`,
              '没有检测到微型电缸串口',
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$alert(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              center: true,
              confirmButtonText: '刷新页面',
              callback: () => {
                this.handleRefresh()
              }
            }
          )
        })
    },

    /**
     * @description: 初始化小型电缸发送指令串口对象
     */
    initSerialPortSendSmall() {
      SerialPort.list()
        .then(ports => {
          let comPath = this.comSendSmall

          /* 验证USB有没有连接到电脑，但不能验证有无数据发送给上位机 */
          if (comPath) {
            this.$notify({
              title: '通知',
              message: `连接到小型电缸串口：${comPath}；波特率为：${this.scmBaudRateSmall}`,
              type: 'success',
              position: 'bottom-right',
              duration: 4000
            })

            /**
             * @description: 创建串口实例
             * @param {String} comPath 串行端口的系统路径。例如：在Mac、Linux上的/dev/tty.XXX或Windows上的COM1
             * @param {Object} 配置项
             */
            this.usbPortSmall = new SerialPort(comPath, {
              baudRate: this.scmBaudRateSmall, // 默认波特率115200
              autoOpen: true // 是否自动开启串口
            })
            /* 调用 this.usbPortSmall.open() 成功时触发（开启串口成功） */
            this.usbPortSmall.on('open', () => {
              console.log('小型电缸-串口开启成功')
            })
            /* 调用 this.usbPortSmall.open() 失败时触发（开启串口失败） */
            this.usbPortSmall.on('error', () => {
              this.$alert(
                `请重新连接USB线，然后点击"刷新页面"按钮！`,
                '小型电缸串口开启失败',
                {
                  type: 'error',
                  showClose: false,
                  center: true,
                  confirmButtonText: '刷新页面',
                  callback: () => {
                    this.handleRefresh()
                  }
                }
              )
            })

            this.parserSmall = this.usbPortSmall.pipe(
              new ByteLength({ length: 8 })
            )
            this.parserSmall.on('data', data => {
              // console.log('小型电缸返回数据：', data)
            })
          } else {
            this.$alert(
              `请重新连接USB线，然后点击"刷新页面"按钮！`,
              '没有检测到小型电缸串口',
              {
                type: 'error',
                showClose: false,
                center: true,
                confirmButtonText: '刷新页面',
                callback: () => {
                  this.handleRefresh()
                }
              }
            )
          }
        })
        .catch(err => {
          this.$alert(
            `${err}。请重新连接USB线，然后点击"刷新页面"按钮！`,
            `初始化SerialPort.list失败`,
            {
              type: 'error',
              showClose: false,
              center: true,
              confirmButtonText: '刷新页面',
              callback: () => {
                this.handleRefresh()
              }
            }
          )
        })
    },

    /**
     * @description: 开始（微型）
     */
    handleStartMiniature() {
      this.zeroMiniature()
      this.isMiniature = true
    },

    /**
     * @description: 结束（微型）
     */
    handleStopMiniature() {
      this.isMiniature = false
    },

    /**
     * @description: 归0指令（微型）
     */
    zeroMiniature() {
      const order = [
        '0x01',
        '0x10',
        '0x00',
        '0xf2',
        '0x00',
        '0x02',
        '0x04',
        '0x00',
        '0x00',
        '0x00',
        '0x00'
      ]
      this.usbPortMiniature.write(order)
    },

    /**
     * @description: 运动至指定位置（微型）
     */
    positionMiniature() {
      const absoluteValueMiniature = 120

      let baseOrder = []
      let otherOrder = []

      baseOrder = ['0x01', '0x10', '0x00', '0xf2', '0x00', '0x02', '0x04']
      let res16 = (
        Math.pow(2, 32) + -(absoluteValueMiniature * 32768)
      ).toString(16)

      const one = '0x' + res16.substring(0, 2)
      const two = '0x' + res16.substring(2, 4)
      const three = '0x' + res16.substring(4, 6)
      const four = '0x' + res16.substring(6, 8)
      otherOrder = [one, two, three, four]

      const order = baseOrder.concat(otherOrder)

      this.usbPortMiniature.write(order)
    },

    /**
     * @description: 设置转速（微型）
     */
    handleSetSpeedMiniature() {
      if (this.radioMiniature === '开启') {
        let baseOrder = []
        let otherOrder = []
        let res16 = '00000000'

        baseOrder = ['0x01', '0x10', '0x00', '0xee', '0x00', '0x02', '0x04']
        if (this.speedMiniature > 0) {
          res16 = (this.speedMiniature * 1000).toString(16)
          if (res16.length === 1) {
            res16 = '0000000' + res16
          } else if (res16.length === 2) {
            res16 = '000000' + res16
          } else if (res16.length === 3) {
            res16 = '00000' + res16
          } else if (res16.length === 4) {
            res16 = '0000' + res16
          } else if (res16.length === 5) {
            res16 = '000' + res16
          } else if (res16.length === 6) {
            res16 = '00' + res16
          } else if (res16.length === 7) {
            res16 = '0' + res16
          }
        }

        const one = '0x' + res16.substring(0, 2)
        const two = '0x' + res16.substring(2, 4)
        const three = '0x' + res16.substring(4, 6)
        const four = '0x' + res16.substring(6, 8)
        otherOrder = [one, two, three, four]

        const order = baseOrder.concat(otherOrder)

        this.usbPortMiniature.write(order)
      }
    },

    /**
     * @description: 开始（小型）
     */
    handleStartSmall() {
      this.zeroSmall()
      this.isSmall = true
    },

    /**
     * @description: 结束（小型）
     */
    handleStopSmall() {
      this.isSmall = false
    },

    /**
     * @description: 归0指令（小型）
     */
    zeroSmall() {
      const order = [
        '0x01',
        '0x10',
        '0x00',
        '0xf2',
        '0x00',
        '0x02',
        '0x04',
        '0x00',
        '0x00',
        '0x00',
        '0x00'
      ]
      this.usbPortSmall.write(order)
    },

    /**
     * @description: 运动至指定位置（小型）
     */
    positionSmall() {
      const absoluteValueSmall = 300

      let baseOrder = []
      let otherOrder = []

      baseOrder = ['0x01', '0x10', '0x00', '0xf2', '0x00', '0x02', '0x04']
      let res16 = (Math.pow(2, 32) + -(absoluteValueSmall * 32768)).toString(16)

      const one = '0x' + res16.substring(0, 2)
      const two = '0x' + res16.substring(2, 4)
      const three = '0x' + res16.substring(4, 6)
      const four = '0x' + res16.substring(6, 8)
      otherOrder = [one, two, three, four]

      const order = baseOrder.concat(otherOrder)

      this.usbPortSmall.write(order)
    },

    /**
     * @description: 设置转速（小型）
     */
    handleSetSpeedSmall() {
      if (this.radioSmall === '开启') {
        let baseOrder = []
        let otherOrder = []
        let res16 = '00000000'

        baseOrder = ['0x01', '0x10', '0x00', '0xee', '0x00', '0x02', '0x04']
        if (this.speedSmall > 0) {
          res16 = (this.speedSmall * 1000).toString(16)
          if (res16.length === 1) {
            res16 = '0000000' + res16
          } else if (res16.length === 2) {
            res16 = '000000' + res16
          } else if (res16.length === 3) {
            res16 = '00000' + res16
          } else if (res16.length === 4) {
            res16 = '0000' + res16
          } else if (res16.length === 5) {
            res16 = '000' + res16
          } else if (res16.length === 6) {
            res16 = '00' + res16
          } else if (res16.length === 7) {
            res16 = '0' + res16
          }
        }

        const one = '0x' + res16.substring(0, 2)
        const two = '0x' + res16.substring(2, 4)
        const three = '0x' + res16.substring(4, 6)
        const four = '0x' + res16.substring(6, 8)
        otherOrder = [one, two, three, four]

        const order = baseOrder.concat(otherOrder)

        this.usbPortSmall.write(order)
      }
    },

    /**
     * @description: 数据记录（微型）
     */
    handleRecordMiniature() {
      // const electric = '微型电缸'
      // this.$router.push({
      //   path: '/',
      //   query: {
      //     electric: JSON.stringify(electric),
      //     startTime: JSON.stringify(this.startTime),
      //     endTime: JSON.stringify(this.endTime),
      //     routerName: JSON.stringify('/life-test')
      //   }
      // })
    },

    /**
     * @description: 数据记录（小型）
     */
    handleRecordSmall() {
      // const electric = '小型电缸'
      // this.$router.push({
      //   path: '/',
      //   query: {
      //     electric: JSON.stringify(electric),
      //     startTime: JSON.stringify(this.startTime),
      //     endTime: JSON.stringify(this.endTime),
      //     routerName: JSON.stringify('/life-test')
      //   }
      // })
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/life-test'),
          duration: JSON.stringify(300)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.life-test {
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  @include flex(row, stretch, stretch);

  /* 微型 */
  .miniature {
    width: 50%;
    .btn {
      @include flex(row, space-around, center);
      .item {
        font-size: 16px;
      }
    }

    .num {
      margin-top: 50px;
      @include flex(column, center, center);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 5px 30px;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 15px;
      }
    }

    .set {
      margin-top: 30px;
      @include flex(column, center, center);
      .speed {
        border: 2px solid black;
        border-radius: 10px;
        padding: 20px;
        .value {
          margin-top: 40px;
        }
      }
      .btn-speed {
        margin-top: 20px;
      }
    }
  }

  .divider {
    height: 100%;
  }

  /* 小型 */
  .small {
    width: 50%;
    .btn {
      @include flex(row, space-around, center);
      .item {
        font-size: 16px;
      }
    }

    .num {
      margin-top: 50px;
      @include flex(column, center, center);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 5px 30px;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 15px;
      }
    }

    .set {
      margin-top: 30px;
      @include flex(column, center, center);
      .speed {
        border: 2px solid black;
        border-radius: 10px;
        padding: 20px;
        .value {
          margin-top: 40px;
        }
      }
      .btn-speed {
        margin-top: 20px;
      }
    }
  }
}
</style>
