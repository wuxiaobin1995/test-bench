/*
 * @Author      : Mr.bin
 * @Date        : 2023-02-27 11:15:35
 * @LastEditTime: 2023-02-28 10:41:58
 * @Description : vuex
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 调零基准值
    zeroStandard: {
      oneStandard: null,
      twoStandard: null
    }
  },

  mutations: {
    // 调零基准值
    SET_ZEROSTANDARD(state, zeroStandard) {
      state.zeroStandard = zeroStandard
    }
  },

  actions: {
    // 调零基准值
    setZeroStandard({ commit }, zeroStandard) {
      return new Promise((resolve, reject) => {
        commit('SET_ZEROSTANDARD', zeroStandard)
        resolve()
      })
    }
  }
})
