<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="type" label="类型" required><uni-data-checkbox v-model="formData.type" :localdata="formOptions.type_localdata" /></uni-forms-item>
			<uni-forms-item name="create_date" label="日期" required><uni-easyinput placeholder="YYYY-MM-DD" v-model="formData.create_date" /></uni-forms-item>
			<uni-forms-item name="register_id" label="用户编号" required><uni-easyinput placeholder="用户编号" v-model="formData.register_id" /></uni-forms-item>
			<uni-forms-item name="pricipal" label="责任人编号" required><uni-easyinput placeholder="责任人编号" v-model="formData.pricipal" /></uni-forms-item>
			<uni-forms-item name="desc" label="描述" required><uni-easyinput placeholder="描述，100字以内" v-model="formData.desc" trim="both" /></uni-forms-item>

			<view class="uni-button-group"><button type="primary" class="uni-button" @click="submit">提交</button></view>
		</uni-forms>
	</view>
</template>

<script>
import { validator } from '../../js_sdk/validator/hvs-log.js'

const db = uniCloud.database()
const dbCollectionName = 'hvs-log'

function getValidator(fields) {
	let reuslt = {}
	for (let key in validator) {
		if (fields.indexOf(key) > -1) {
			reuslt[key] = validator[key]
		}
	}
	return reuslt
}

export default {
	data() {
		return {
			formData: {
				create_date: null,
				type: null,
				desc: '',
				register_id: '',
				pricipal: ''
			},
			formOptions: {
				type_localdata: [
					{
						text: '体温异常',
						value: 0
					},
					{
						text: '高风险地区返校',
						value: 1
					},
					{
						text: '接触感染者',
						value: 2
					}
				]
			},
			rules: {
				...getValidator(['type', 'desc', 'register_id', 'pricipal'])
			}
		}
	},
	onReady() {
		this.$refs.form.setRules(this.rules)
	},
	methods: {
		/**
		 * 触发表单提交
		 */
		submit() {
			uni.showLoading({
				mask: true
			})
			this.$refs.form
				.submit()
				.then(res => {
					this.submitForm(res)
				})
				.catch(errors => {
					uni.hideLoading()
				})
		},

		submitForm(value) {
			// 使用 clientDB 提交数据
			db.collection(dbCollectionName)
				.add(value)
				.then(res => {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				})
				.catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
				.finally(() => {
					uni.hideLoading()
				})
		}
	}
}
</script>

<style>
.uni-container {
	padding: 15px;
}

.uni-input-border,
.uni-textarea-border {
	width: 100%;
	font-size: 14px;
	color: #666;
	border: 1px #e5e5e5 solid;
	border-radius: 5px;
	box-sizing: border-box;
}

.uni-input-border {
	padding: 0 10px;
	height: 35px;
}

.uni-textarea-border {
	padding: 10px;
	height: 80px;
}

.uni-button-group {
	margin-top: 50px;
	display: flex;
	justify-content: center;
}

.uni-button {
	width: 184px;
	padding: 12px 20px;
	font-size: 14px;
	border-radius: 4px;
	line-height: 1;
	margin: 0;
}
</style>
