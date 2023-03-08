<template>
	<view class="login">
		<view class="title">
			你好，
			<br />
			欢迎登录
		</view>
		<u-form :model="form" ref="uForm">
			<u-form-item label="用户名" label-width="160" prop="username"><u-input v-model="form.username" placeholder="请输入账户名" /></u-form-item>
			<u-form-item label="密码" label-width="160" prop="password"><u-input type="password" v-model="form.password" placeholder="请输入账户密码" /></u-form-item>
		</u-form>
		<u-button style="margin-top: 30rpx;" type="primary" :loading="loading" @click="submit">登录</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				username: '',
				password: ''
			},
			rules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					}
				]
			},
			loading: false
		}
	},
	onLoad() {
		if (Object.keys(this.vuex_user).length) {
			uni.switchTab({
				url: '/pages/tabBar/report/report'
			})
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules)
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(vaild => {
				if (vaild) {
					this.loading = true
					uniCloud.callFunction({
						name:'user-center',
						data:{
							action: 'login',
							params: this.form
						},
						success:res=>{
							res = res.result
							if (res.code === 0) {
								this.$u.vuex('vuex_user', res.userInfo)
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 1500,
									complete: setTimeout(function() {
										uni.switchTab({
											url: '/pages/tabBar/report/report'
										})
									}, 500)
								})
							} else if (res.code === 10002) {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 1500
								})
							} else if (res.code === 10102) {
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 1500
								})
							} else if (res.code === 10103) {
								console.log(res);
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 1500
								})
							}
						},
						fail:res=>{
							uni.showToast({
								title: res.result.msg,
								icon: 'none',
								duration: 1500
							})
						},
						complete: () => {
							this.loading = false
						}
					})
					this.$api.getFormInfo().then(res => {
						this.$u.vuex('vuex_form', res.data)
					})
				}
			})
		}
	}
}
</script>

<style lang="scss">
page {
	height: 100%;
}
.login {
	padding: 120rpx 60rpx;
	box-sizing: border-box;
	.title {
		font-size: 48rpx;
		font-weight: 500;
		margin-bottom: 40rpx;
	}
}
</style>
