/*
 * @Author      : Mr.bin
 * @Date        : 2023-02-27 10:27:06
 * @LastEditTime: 2023-05-16 11:15:26
 * @Description : 路由
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  /* 首页 */
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home')
  },
  /* 压力调零 */
  {
    path: '/set-zero',
    name: 'set-zero',
    component: () => import('@/views/set-zero')
  },
  /* 设置压力传感器的K值 */
  {
    path: '/set-k',
    name: 'set-k',
    component: () => import('@/views/set-k')
  },
  /* 设置COM口 */
  {
    path: '/set-com',
    name: 'set-com',
    component: () => import('@/views/set-com')
  },
  /* 设置参数（导程、减速比） */
  {
    path: '/set-parameter',
    name: 'set-parameter',
    component: () => import('@/views/set-parameter')
  },
  /* 寿命测试 */
  {
    path: '/life-test',
    name: 'life-test',
    component: () => import('@/views/life-test')
  },

  {
    path: '/refresh',
    name: 'refresh',
    component: () => import('@/views/refresh')
  },

  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  /* 自定义路由切换时页面如何滚动 */
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 } // 回到顶部
  }
})

export default router
