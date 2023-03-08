// 根据传入参数，来判断是否已经登录
export default function checkLogin(loginInfo) {
	if (!Object.keys(loginInfo).length) {
		setTimeout(function() {
			uni.redirectTo({
				url: '/pages/login/login'
			})
		}, 3000)
		uni.showModal({
			title: '身份过期',
			content: '登录已失效，3秒后自动跳转',
			showCancel: false,
			success: (res) => {
				if (res.confirm) {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
			}
		});
	} else {
		return true
	}
}
