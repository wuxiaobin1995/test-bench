/*
 * @Author      : Mr.bin
 * @Date        : 2023-02-27 10:27:06
 * @LastEditTime: 2023-05-26 10:29:09
 * @Description : 渲染进程入口
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/************************************************************/
/* 引入Element-UI组件库 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/* 引入Echarts图形库 */
import * as Echarts from 'echarts'
/* 引入moment时间日期库 */
import moment from 'moment'
/* 引入封装好的PDF插件 */
import { htmlToPdf } from '@/utils/htmlToPdf.js'
/* 引入初始化数据库 */
import { initDB } from '@/db/index.js'
/* 引入样式重置表和acss，建议放最后 */
import '@/style/cover-output.scss'

/************************************************************/
/* 使用Element-UI组件库 */
Vue.use(ElementUI)
/* 使用Echarts图形库 */
Vue.prototype.$echarts = Echarts
/* 使用moment时间日期库 */
Vue.prototype.$moment = moment
/* 使用封装好的PDF插件 */
Vue.prototype.$htmlToPdf = htmlToPdf
/* 使用数据库 */
initDB()
  .open()
  .catch(() => {
    alert('打开数据库失败，请重启软件')
  })

/************************************************************/
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
