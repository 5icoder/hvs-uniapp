import Vue from 'vue'
import App from './App'
import $api from '@/api/index.js'
import vuexStore from '@/store/$u.mixin.js'
import store from '@/store'


Vue.config.productionTip = false

Vue.prototype.$api = $api

Vue.mixin(vuexStore);

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
	store,
	...App
})
app.$mount()
