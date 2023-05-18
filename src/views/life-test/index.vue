<!--
 * @Author      : Mr.bin
 * @Date        : 2023-05-16 09:29:06
 * @LastEditTime: 2023-05-18 11:51:43
 * @Description : 寿命测试
-->
<template>
  <div class="life-test">
    <!-- 微型电缸 -->
    <div class="miniature">
      <el-divider>微型电缸</el-divider>

      <div class="btn">
        <el-button type="success" class="item" @click="handleZeroMiniature"
          >归 零</el-button
        >
        <el-button
          type="primary"
          class="item"
          :disabled="!isZeroMiniature || isMiniature"
          @click="handleStartMiniature"
          >开 始</el-button
        >
        <el-button
          type="danger"
          class="item"
          :disabled="!isZeroMiniature || !isMiniature"
          @click="handleStopMiniature"
          >结 束</el-button
        >
        <el-button type="info" class="item" @click="handleBack"
          >返 回</el-button
        >
        <el-button type="info" class="item" @click="handleRefresh"
          >刷 新</el-button
        >
      </div>

      <el-divider></el-divider>

      <div class="num">
        <div class="value">往返次数：{{ numMiniature }}</div>
        <div class="value">位移的值：{{ displacementMiniature }}</div>
      </div>

      <div class="absolute">
        <div class="value">
          <span>[推出]请输入绝对位移(圈)：</span>
          <el-input-number
            v-model="absoluteValueMiniature"
            :precision="0"
            :step="1"
            :min="1"
          ></el-input-number>
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;（{{
              ((absoluteValueMiniature * leadMin) / reductionMin).toFixed(2)
            }}mm）</span
          >
        </div>
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
            :disabled="!isZeroMiniature || isMiniature"
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
        <el-button type="success" class="item" @click="handleZeroSmall"
          >归 零</el-button
        >
        <el-button
          type="primary"
          class="item"
          :disabled="!isZeroSmall || isSmall"
          @click="handleStartSmall"
          >开 始</el-button
        >
        <el-button
          type="danger"
          class="item"
          :disabled="!isZeroSmall || !isSmall"
          @click="handleStopSmall"
          >结 束</el-button
        >
        <el-button type="info" class="item" @click="handleBack"
          >返 回</el-button
        >
        <el-button type="info" class="item" @click="handleRefresh"
          >刷 新</el-button
        >
      </div>

      <el-divider></el-divider>

      <div class="num">
        <div class="value">往返次数：{{ numSmall }}</div>
        <div class="value">位移的值：{{ displacementSmall }}</div>
      </div>

      <div class="absolute">
        <div class="value">
          <span>[推出]请输入绝对位移(圈)：</span>
          <el-input-number
            v-model="absoluteValueSmall"
            :precision="0"
            :step="1"
            :min="1"
          ></el-input-number>
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;（{{
              ((absoluteValueSmall * leadSmall) / reductionSmall).toFixed(2)
            }}mm）</span
          >
        </div>
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
            :disabled="!isZeroSmall || isSmall"
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

      /* 导程、减速比 */
      leadMin: '', // 导程（微型）
      leadSmall: '', // 导程（小型）
      reductionMin: '', // 减速比（微型）
      reductionSmall: '', // 减速比（小型）

      /* 开关 */
      isZeroMiniature: false, // 是否归零（微型）
      isZeroSmall: false, // 是否归零（小型）
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

      // 圈数
      absoluteValueMiniature: 60,
      absoluteValueSmall: 300
    }
  },

  created() {
    this.comReceive = window.localStorage.getItem('com-receive')
    this.comSendMiniature = window.localStorage.getItem('com-send-miniature')
    this.comSendSmall = window.localStorage.getItem('com-send-small')

    this.leadMin = JSON.parse(window.localStorage.getItem('lead-min'))
    this.leadSmall = JSON.parse(window.localStorage.getItem('lead-small'))
    this.reductionMin = JSON.parse(window.localStorage.getItem('reduction-min'))
    this.reductionSmall = JSON.parse(
      window.localStorage.getItem('reduction-small')
    )
  },
  mounted() {
    setTimeout(() => {
      if (this.comReceive && this.comSendMiniature && this.comSendSmall) {
        this.initSerialPortReceive()
        this.initSerialPortSendMiniature()
        this.initSerialPortSendSmall()
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
              const dataArrayOne = dataOne.split(' ')
              const dataArraytwo = dataTwo.split(' ')

              this.displacementMiniature = parseFloat(dataArrayOne[0]) // 位移（微型）
              this.displacementSmall = parseFloat(dataArraytwo[0]) // 位移（小型）

              /* 微型电缸往复运动 */
              // 判断是否归零
              if (
                this.displacementMiniature <= 100 ||
                this.isMiniature === true
              ) {
                this.isZeroMiniature = true
              } else {
                this.isZeroMiniature = false
              }

              if (this.isZeroMiniature === true) {
                if (this.isMiniature === true) {
                  let absoluteSetMiniature = (
                    (this.absoluteValueMiniature * this.leadMin) /
                    this.reductionMin
                  ).toFixed(2) // 设定的距离mm

                  /* 往复运动逻辑 */
                  if (this.displacementMiniature <= 100) {
                    // 归到0，让它推出
                    this.positionMiniature()
                  } else if (
                    Math.abs(
                      this.displacementMiniature - absoluteSetMiniature
                    ) <= 5
                  ) {
                    // 走到设定位置，让它收回
                    this.zeroMiniature()
                  }

                  /* 计算往复次数 */
                  if (this.displacementMiniature <= 100) {
                    this.numMiniature = this.numMiniature + 1
                  }
                }
              }

              /* 小型电缸往复运动 */
              // 判断是否归零
              if (this.displacementSmall <= 100 || this.isSmall === true) {
                this.isZeroSmall = true
              } else {
                this.isZeroSmall = false
              }

              if (this.isZeroSmall === true) {
                if (this.isSmall === true) {
                  let absoluteSetSmall = (
                    (this.absoluteValueSmall * this.leadMin) /
                    this.reductionMin
                  ).toFixed(2) // 设定的距离mm

                  /* 往复运动逻辑 */
                  if (this.displacementSmall <= 100) {
                    // 归到0，让它推出
                    this.positionSmall()
                  } else if (
                    Math.abs(this.displacementSmall - absoluteSetSmall) <= 5
                  ) {
                    // 走到设定位置，让它收回
                    this.zeroSmall()
                  }

                  /* 计算往复次数 */
                  if (this.displacementSmall <= 100) {
                    this.numSmall = this.numSmall + 1
                  }
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
              console.log('微型电缸返回数据：', data)
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
              console.log('小型电缸返回数据：', data)
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
     * @description: 归零（微型）
     */
    handleZeroMiniature() {
      this.zeroMiniature()
    },

    /**
     * @description: 开始（微型）
     */
    handleStartMiniature() {
      this.isMiniature = true
      this.numMiniature = 0
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
      const absoluteValueMiniature = this.absoluteValueMiniature

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

        baseOrder = ['0x01', '0x10', '0x00', '0xee', '0x00', '0x02', '0x04']
        if (speedMiniature > 0) {
          res16 = (speedMiniature * 1000).toString(16)
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
     * @description: 归零（小型）
     */
    handleZeroSmall() {
      this.zeroSmall()
    },

    /**
     * @description: 开始（小型）
     */
    handleStartSmall() {
      this.isSmall = true
      this.numSmall = 0
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
      const absoluteValueSmall = this.absoluteValueSmall

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

        baseOrder = ['0x01', '0x10', '0x00', '0xee', '0x00', '0x02', '0x04']
        if (speedSmall > 0) {
          res16 = (speedSmall * 1000).toString(16)
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
      margin-top: 20px;
      @include flex(column, center, center);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 5px 30px;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 5px;
      }
    }

    .absolute {
      margin-top: 30px;
      @include flex(row, center, center);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 20px;
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
      margin-top: 20px;
      @include flex(column, center, center);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 5px 30px;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 5px;
      }
    }

    .absolute {
      margin-top: 30px;
      @include flex(row, center, center);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 20px;
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
