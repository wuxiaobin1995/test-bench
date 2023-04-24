<!--
 * @Author      : Mr.bin
 * @Date        : 2023-02-27 10:42:11
 * @LastEditTime: 2023-04-24 09:07:32
 * @Description : home
-->
<template>
  <div class="home">
    <div class="left">
      <div class="top">
        <div class="btn">
          <el-button type="primary" class="item" @click="handleOpenReceive"
            >开启</el-button
          >
          <el-button type="danger" class="item" @click="handleCloseReceive"
            >关闭</el-button
          >
          <el-button type="info" class="item" @click="handleRefresh"
            >刷新</el-button
          >
          <el-button type="success" class="item" @click="handleToZero"
            >调零</el-button
          >
        </div>

        <el-divider></el-divider>

        <div class="content">
          <div class="item">
            <div>位移值1：{{ displacementOne }}mm</div>
            <div>压力值1：{{ pressureOne }}kg</div>
          </div>
          <div class="item">
            <div>位移值2：{{ displacementTwo }}mm</div>
            <div>压力值2：{{ pressureTwo }}kg</div>
          </div>
        </div>
      </div>

      <div class="chart">
        <div id="chart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>

    <div class="right">
      <div class="btn">
        <el-button type="primary" class="item" @click="handleSendMiniature"
          >发送(微型)</el-button
        >
        <el-button type="primary" class="item" @click="handleSendSmall"
          >发送(小型)</el-button
        >
        <el-button type="info" class="item" @click="handleToCom"
          >设置串口</el-button
        >
        <el-button type="info" class="item" @click="handleToParameter"
          >设置参数</el-button
        >
      </div>

      <div class="in">
        <el-divider>微型电缸</el-divider>

        <el-radio-group v-model="minSelect">
          <el-radio label="绝对位移">绝对位移</el-radio>
          <el-radio label="相对位移">相对位移</el-radio>
          <el-radio label="扭矩">扭矩</el-radio>
        </el-radio-group>

        <div class="absolute">
          <span>请输入绝对位移(圈)：</span>
          <el-input-number
            v-model="absoluteValueMiniature"
            :precision="0"
            :step="1"
            :min="0"
          ></el-input-number>
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;（{{
              ((absoluteValueMiniature * leadMin) / reductionMin).toFixed(2)
            }}mm）</span
          >
        </div>

        <div class="relative">
          <span>请输入相对位移(圈)：</span>
          <el-input-number
            v-model="relativeValueMiniature"
            :precision="0"
            :step="1"
            :min="-10000"
            :max="10000"
          ></el-input-number>
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;（{{
              ((relativeValueMiniature * leadMin) / reductionMin).toFixed(2)
            }}mm）</span
          >
        </div>

        <div class="torsion">
          <span>请输入扭矩的值(%)：</span>
          <el-input-number
            v-model="torsionMiniature"
            :precision="0"
            :step="1"
            :min="-100"
            :max="100"
          ></el-input-number>
        </div>

        <el-divider>小型电缸</el-divider>

        <el-radio-group v-model="smallSelect">
          <el-radio label="绝对位移">绝对位移</el-radio>
          <el-radio label="相对位移">相对位移</el-radio>
          <el-radio label="扭矩">扭矩</el-radio>
        </el-radio-group>

        <div class="absolute">
          <span>请输入绝对位移(圈)：</span>
          <el-input-number
            v-model="absoluteValueSmall"
            :precision="0"
            :step="1"
            :min="0"
          ></el-input-number>
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;（{{
              ((absoluteValueSmall * leadSmall) / reductionSmall).toFixed(2)
            }}mm）</span
          >
        </div>

        <div class="relative">
          <span>请输入相对位移(圈)：</span>
          <el-input-number
            v-model="relativeValueSmall"
            :precision="0"
            :step="1"
            :min="-10000"
            :max="10000"
          ></el-input-number>
          <span
            >&nbsp;&nbsp;&nbsp;&nbsp;（{{
              ((relativeValueSmall * leadSmall) / reductionSmall).toFixed(2)
            }}mm）</span
          >
        </div>

        <div class="torsion">
          <span>请输入扭矩的值(%)：</span>
          <el-input-number
            v-model="torsionSmall"
            :precision="0"
            :step="1"
            :min="-100"
            :max="100"
          ></el-input-number>
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
  name: 'home',

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

      /* 图形相关变量 */
      myChart: null,
      option: {},
      xData: [], // 横坐标数组

      oneStandard: 0,
      twoStandard: 0,

      displacementOne: null, // 位移值，0.00~200.00mm
      displacementArrayOne: [],
      pressureOne: null, // 压力值，kg
      pressureArrayOne: [],

      displacementTwo: null, // 位移值，0.00~200.00mm
      displacementArrayTwo: [],
      pressureTwo: null, // 压力值，kg
      pressureArrayTwo: [],

      minSelect: '绝对位移',
      smallSelect: '绝对位移',

      absoluteValueMiniature: 0,
      relativeValueMiniature: 1,
      torsionMiniature: 1,

      absoluteValueSmall: 0,
      relativeValueSmall: 7,
      torsionSmall: 1,

      leadMin: '', // 导程（微型）
      leadSmall: '', // 导程（小型）
      reductionMin: '', // 减速比（微型）
      reductionSmall: '' // 减速比（小型）
    }
  },

  created() {
    this.oneStandard = this.$store.state.zeroStandard.oneStandard
    this.twoStandard = this.$store.state.zeroStandard.twoStandard

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
    this.initChart()

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
              window.location.reload()
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
              autoOpen: false // 是否自动开启串口
            })
            /* 调用 this.usbPortReceive.open() 成功时触发（开启串口成功） */
            this.usbPortReceive.on('open', () => {
              console.log('接收数据开启成功')
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
              console.log(data)

              const dataArray = data.split(',')
              const dataOne = dataArray[0]
              const dataTwo = dataArray[1]
              const dataArrayOne = dataOne.split(' ')
              const dataArraytwo = dataTwo.split(' ')

              this.displacementOne = dataArrayOne[0] // 位移
              const pressureOneDA = dataArrayOne[1] // 压力5位数字量

              this.displacementTwo = dataArraytwo[0] // 位移
              const pressureTwoDA = dataArraytwo[1] // 压力5位数字量

              // 压力值，kg
              this.pressureOne = parseFloat(
                ((pressureOneDA - this.oneStandard) / -83.879).toFixed(1)
              )
              this.pressureTwo = parseFloat(
                ((pressureTwoDA - this.twoStandard) / -83.879).toFixed(1)
              )

              this.displacementArrayOne.push(this.displacementOne)
              this.pressureArrayOne.push(this.pressureOne)
              this.displacementArrayTwo.push(this.displacementTwo)
              this.pressureArrayTwo.push(this.pressureTwo)

              if (this.pressureArrayOne.length === 200) {
                this.displacementArrayOne = []
                this.pressureArrayOne = []
                this.displacementArrayTwo = []
                this.pressureArrayTwo = []
              }
              if (this.pressureArrayTwo.length === 200) {
                this.displacementArrayTwo = []
                this.pressureArrayTwo = []
              }
              // 渲染图形
              this.option.series[0].data = this.displacementArrayOne
              this.option.series[1].data = this.pressureArrayOne
              this.option.series[2].data = this.displacementArrayTwo
              this.option.series[3].data = this.pressureArrayTwo
              this.myChart.setOption(this.option)
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
              console.log('微型电缸串口开启成功')
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
              console.log('微型电缸返回数据：\n')
              console.log(data)
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
              console.log('小型电缸串口开启成功')
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
              console.log('小型电缸返回数据：\n')
              console.log(data)
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
     * @description: 初始化echarts图形
     */
    initChart() {
      // 计算横坐标数组
      this.xData = []
      for (let i = 0; i < 200; i++) {
        this.xData.push(parseFloat((i * 0.1).toFixed(1)))
      }

      this.myChart = this.$echarts.init(document.getElementById('chart'))

      this.option = {
        xAxis: {
          type: 'category',
          name: '秒',
          data: this.xData
        },
        yAxis: {
          type: 'value',
          min: 0
        },
        series: [
          {
            data: [],
            type: 'line',
            color: 'red',
            smooth: true,
            showSymbol: false
          },
          {
            data: [],
            type: 'line',
            color: 'blue',
            smooth: true,
            showSymbol: false
          },
          {
            data: [],
            type: 'line',
            color: 'yellow',
            smooth: true,
            showSymbol: false
          },
          {
            data: [],
            type: 'line',
            color: 'green',
            smooth: true,
            showSymbol: false
          }
        ],
        animation: false
      }

      this.myChart.setOption(this.option)
    },

    /**
     * @description: 开启接收数据串口通信
     */
    handleOpenReceive() {
      this.displacementOne = null
      this.displacementArrayOne = []
      this.pressureOne = null
      this.pressureArrayOne = []

      this.displacementTwo = null
      this.displacementArrayTwo = []
      this.pressureTwo = null
      this.pressureArrayTwo = []

      if (this.usbPortReceive) {
        if (!this.usbPortReceive.isOpen) {
          this.usbPortReceive.open()
        }
      }
    },

    /**
     * @description: 关闭接收数据串口通信
     */
    handleCloseReceive() {
      if (this.usbPortReceive) {
        if (this.usbPortReceive.isOpen) {
          this.usbPortReceive.close()
        }
      }
    },

    /**
     * @description: 前往调零页
     */
    handleToZero() {
      this.$router.push({
        path: '/set-zero'
      })
    },

    /**
     * @description: 前往设置串口页
     */
    handleToCom() {
      this.$router.push({
        path: '/set-com'
      })
    },

    /**
     * @description: 前往设置参数页
     */
    handleToParameter() {
      this.$router.push({
        path: '/set-parameter'
      })
    },

    /**
     * @description: 刷新页面
     */
    handleRefresh() {
      this.$router.push({
        path: '/refresh',
        query: {
          routerName: JSON.stringify('/home'),
          duration: JSON.stringify(300)
        }
      })
    },

    /**
     * @description: 发送微型电缸指令
     */
    handleSendMiniature() {
      // const leadMin = this.leadMin // 导程
      // const reductionMin = this.reductionMin // 减速比

      const absoluteValueMiniature = this.absoluteValueMiniature
      const relativeValueMiniature = this.relativeValueMiniature
      const torsionMiniature = this.torsionMiniature

      let baseOrder = []
      let otherOrder = []
      let res16 = '00000000'

      if (this.minSelect === '绝对位移') {
        /* 绝对位移 */
        baseOrder = ['0x01', '0x10', '0x00', '0xe8', '0x00', '0x02', '0x04']
        if (absoluteValueMiniature > 0) {
          res16 = (
            Math.pow(2, 32) + -(absoluteValueMiniature * 32768)
          ).toString(16)
        } else {
          res16 = '00000000'
        }
      } else if (this.minSelect === '相对位移') {
        /* 相对位移 */
        baseOrder = ['0x01', '0x10', '0x00', '0xe6', '0x00', '0x02', '0x04']
        if (relativeValueMiniature > 0) {
          res16 = (
            Math.pow(2, 32) + -(relativeValueMiniature * 32768)
          ).toString(16)
        } else if (relativeValueMiniature < 0) {
          res16 = (-relativeValueMiniature * 32768).toString(16)
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
        } else {
          res16 = '00000000'
        }
      } else {
        /* 扭矩 */
        baseOrder = ['0x01', '0x10', '0x00', '0xc8', '0x00', '0x02', '0x04']
        if (torsionMiniature > 0) {
          res16 = (torsionMiniature * 1000).toString(16)
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
        } else if (torsionMiniature < 0) {
          res16 = (Math.pow(2, 32) + torsionMiniature * 1000).toString(16)
        } else {
          res16 = '00000000'
        }
      }

      const one = '0x' + res16.substring(0, 2)
      const two = '0x' + res16.substring(2, 4)
      const three = '0x' + res16.substring(4, 6)
      const four = '0x' + res16.substring(6, 8)
      otherOrder = [one, two, three, four]

      const order = baseOrder.concat(otherOrder)
      console.log(res16)
      console.log(order)
      this.usbPortMiniature.write(order)
    },

    /**
     * @description: 发送小型电缸指令
     */
    handleSendSmall() {
      // const leadSmall = this.leadSmall // 导程
      // const reductionSmall = this.reductionSmall // 减速比

      const absoluteValueSmall = this.absoluteValueSmall
      const relativeValueSmall = this.relativeValueSmall
      const torsionSmall = this.torsionSmall

      let baseOrder = []
      let otherOrder = []
      let res16 = '00000000'

      if (this.smallSelect === '绝对位移') {
        /* 绝对位移 */
        baseOrder = ['0x01', '0x10', '0x00', '0xe8', '0x00', '0x02', '0x04']
        if (absoluteValueSmall > 0) {
          res16 = (Math.pow(2, 32) + -(absoluteValueSmall * 32768)).toString(16)
        } else {
          res16 = '00000000'
        }
      } else if (this.smallSelect === '相对位移') {
        /* 相对位移 */
        baseOrder = ['0x01', '0x10', '0x00', '0xe6', '0x00', '0x02', '0x04']
        if (relativeValueSmall > 0) {
          res16 = (Math.pow(2, 32) + -(relativeValueSmall * 32768)).toString(16)
        } else if (relativeValueSmall < 0) {
          res16 = (-relativeValueSmall * 32768).toString(16)
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
        } else {
          res16 = '00000000'
        }
      } else {
        /* 扭矩 */
        baseOrder = ['0x01', '0x10', '0x00', '0xc8', '0x00', '0x02', '0x04']
        if (torsionSmall > 0) {
          res16 = (torsionSmall * 1000).toString(16)
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
        } else if (torsionSmall < 0) {
          res16 = (Math.pow(2, 32) + torsionSmall * 1000).toString(16)
        } else {
          res16 = '00000000'
        }
      }

      const one = '0x' + res16.substring(0, 2)
      const two = '0x' + res16.substring(2, 4)
      const three = '0x' + res16.substring(4, 6)
      const four = '0x' + res16.substring(6, 8)
      otherOrder = [one, two, three, four]

      const order = baseOrder.concat(otherOrder)
      console.log(res16)
      console.log(order)
      this.usbPortSmall.write(order)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 10px 0;
  @include flex(row, stretch, stretch);

  .left {
    width: 50%;
    border-right: 2px solid black;
    @include flex(column, stretch, stretch);
    .top {
      @include flex(column, stretch, center);
      .btn {
        .item {
          margin: 0 40px;
          font-size: 26px;
        }
      }
      .content {
        margin: 30px 0;
        font-size: 22px;
        width: 100%;
        .item {
          margin-bottom: 30px;
          @include flex(row, space-around, stretch);
        }
      }
    }

    .chart {
      flex: 1;
    }
  }

  .right {
    width: 50%;
    .btn {
      .item {
        margin: 0 20px;
        font-size: 26px;
      }
    }

    .in {
      @include flex(column, center, center);
      .absolute {
        margin: 20px 0;
      }
      .relative {
        margin: 20px 0;
      }
      .torsion {
        margin: 20px 0;
      }
    }
  }
}
</style>
