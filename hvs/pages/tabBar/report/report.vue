<template>
	<view class="report">
		<view class="tab-placeholder" :style="{ height: tabHeight + 'px' }">
			<u-tabs-swiper
				ref="uTabs"
				class="u-tabs"
				style="position:fixed;width:100%;z-index:1;"
				name="cate_name"
				count="cate_count"
				:list="tabList"
				:current="current"
				@change="tabsChange"
				:is-scroll="false"
				swiperWidth="750"
			></u-tabs-swiper>
		</view>
		<swiper :style="{ height: swiperHeight + 'px' }" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<u-select v-model="showSelect" mode="mutil-column" :default-value="[6, 6]" :list="tempList" title="今日体温" @confirm="reportRecord"></u-select>
				<view class="user-card">
					<view class="user-info">
						<text class="user-name">{{ vuex_user.username || '' }}</text>
						<br />
						<text>学号/工号：{{ vuex_user.register_id || '' }}</text>
						<br />
						<text>班级/部门：{{ department }}</text>
						<view class="logout"><button type="default" size="mini" @click="logout">退出登录</button></view>
					</view>
				</view>
				<view class="today-record">
					<view class="history" @click="navToHistory">历史记录</view>
					<u-cell-group :title-style="{ 'font-size': '32rpx', 'font-weight': '500', color: '#303133' }" :title="date + '(今日)体温'">
						<u-cell-item
							title="早上(06:30-09:30)"
							:index="0"
							:value-style="{ color: todayTemp[0] === '体温填报' ? '#2b85e4' : '' }"
							:value="todayTemp[0] !== '体温填报' && todayTemp[0] !== '时间未到' ? todayTemp[0] + '℃' : todayTemp[0]"
							@click="selectTemp"
						></u-cell-item>
						<u-cell-item
							title="中午(11:30-14:30)"
							:index="1"
							:value-style="{ color: todayTemp[1] === '体温填报' ? '#2b85e4' : '' }"
							:value="todayTemp[1] !== '体温填报' && todayTemp[1] !== '时间未到' ? todayTemp[1] + '℃' : todayTemp[1]"
							@click="selectTemp"
						></u-cell-item>
						<u-cell-item
							title="晚上(20:30-22:30)"
							:index="2"
							:value-style="{ color: todayTemp[2] === '体温填报' ? '#2b85e4' : '' }"
							:value="todayTemp[2] !== '体温填报' && todayTemp[2] !== '时间未到' ? todayTemp[2] + '℃' : todayTemp[2]"
							@click="selectTemp"
						></u-cell-item>
					</u-cell-group>
				</view>
				<view>
					<view class="status">
						<view class="status-title">健康状况</view>
						<u-image width="100%" :height="imageHeight + 'px'" mode="aspectFit" :src="statusImage"></u-image>
					</view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<u-empty text="填报完成，暂无数据" mode="list" v-if="fullFill"></u-empty>
				<view v-else>
					<u-toast ref="uToast" />
					<view class="form">
						<u-form :model="form" ref="uForm">
							<u-form-item label="姓名" prop="name" label-width="180"><u-input v-model="form.name" placeholder="请输入姓名" /></u-form-item>
							<u-form-item label="手机号码" prop="phone_number" label-width="180"><u-input v-model="form.phone_number" placeholder="请输入手机号" /></u-form-item>
							<u-form-item label="身份证件号" prop="license" label-width="180"><u-input v-model="form.license" placeholder="请输入身份证件号" /></u-form-item>
							<u-form-item label="性别" prop="gender" label-width="180">
								<u-radio-group v-model="form.gender">
									<u-radio name="1">男</u-radio>
									<u-radio name="0">女</u-radio>
								</u-radio-group>
							</u-form-item>
							<u-form-item label="假期是否离校" prop="leave" label-width="180" :border-bottom="false">
								<u-radio-group v-model="form.leave" @change="showDesInput">
									<u-radio name="1">是</u-radio>
									<u-radio name="0">否</u-radio>
								</u-radio-group>
							</u-form-item>
							<u-form-item label="目的地" prop="destination" label-width="180" v-show="inputDes"><u-input v-model="form.destination" placeholder="请输入目的地" /></u-form-item>
							<u-form-item label="14日内是否有以下情况:当前是否发热(体温≥37.5℃)、干咳、乏力等症状" prop="abnormal" label-position="top">
								<u-radio-group v-model="form.abnormal">
									<u-radio name="1">是</u-radio>
									<u-radio name="0">否</u-radio>
								</u-radio-group>
							</u-form-item>
							<u-form-item label="14日内是否有与新冠肺炎确诊或疑似病例有密切接触" prop="case_contact" label-position="top">
								<u-radio-group v-model="form.case_contact">
									<u-radio name="1">是</u-radio>
									<u-radio name="0">否</u-radio>
								</u-radio-group>
							</u-form-item>
						</u-form>
					</view>
					<view class="form-submit">
						<u-checkbox v-model="agree">本人承诺以上信息正式准确。如有不实本人与承担由此引起的一起后果和法律责任</u-checkbox>
						<view style="height:30rpx;"></view>
						<u-button type="primary" style="width: 80vw;" :loading="submitLoading" @click="submitInfo">提交</u-button>
						<u-divider margin-top="30">没有更多了</u-divider>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import checkLogin from '@/common/check.js'
