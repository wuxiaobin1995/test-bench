<!--
 * @Author      : Mr.bin
 * @Date        : 2023-02-27 11:15:35
 * @LastEditTime: 2023-05-18 09:30:43
 * @Description : 根组件
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
/* 串口通信库 */
import SerialPort from 'serialport'

export default {
  name: 'App',

  created() {
    /* 初始化导程-微型 */
    if (!window.localStorage.getItem('lead-min')) {
      window.localStorage.setItem('lead-min', JSON.stringify(2.5))
    }
    /* 初始化导程-小型 */
    if (!window.localStorage.getItem('lead-small')) {
      window.localStorage.setItem('lead-small', JSON.stringify(5))
    }
    /* 初始化减速比-微型 */
    if (!window.localStorage.getItem('reduction-min')) {
      window.localStorage.setItem('reduction-min', JSON.stringify(1))
    }
    /* 初始化减速比-小型 */
    if (!window.localStorage.getItem('reduction-small')) {
      window.localStorage.setItem('reduction-small', JSON.stringify(7))
    }

    /* 初始化左K的值 */
    if (!window.localStorage.getItem('oneK')) {
      window.localStorage.setItem('oneK', '83.879')
    }
    /* 初始化右K的值 */
    if (!window.localStorage.getItem('twoK')) {
      window.localStorage.setItem('twoK', '83.879')
    }

    this.initSerialPort()
  },

  methods: {
    /**
     * @description: 初始化串口对象，遍历串口
     */
    initSerialPort() {
      SerialPort.list()
        .then(ports => {
          /* 遍历设备的USB串口，目标设备需安装驱动 */
          const comArray = []
          for (const port of ports) {
            if (/^USB/.test(port.pnpId)) {
              comArray.push(port.path)
            }
          }

          /* 初始化接收数据口的值 */
          if (!window.localStorage.getItem('com-receive')) {
            window.localStorage.setItem(
              'com-receive',
              comArray[0] ? comArray[0] : ''
            )
          }

          /* 初始化微型电缸发送指令口的值 */
          if (!window.localStorage.getItem('com-send-miniature')) {
            window.localStorage.setItem(
              'com-send-miniature',
              comArray[1] ? comArray[1] : ''
            )
          }

          /* 初始化小型电缸发送指令口的值 */
          if (!window.localStorage.getItem('com-send-small')) {
            window.localStorage.setItem(
              'com-send-small',
              comArray[2] ? comArray[2] : ''
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
                window.location.reload()
              }
            }
          )
        })
    }
  }
}
</script>
