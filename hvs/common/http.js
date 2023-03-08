/**
 * 云函数调用和接口拦截
 * @param {Object} opts
 */
import store from "@/store"
export default function $http(opts) {
	const {
		url,
		data
	} = opts
	// vuex中得到用户的register_id
	const dataObj = {
		register_id: store.state.vuex_user.register_id,
		...data
	}
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: url,
			data: dataObj
		}).then((res) => {
				// 接口拦截，自定义状态码
				const status_codes = res.result.code
				if (status_codes === 0 || status_codes === 200) {
					reslove(res.result)
				} else {
					reject(res.result)
					// uni.showToast({
					// 	title:'请求失败，请稍后重试',
					// 	icon: 'none'
					// })
				}
		}).catch((err) => {
			reject(err)
		})
	})
}