export default {
	data() {
		return {
			// 每日体温上报
			tabList: [],
			date: '',
			current: 0,
			swiperHeight: '100px',
			swiperCurrent: 0,
			tabHeight: 0,
			imageHeight: 0,
			showSelect: false,
			tempIndex: '',
			statusImage: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-a0ff070e-a200-4659-9bd1-b211b31246e1/f8f343ae-41ae-477e-a528-5c4301582c46.png',
			todayTemp: ['时间未到','时间未到','时间未到'],
			tempList: [],
			// 表单字段
			form: {
				name: '',
				phone_number: '',
				license: '',
				gender: '',
				leave: '',
				destination: '',
				abnormal: '',
				case_contact: ''
			},
			inputDes: false, // 是否显示目的地
			// 用户协议
			agree: false,
			submitLoading: false,
			fullFill: false,
			// 表单校验规则
			rules: {
				name: [
					{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}
				],
				phone_number: [
					{
						required: true,
						message: '请输入手机号码	',
						trigger: ['blur', 'change']
					},
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.mobile(value)
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur']
					}
				],
				license: [
					{
						required: true,
						message: '请输入身份证号	',
						trigger: ['blur', 'change']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.idCard(value)
						},
						message: '身份证号不正确',
						trigger: ['change', 'blur']
					}
				],
				gender: [
					{
						required: true,
						message: '请选择性别',
						enum: [0, 1],
						trigger: ['blur', 'change']
					}
				],
				leave: [
					{
						required: true,
						message: '请选择一个选项',
						trigger: ['blur', 'change']
					}
				],
				destination: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (this.inputDes) {
								if (!value) {
									return false
								} else {
									return true
								}
							} else {
								return true
							}
						},
						message: '请输入目的地',
						trigger: ['change', 'blur']
					}
				],
				abnormal: [
					{
						required: true,
						message: '请选择一个选项',
						trigger: ['blur', 'change']
					}
				],
				case_contact: [
					{
						required: true,
						message: '请选择一个选项',
						trigger: ['blur', 'change']
					}
				]
			}
		}
	},
	computed: {
		department() {
			const department_id = this.vuex_user.class ? this.vuex_user.class : this.vuex_user.department
			return department_id
		}
	},
	onLoad() {
		this.getTempList()
		this.getDate()
		this.getFormInfo()
		this.getTodayRecord()
	},
	onReady() {
		checkLogin(this.vuex_user)
		this.getElementsHeight()
		this.$refs.uForm.setRules(this.rules)
	},
	watch: {
		swiperCurrent(newValue, oldValue) {
			if (newValue === 1) {
				this.$api.checkFill({ form_id: this.vuex_form[1].form_id }).then(res => {
					this.fullFill = res.data
				})
			}
		}
	},
	methods: {
		// 获取表单信息
		getFormInfo() {
			this.vuex_form.forEach(item => {
				if(!item.length){
					let form = {
						cate_name: item.title,
						cate_count: '',
						form_id: item.form_id
					}
					this.tabList.push(form)
				}
			})
		},
		// 获取温度范围
		getTempList(){
			let tens = [], single = []
			for(let i = 30; i<=42; i++){
				const item = {
					value: i,
					label: i
				}
				tens.push(item)
			}
			for(let i = 0; i<10; i++){
				const item = {
					value: i,
					label: i
				}
				single.push(item)
			}
			this.tempList.push(tens, single)
		},
		// 获取今日记录
		getTodayRecord() {
			const form_id = this.tabList[this.current].form_id
			this.$api.getRecords({form_id}).then(res => {
				console.log(res.data.records);
				if (res.data.records.length) {
					res.data.records.forEach((item,index)=>{
						this.$set(this.todayTemp, index, item)
						// this.todayTemp[index] = item
					})
					this.statusImage = res.data.image
					this.tabList[0].cate_count = 3 - res.data.records.length
				}else{
					this.tabList[0].cate_count = 3
				}
			})
		},
		// 校验体温上报日期
		getDate() {
			const now = Date.parse(new Date())
			this.date = this.$u.timeFormat(now, 'yyyy-mm-dd')
			const t0 = Date.parse(`${this.date} 06:30:00`)
			const t1 = Date.parse(`${this.date} 11:30:00`)
			const t2 = Date.parse(`${this.date} 20:30:00`)
			if(now>t0 && this.todayTemp[0] === '时间未到'){
				this.todayTemp[0] = '体温填报'
			}
			if(now>t1 && this.todayTemp[1] === '时间未到'){
				this.todayTemp[1] = '体温填报'
			}
			if(now>t2 && this.todayTemp[2] === '时间未到'){
				this.todayTemp[2] = '体温填报'
			}
		},
		// 查看历史记录
		navToHistory(){
			uni.switchTab({
				url: '/pages/tabBar/check/check'
			})
		},
		// 获取元素高度
		getElementsHeight() {
			const query = uni.createSelectorQuery().in(this)
			const windowHeight = uni.getSystemInfoSync().windowHeight
			query
				.select('.u-tabs')
				.boundingClientRect(data => {
					this.tabHeight = data.height || 44
					this.swiperHeight = windowHeight - this.tabHeight
				})
				.exec()
			query
				.select('.status-title')
				.boundingClientRect(data => {
					// 不知道哪里多出来的15px,暂时还没搞懂uni-app获取元素坐标
					this.imageHeight = this.swiperHeight - data.bottom - 20
				})
				.exec()
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx
			this.$refs.uTabs.setDx(dx)
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current
			this.$refs.uTabs.setFinishCurrent(current)
			this.swiperCurrent = current
			this.current = current
		},
		// 打开体温选择器
		selectTemp(index) {
			this.tempIndex = index
			if (this.todayTemp[index]==='体温填报') {
				for (let i = 0; i < index; i++) {
					if(this.todayTemp[i]==='体温填报'){
						uni.showToast({
							title: '请按顺序填报',
							icon: 'none'
						})
						return
					}
				}
				this.showSelect = true
			}
		},
		// 提交今日体温信息
		reportRecord(data) {
			const temp = parseFloat(data[0].value) + parseFloat(data[1].value * 0.1)
			// this.todayTemp[this.tempIndex] = temp
			const form_id = this.tabList[this.current].form_id
			const record = {
				form_id: form_id,
				temp: temp
			}
			this.$api
				.reportRecord(record)
				.then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '上报成功',
							icon: 'none'
						})
						this.getTodayRecord()
					}
				})
				.catch(err => {
					uni.showToast({
						title: '上报失败，请稍后再试',
						icon: 'none'
					})
				})
			this.showSelect = false
		},
		// 目的地输入框
		showDesInput(value) {
			this.inputDes = parseInt(value) ? true : false
			this.form.destination = ''
		},
		// 提交信息
		submitInfo() {
			if (this.agree) {
				this.$refs.uForm.validate(vaild => {
					console.log(vaild)
					if (vaild) {
						const form_id = this.tabList[this.current].form_id
						const record = {
							form_id: form_id,
							form: this.form
						}

						this.submitLoading = true
						this.$api.reportBack(record).then(res => {
							if (res.code === 200) {
								uni.showToast({
									title: '上报成功',
									icon: 'none'
								})
								this.submitLoading = false
								this.fullFill = true
							}
						})
					}
				})
			} else {
				this.$refs.uToast.show({
					title: '请阅读并勾选填表须知',
					type: 'warning',
					duration: '2000'
				})
			}
		},
		//退出登录
		logout(){
			uni.clearStorageSync()
			uni.redirectTo({
				url: '/pages/login/login',
				success: () => {
					console.log('成功/pages/login/login')
					uni.redirectTo({
						url: '/pages/login/login'
					})
				},
				fail: () => {
					console.log('失败/pages/login/login')
					uni.redirectTo({
						url: '../../login/login'
					})
				},
				complete: ()=> {
					console.log('完成/pages/login/login')
					uni.redirectTo({
						url: '../../login/login'
					})
				}
			})
			// uni.removeStorage({
			// 	key: 'lifeData',
			// 	success: () => {
			// 		uni.redirectTo({
			// 			url: '/pages/login/login'
			// 		})
			// 	},
			// 	fail: () => {
			// 		console.log('失败');
			// 	}
			// })
		}
	}
}
</script>

