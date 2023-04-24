/*
 * @Author      : Mr.bin
 * @Date        : 2023-02-27 10:27:06
 * @LastEditTime: 2023-02-27 14:11:01
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
/* 引入样式重置表和acss，建议放最后 */
import '@/style/cover-output.scss'

/************************************************************/
/* 使用Element-UI组件库 */
Vue.use(ElementUI)
/* 使用Echarts图形库 */
Vue.prototype.$echarts = Echarts

/************************************************************/
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
