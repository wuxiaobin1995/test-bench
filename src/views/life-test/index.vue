<!--
 * @Author      : Mr.bin
 * @Date        : 2023-05-16 09:29:06
 * @LastEditTime: 2023-06-14 16:30:25
 * @Description : 寿命测试
-->
<template>
  <div class="life-test" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 微型电缸 -->
    <div class="miniature">
      <el-divider>微型电缸</el-divider>

      <div class="btn">
        <el-button
          class="item"
          type="primary"
          :disabled="isMiniatureStart"
          @click="handleStartMiniature"
          >开 始</el-button
        >
        <el-button
          class="item"
          type="danger"
          :disabled="isMiniatureStop"
          @click="handleStopMiniature"
          >暂 停</el-button
        >
        <el-button
          class="item"
          type="success"
          :disabled="!isMiniatureStop"
          @click="handleRestoreMiniature"
          >继 续</el-button
        >
        <el-button class="item" type="info" @click="handleToZero"
          >调 零</el-button
        >
        <el-button class="item" type="info" @click="handleRecord"
          >数据报表</el-button
        >
        <el-button class="item" type="info" @click="handleBack"
          >返 回</el-button
        >
      </div>

      <el-divider></el-divider>

      <div class="num">
        <div class="value">实时往返次数：{{ numMiniature }}</div>
        <div class="value">实时位移值mm：{{ displacementMiniature }}</div>
        <!-- <div class="value">实时压力值kg：{{ pressureMiniature }}</div> -->
        <div class="value">最大位移mm：{{ displacementMiniatureMax }}</div>
        <div class="value">最小位移mm：{{ displacementMiniatureMin }}</div>
        <div class="value">平均压力值kg：{{ pressureMiniatureAverage }}</div>
      </div>
    </div>

    <el-divider class="divider" direction="vertical"></el-divider>

    <!-- 小型电缸 -->
    <div class="small">
      <el-divider>小型电缸</el-divider>

      <div class="btn">
        <el-button
          class="item"
          type="primary"
          :disabled="isSmallStart"
          @click="handleStartSmall"
          >开 始</el-button
        >
        <el-button
          class="item"
          type="danger"
          :disabled="isSmallStop"
          @click="handleStopSmall"
          >暂 停</el-button
        >
        <el-button
          class="item"
          type="success"
          :disabled="!isSmallStop"
          @click="handleRestoreSmall"
          >继 续</el-button
        >
        <el-button class="item" type="info" @click="handleToZero"
          >调 零</el-button
        >
        <el-button class="item" type="info" @click="handleRecord"
          >数据报表</el-button
        >
        <el-button class="item" type="info" @click="handleBack"
          >返 回</el-button
        >
      </div>

      <el-divider></el-divider>

      <div class="num">
        <div class="value">实时往返次数：{{ numSmall }}</div>
        <div class="value">实时位移值mm：{{ displacementSmall }}</div>
        <!-- <div class="value">实时压力值kg：{{ pressureSmall }}</div> -->
        <div class="value">最大位移mm：{{ displacementSmallMax }}</div>
        <div class="value">最小位移mm：{{ displacementSmallMin }}</div>
        <div class="value">平均压力值kg：{{ pressureSmallAverage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'
import ByteLength from '@serialport/parser-byte-length'
import Readline from '@serialport/parser-readline'

/* 数据库 */
import { initDB } from '@/db/index.js'

export default {
  name: 'life-test',

  data() {
    return {
      fullscreenLoading: false, // 全屏加载动效

      /* 串口相关变量 */
      // 数据接收
      usbPortReceive: null,
      parserReceive: null,
      scmBaudRateReceive: 115200,
      // 微型
      usbPortMiniature: null,
      parserMiniature: null,
      scmBaudRateMiniature: 57600,
      // 小型
      usbPortSmall: null,
      parserSmall: null,
      scmBaudRateSmall: 57600,
      // 3个COM口
      comReceive: '',
      comSendMiniature: '',
      comSendSmall: '',

      /* 开关 */
      isMiniatureStart: false, // 是否开始（微型）
      isMiniatureStop: false, // 是否暂停（微型）
      isSmallStart: false, // 是否开始（小型）
      isSmallStop: false, // 是否暂停（小型）

      /* 往返次数 */
      numMiniature: 0, // 微型
      numSmall: 0, // 小型
      /* 位移值 */
      displacementMiniature: 0, // 微型，0.00~200.00mm
      displacementSmall: 0, // 小型，0.00~200.00mm
      displacementMiniatureArray: [], // 微型，一次往复的位移数组，用来记录最大最小位移
      displacementSmallArray: [], // 小型，一次往复的位移数组，用来记录最大最小位移
      displacementMiniatureMax: 0, // 微型，最大位移
      displacementMiniatureMin: 0, // 微型，最小位移
      displacementSmallMax: 0, // 小型，最大位移
      displacementSmallMin: 0, // 小型，最小位移
      /* 压力值 */
      pressureMiniature: 0, // 微型，kg
      pressureSmall: 0, // 小型，kg
      pressureMiniatureArray: [], // 微型，一次往复的压力值数组，用来记录平均压力值
      pressureSmallArray: [], // 小型，一次往复的压力值数组，用来记录平均压力值
      pressureMiniatureAverage: 0, // 微型，平均压力值
      pressureSmallAverage: 0, // 小型，平均压力值

      /* 时间 */
      startTimeMiniature: '', // 开始-微型
      endTimeMiniature: '', // 结束-微型
      startTimeSmall: '', // 开始-小型
      endTimeSmall: '', // 结束-小型

      /* 其他 */
      oneK: 0,
      twoK: 0,
      oneStandard: 0,
      twoStandard: 0,
      numMiniatureTip: false, // 标记位
      smallTip: false // 标记位
    }
  },

  created() {
    this.comReceive = window.localStorage.getItem('com-receive')
    this.comSendMiniature = window.localStorage.getItem('com-send-miniature')
    this.comSendSmall = window.localStorage.getItem('com-send-small')

    this.oneStandard = this.$store.state.zeroStandard.oneStandard
    this.twoStandard = this.$store.state.zeroStandard.twoStandard

    this.oneK = parseFloat(window.localStorage.getItem('oneK'))
    this.twoK = parseFloat(window.localStorage.getItem('twoK'))

    if (this.oneStandard === null || this.twoStandard === null) {
      this.$alert(`压力传感器没有调零，请点击“前往调零”按钮！`, `提示`, {
        type: 'error',
        showClose: false,
        center: true,
        confirmButtonText: '前往调零',
        callback: () => {
          this.handleToZero()
        }
      })
    }
  },
  mounted() {
    this.fullscreenLoading = true
    setTimeout(() => {
      this.fullscreenLoading = false
      if (this.comReceive) {
        this.initSerialPortReceive()
      }
      if (this.comSendMiniature) {
        this.initSerialPortSendMiniature()
      }
      if (this.comSendSmall) {
        this.initSerialPortSendSmall()
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
     * @description: 前往调零页
     */
    handleToZero() {
      this.$router.push({
        path: '/set-zero'
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
              const dataArrayTwo = dataTwo.split(' ')

              this.displacementMiniature = parseFloat(dataArrayOne[0]) // 位移（微型）
              this.displacementSmall = parseFloat(dataArrayTwo[0]) // 位移（小型）

              const pressureMiniatureDA = dataArrayOne[1] // 压力5位数字量（微型）
              const pressureSmallDA = dataArrayTwo[1] // 压力5位数字量（小型）
              this.pressureMiniature = Math.abs(
                parseFloat(
                  (
                    (pressureMiniatureDA - this.oneStandard) /
                    -this.oneK
                  ).toFixed(2)
                )
              )
              this.pressureSmall = Math.abs(
                parseFloat(
                  ((pressureSmallDA - this.twoStandard) / -this.twoK).toFixed(2)
                )
              )

              /* 50mm~150mm之间往复运动 */
              /* 微型 */
              if (this.displacementMiniature >= 130) {
                this.displacementMiniatureArray.push(this.displacementMiniature)
                if (this.numMiniatureTip === true) {
                  // 计数+1
                  this.numMiniature += 1
                  // 位移最大值
                  this.displacementMiniatureMax = Math.max(
                    ...this.displacementMiniatureArray
                  )
                  // 位移最小值
                  this.displacementMiniatureMin = Math.min(
                    ...this.displacementMiniatureArray
                  )
                  // 平均压力值
                  this.pressureMiniatureAverage = this.pressureMiniature
                }
                this.numMiniatureTip = false
              }
              if (this.displacementMiniature <= 60) {
                this.displacementMiniatureArray.push(this.displacementMiniature)
                this.numMiniatureTip = true
              }
              if (this.displacementMiniatureArray.length >= 100) {
                this.displacementMiniatureArray = []
              }
              // this.pressureMiniatureArray.push(this.pressureMiniature)
              // if (this.pressureMiniatureArray.length >= 400) {
              //   // 压力平均值
              //   this.pressureMiniatureAverage = parseFloat(
              //     (
              //       this.pressureMiniatureArray.reduce(
              //         (acc, curr) => acc + curr
              //       ) / this.pressureMiniatureArray.length
              //     ).toFixed(2)
              //   )
              //   this.pressureMiniatureArray = []
              // }

              /* 小型 */
              if (this.displacementSmall >= 130) {
                this.displacementSmallArray.push(this.displacementSmall)
                if (this.smallTip === true) {
                  // 计数+1
                  this.numSmall += 1
                  // 位移最大值
                  this.displacementSmallMax = Math.max(
                    ...this.displacementSmallArray
                  )
                  // 位移最小值
                  this.displacementSmallMin = Math.min(
                    ...this.displacementSmallArray
                  )
                  // 平均压力值
                  this.pressureSmallAverage = this.pressureSmall
                }
                this.smallTip = false
              }
              if (this.displacementSmall <= 60) {
                this.displacementSmallArray.push(this.displacementSmall)
                this.smallTip = true
              }
              if (this.displacementSmallArray.length >= 100) {
                this.displacementSmallArray = []
              }
              // this.pressureSmallArray.push(this.pressureSmall)
              // if (this.pressureSmallArray.length >= 400) {
              //   // 压力平均值
              //   this.pressureSmallAverage = parseFloat(
              //     (
              //       this.pressureSmallArray.reduce((acc, curr) => acc + curr) /
              //       this.pressureSmallArray.length
              //     ).toFixed(2)
              //   )
              //   this.pressureSmallArray = []
              // }
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

    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */

    /**
     * @description: 开始（微型）
     */
    handleStartMiniature() {
      this.isMiniatureStart = true

      this.fullscreenLoading = true
      // 主机发送数据 - 模式给定
      console.log('主机发送数据 - 模式给定')
      this.usbPortMiniature.write([
        0x01, 0x06, 0x60, 0x60, 0x00, 0x10, 0x96, 0x18
      ])
      setTimeout(() => {
        // 主机发送数据 - 每圈脉冲数（500）
        console.log('主机发送数据 - 每圈脉冲数（500）')
        this.usbPortMiniature.write([
          0x01, 0x06, 0x20, 0x33, 0x01, 0xf4, 0x72, 0x12
        ])
        setTimeout(() => {
          // 主机发送数据 - 第一段位置给定（先给负数）
          console.log('主机发送数据 - 第一段位置给定（先给负数）')
          this.usbPortMiniature.write([
            0x01, 0x06, 0x20, 0x40, 0xd8, 0xf0, 0xd9, 0x9a
          ])
          setTimeout(() => {
            // 主机发送数据 - 第二段位置给定（再给正数）
            console.log('主机发送数据 - 第二段位置给定（再给正数）')
            this.usbPortMiniature.write([
              0x01, 0x06, 0x20, 0x41, 0x27, 0x10, 0xc8, 0x22
            ])
            setTimeout(() => {
              // 主机发送数据 - 第一段速度给定
              console.log('主机发送数据 - 第一段速度给定')
              this.usbPortMiniature.write([
                0x01, 0x06, 0x20, 0x44, 0x01, 0xf4, 0xc2, 0x08
              ])
              setTimeout(() => {
                // 主机发送数据 - 第二段速度给定
                console.log('主机发送数据 - 第二段速度给定')
                this.usbPortMiniature.write([
                  0x01, 0x06, 0x20, 0x45, 0x01, 0xf4, 0x93, 0xc8
                ])
                setTimeout(() => {
                  // 主机发送数据 - 系统密码
                  console.log('主机发送数据 - 系统密码')
                  this.usbPortMiniature.write([
                    0x01, 0x06, 0x20, 0x20, 0x00, 0x7b, 0xc3, 0xe3
                  ])
                  setTimeout(() => {
                    // 主机发送数据 - 关机保存
                    console.log('主机发送数据 - 关机保存')
                    this.usbPortMiniature.write([
                      0x01, 0x06, 0x20, 0x21, 0x00, 0x01, 0x13, 0xc0
                    ])
                    setTimeout(() => {
                      // 主机发送数据 - 重新启动
                      console.log('主机发送数据 - 重新启动')
                      this.usbPortMiniature.write([
                        0x01, 0x06, 0x20, 0x24, 0x00, 0x01, 0x03, 0xc1
                      ])
                      setTimeout(() => {
                        // 主机发送数据 - 控制给定
                        console.log('机发送数据 - 控制给定')
                        this.usbPortMiniature.write([
                          0x01, 0x06, 0x60, 0x40, 0x00, 0x00, 0x96, 0x1e
                        ])
                        setTimeout(() => {
                          // 主机发送数据 - 控制给定
                          console.log('主机发送数据 - 控制给定')
                          this.usbPortMiniature.write([
                            0x01, 0x06, 0x60, 0x40, 0x00, 0x08, 0x97, 0xd8
                          ])
                          this.fullscreenLoading = false
                          this.startTimeMiniature = this.$moment().format(
                            'YYYY-MM-DD HH:mm:ss'
                          )
                        }, 1000)
                      }, 1000)
                    }, 3000)
                  }, 1000)
                }, 1000)
              }, 1000)
            }, 1000)
          }, 1000)
        }, 1000)
      }, 1000)
    },

    /**
     * @description: 暂停（微型）
     */
    handleStopMiniature() {
      this.isMiniatureStop = true

      this.fullscreenLoading = true
      // 急停
      console.log('主机发送数据 - 控制给定（急停）')
      this.usbPortMiniature.write([
        0x01, 0x06, 0x60, 0x40, 0x00, 0x10, 0x97, 0xd2
      ])
      this.fullscreenLoading = false

      this.endTimeMiniature = this.$moment().format('YYYY-MM-DD HH:mm:ss')

      if (this.numMiniature > 10) {
        this.saveMiniature()
      } else {
        this.$message({
          message: '警告：微型电缸往的复次数少于10次，不给予保存！',
          type: 'warning',
          duration: 5000
        })
      }
    },

    /**
     * @description: 保存数据（微型）
     */
    saveMiniature() {
      const startTimeMiniature = this.startTimeMiniature
      const endTimeMiniature = this.endTimeMiniature
      const numMiniature = this.numMiniature
      const displacementMiniatureMax = this.displacementMiniatureMax
      const displacementMiniatureMin = this.displacementMiniatureMin
      const pressureMiniatureAverage = this.pressureMiniatureAverage

      // 保存数据到数据库
      const db = initDB()
      db.life_data
        .add({
          electric: '微型电缸',
          startTime: startTimeMiniature, // 开始时间
          endTime: endTimeMiniature, // 结束时间
          num: numMiniature, // 往复次数
          displacementMax: displacementMiniatureMax, // 最大位移
          displacementMin: displacementMiniatureMin, // 最小位移
          pressureAverage: pressureMiniatureAverage // 平均压力
        })
        .then(() => {
          this.$message({
            message: '数据保存成功',
            type: 'success',
            duration: 5000
          })
        })
        .then(() => {
          this.numMiniature = 0
          this.displacementMiniatureArray = []
          this.displacementMiniatureMax = 0
          this.displacementMiniatureMin = 0
          this.pressureMiniatureArray = []
          this.pressureMiniatureAverage = 0
        })
        .catch(() => {
          this.$confirm(`请点击"重新保存"按钮！`, '微型-数据保存失败', {
            type: 'error',
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            center: true,
            confirmButtonText: '重新保存',
            cancelButtonText: '刷新页面'
          })
            .then(() => {
              this.saveMiniature()
            })
            .catch(() => {
              this.handleRefresh()
            })
        })
    },

    /**
     * @description: 继续（微型）
     */
    handleRestoreMiniature() {
      this.isMiniatureStop = false

      this.fullscreenLoading = true
      // 恢复
      console.log('主机发送数据 - 控制给定（恢复）')
      this.usbPortMiniature.write([
        0x01, 0x06, 0x60, 0x40, 0x00, 0x08, 0x97, 0xd8
      ])
      this.fullscreenLoading = false

      this.startTimeMiniature = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },

    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */

    /**
     * @description: 开始（小型）
     */
    handleStartSmall() {
      this.isSmallStart = true

      this.fullscreenLoading = true
      // 主机发送数据 - 模式给定
      console.log('主机发送数据 - 模式给定')
      this.usbPortSmall.write([0x01, 0x06, 0x60, 0x60, 0x00, 0x10, 0x96, 0x18])
      setTimeout(() => {
        // 主机发送数据 - 每圈脉冲数（500）
        console.log('主机发送数据 - 每圈脉冲数（500）')
        this.usbPortSmall.write([
          0x01, 0x06, 0x20, 0x33, 0x01, 0xf4, 0x72, 0x12
        ])
        setTimeout(() => {
          // 主机发送数据 - 第一段位置给定（先给负数）
          console.log('主机发送数据 - 第一段位置给定（先给负数）')
          this.usbPortSmall.write([
            0x01, 0x06, 0x20, 0x40, 0xd8, 0xf0, 0xd9, 0x9a
          ])
          setTimeout(() => {
            // 主机发送数据 - 第二段位置给定（再给正数）
            console.log('主机发送数据 - 第二段位置给定（再给正数）')
            this.usbPortSmall.write([
              0x01, 0x06, 0x20, 0x41, 0x27, 0x10, 0xc8, 0x22
            ])
            setTimeout(() => {
              // 主机发送数据 - 第一段速度给定
              console.log('主机发送数据 - 第一段速度给定')
              this.usbPortSmall.write([
                0x01, 0x06, 0x20, 0x44, 0x01, 0xf4, 0xc2, 0x08
              ])
              setTimeout(() => {
                // 主机发送数据 - 第二段速度给定
                console.log('主机发送数据 - 第二段速度给定')
                this.usbPortSmall.write([
                  0x01, 0x06, 0x20, 0x45, 0x01, 0xf4, 0x93, 0xc8
                ])
                setTimeout(() => {
                  // 主机发送数据 - 系统密码
                  console.log('主机发送数据 - 系统密码')
                  this.usbPortSmall.write([
                    0x01, 0x06, 0x20, 0x20, 0x00, 0x7b, 0xc3, 0xe3
                  ])
                  setTimeout(() => {
                    // 主机发送数据 - 关机保存
                    console.log('主机发送数据 - 关机保存')
                    this.usbPortSmall.write([
                      0x01, 0x06, 0x20, 0x21, 0x00, 0x01, 0x13, 0xc0
                    ])
                    setTimeout(() => {
                      // 主机发送数据 - 重新启动
                      console.log('主机发送数据 - 重新启动')
                      this.usbPortSmall.write([
                        0x01, 0x06, 0x20, 0x24, 0x00, 0x01, 0x03, 0xc1
                      ])
                      setTimeout(() => {
                        // 主机发送数据 - 控制给定
                        console.log('机发送数据 - 控制给定')
                        this.usbPortSmall.write([
                          0x01, 0x06, 0x60, 0x40, 0x00, 0x00, 0x96, 0x1e
                        ])
                        setTimeout(() => {
                          // 主机发送数据 - 控制给定
                          console.log('主机发送数据 - 控制给定')
                          this.usbPortSmall.write([
                            0x01, 0x06, 0x60, 0x40, 0x00, 0x08, 0x97, 0xd8
                          ])
                          this.fullscreenLoading = false
                          this.startTimeSmall = this.$moment().format(
                            'YYYY-MM-DD HH:mm:ss'
                          )
                        }, 1000)
                      }, 1000)
                    }, 3000)
                  }, 1000)
                }, 1000)
              }, 1000)
            }, 1000)
          }, 1000)
        }, 1000)
      }, 1000)
    },

    /**
     * @description: 暂停（小型）
     */
    handleStopSmall() {
      this.isSmallStop = true

      this.fullscreenLoading = true
      // 急停
      console.log('主机发送数据 - 控制给定（急停）')
      this.usbPortSmall.write([0x01, 0x06, 0x60, 0x40, 0x00, 0x10, 0x97, 0xd2])
      this.fullscreenLoading = false

      this.endTimeSmall = this.$moment().format('YYYY-MM-DD HH:mm:ss')

      if (this.numSmall > 10) {
        this.saveSmall()
      } else {
        this.$message({
          message: '警告：小型电缸往的复次数少于10次，不给予保存！',
          type: 'warning',
          duration: 5000
        })
      }
    },

    /**
     * @description: 保存数据（小型）
     */
    saveSmall() {
      const startTimeSmall = this.startTimeSmall
      const endTimeSmall = this.endTimeSmall
      const numSmall = this.numSmall
      const displacementSmallMax = this.displacementSmallMax
      const displacementSmallMin = this.displacementSmallMin
      const pressureSmallAverage = this.pressureSmallAverage

      // 保存数据到数据库
      const db = initDB()
      db.life_data
        .add({
          electric: '小型电缸',
          startTime: startTimeSmall, // 开始时间
          endTime: endTimeSmall, // 结束时间
          num: numSmall, // 往复次数
          displacementMax: displacementSmallMax, // 最大位移
          displacementMin: displacementSmallMin, // 最小位移
          pressureAverage: pressureSmallAverage // 平均压力
        })
        .then(() => {
          this.$message({
            message: '数据保存成功',
            type: 'success',
            duration: 5000
          })
        })
        .then(() => {
          this.numSmall = 0
          this.displacementSmallArray = []
          this.displacementSmallMax = 0
          this.displacementSmallMin = 0
          this.pressureSmallArray = []
          this.pressureSmallAverage = 0
        })
        .catch(() => {
          this.$confirm(`请点击"重新保存"按钮！`, '小型-数据保存失败', {
            type: 'error',
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            center: true,
            confirmButtonText: '重新保存',
            cancelButtonText: '刷新页面'
          })
            .then(() => {
              this.saveSmall()
            })
            .catch(() => {
              this.handleRefresh()
            })
        })
    },

    /**
     * @description: 继续（小型）
     */
    handleRestoreSmall() {
      this.isSmallStop = false

      this.fullscreenLoading = true
      // 恢复
      console.log('主机发送数据 - 控制给定（恢复）')
      this.usbPortSmall.write([0x01, 0x06, 0x60, 0x40, 0x00, 0x08, 0x97, 0xd8])
      this.fullscreenLoading = false

      this.startTimeSmall = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },

    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */

    /**
     * @description: 数据记录
     */
    handleRecord() {
      this.$router.push({
        path: '/life-record'
      })
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
      @include flex(column, center, stretch);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 5px 30px;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 15px;
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
      @include flex(column, center, stretch);
      .value {
        border: 2px solid black;
        border-radius: 10px;
        padding: 5px 30px;
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