<style lang="scss">
page {
	height: 100%;
}
.report {
	height: 100%;
	.swiper-item {
		height: 100%;
		overflow: scroll;
	}
	.tab-placeholder {
		width: 100%;
		height: 88rpx;
	}
}
// 每日体温上报
.swiper-item {
	.user-card {
		width: 100%;
		height: 320rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to bottom, #3f87ff 50%, #fff 0%);
		.user-info {
			position: relative;
			width: 94vw;
			height: 240rpx;
			padding: 20rpx 40rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			background-color: #ffffff;
			box-shadow: 4rpx 4rpx 12rpx #3f87ff;
			text {
				font-weight: 400;
				color: $u-tips-color;
				font-size: 32rpx;
			}
			.user-name {
				line-height: 88rpx;
				font-weight: 500;
				font-size: 48rpx;
			}
			.logout{
				position: absolute;
				right: 20px;
				top: calc(50% - 30rpx);
			}
		}
	}
	.today-record {
		position: relative;
		.record-title {
			color: $u-main-color;
			font-size: 32rpx;
		}
		.history {
			position: absolute;
			right: 0;
			top: 30rpx;
			padding-right: 40rpx;
			color: $u-type-primary-dark;
		}
	}
	.status {
		height: 100%;
		padding: 48rpx 32rpx 32rpx 32rpx;
		box-sizing: border-box;
		.status-title {
			padding-bottom: 20rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #303133;
		}
	}
}
// 健康状况登记
.swiper-item {
	.form {
		padding: 0 30rpx 20rpx;
		box-sizing: border-box;
	}
	.form-submit {
		height: 320rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		margin-top: 50rpx;
		margin-bottom: 60rpx;
		box-sizing: border-box;
	}
}
</style>
