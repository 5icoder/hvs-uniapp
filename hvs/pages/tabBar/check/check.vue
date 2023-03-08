<template>
	<view class="check">
		<view class="notice-box"><u-notice-bar mode="horizontal" :type="notice.level" :list="notice.list"></u-notice-bar></view>
		<u-section :title="chartTitle">
			<dropdown-menu :menuItems="menuItems" slot="right" @clickItem="changeData" v-show="vuex_user.role.includes('teacher')||vuex_user.role.includes('admin')"></dropdown-menu>
		</u-section>
		<view class="charts-box">
			<qiun-data-charts type="line" :opts="personOpts" :chartData="personChart" v-if="dataType === 'person'" />
			<qiun-data-charts type="column" :opts="classOpts" :chartData="classChart" v-if="dataType === 'class'" />
		</view>
		<u-section :title="tableTitle" :right="false"></u-section>
		<view class="table-box">
			<z-table 
			:tableData="personTable" 
			:columns="personColumns" 
			titleTextAlign="center" 
			textAlign="center" 
			:showLoading="false"
			emptyText="暂无数据"
			v-if="dataType === 'person'" ></z-table>
			<z-table 
			:tableData="classTable"
			 :columns="classColumns" 
			 titleTextAlign="center"
			:showLoading="false"
			emptyText="暂无数据"
			 v-if="dataType === 'class'" ></z-table>
		</view>
	</view>
</template>

<script>
import checkLogin from '@/common/check.js'
export default {
	data() {
		return {
			notice: {
				level: 'warning',
				list: ['避免封闭、拥挤或涉及近距离接触的空间', '咳嗽或打喷嚏时，用弯曲的手肘或纸巾捂住口鼻', '如果出现咳嗽、头痛、轻微发烧等轻微症状请及时联系本班辅导员']
			},
			dataType: 'person',
			personChart: {},
			classChart: {},
			personTable: [],
			classTable: [],
			personColumns: [
				{title: '日期',key: 'date'},
				{title: '状态',key: 'status'},
				{title: '体温(早/中/晚)',key: 'temps', width: 280}
			],
			classColumns: [
				{title: '日期',key: 'date'},
				{title: '类型',key: 'type'},
				{title: '详情',key: 'desc', width: 280}
			],
			menuItems: [{ type: 'person', name: '个人数据' }, { type: 'class', name: '班级数据' }],
			personOpts: { dataLabel: false, yAxis: { splitNumber: 15, showTitle: true, data: [{ max: 38, min: 35, tofix: 1, title: '℃' }] }, xAxis: {labelCount: 7} },
			classOpts: { dataLabel: false, yAxis: { showTitle: true, data: [{ max: 40, title: '人数' }] }, xAxis: {labelCount: 3} },
			chartTitle: '体温周报',
			tableTitle: '历史记录'
		}
	},
	onLoad() {
		this.getStatistics()
	},
	onReady() {
		checkLogin(this.vuex_user)
	},
	onShow() {
		this.getTable(this.dataType)
	},
	methods: {
		// 切换视图和数据
		changeData(type) {
			if (type === 'person') {
				this.pageTitle == '异常自检'
				this.tableTitle = '历史记录'
				this.chartTitle = '体温周报'
			} else{
				this.pageTitle == '班级健康日志'
				this.tableTitle = '班级日志'
				this.chartTitle = '班级统计'
			}
			this.dataType = type
			this.getTable(type)
		},
		// 获取最近一周的个人体温/班级日志记录
		getTable(type) {
			if (type === 'person') {
				this.$api.getHistory().then(res => {
					if (res.code === 200) {
						let tableData = []
						let chartData = {
							categories: [],
							series: [
								{
									name: '早上',
									data: []
								},
								{
									name: '中午',
									data: []
								},
								{
									name: '下午',
									data: []
								}
							]
						}
						res.data.forEach((item, index) => {
							// 过滤table数据
							const row = {
								date: item.record.create_date,
								status: item.record.status?'异常':'健康',
								temps: item.record.data.map(item => item + '℃').join('/')
							}
							tableData.push(row)
							// 过滤chart数据
							for (let i = 0; i < 3; i++) {
								if (item.record.data[i] === undefined) {
									// 数据为空填入默认温度
									chartData.series[i].data.push(36.6)
									continue
								}
								chartData.series[i].data.push(item.record.data[i])
							}
							if(index === 0){
								chartData.categories.push(item.record.create_date)
							}else{
								chartData.categories.push(item.record.create_date.substr(5))
							}
						})
						this.personChart = chartData
						this.personTable = tableData
					}
				})
			} else {
				this.$api.getLog().then(res => {
					if (res.code === 200) {
						let tableData = []
						res.data.forEach(item=>{
							let type = ''
							if (item.type === 0) {
								type = '体温异常'
							} else if (item.type === 1) {
								type = '高风险地区返校'
							} else if (item.type === 2) {
								type = '接触感染者'
							}
							const row = {
								date: item.create_date,
								desc: item.desc,
								type
							}
							tableData.push(row)
						})
						this.classTable = tableData
					}
				})
			}
		},
		
		// 查询统计数据
		getStatistics() {
			this.$api.getStatistics().then(res => {
				if (res.code === 200) {
					let chartData = {
						categories: [],
						series: [
							{
								name: '统计人数',
								data: []
							},
							{
								name: '健康',
								data: []
							},
							{
								name: '异常',
								data: []
							}
						]
					}
					res.data.forEach((item, index)=>{
						chartData.series[0].data.push(item.fill_times)
						chartData.series[1].data.push(item.fill_times - item.abnormal_number)
						chartData.series[2].data.push(item.abnormal_number)
						if(index === 0){
							chartData.categories.push(item.statistics_date)
						}else{
							chartData.categories.push(item.statistics_date.substr(5))
						}
					})
					this.classChart = chartData
				}
			})
		},
		// 切换数据
		switchRole() {
			this.pageTitle = this.pageTitle == '异常自检' ? '班级健康情况' : '异常自检'
			this.btnText = this.btnText == '个人' ? '班级' : '个人'
			uni.setNavigationBarTitle({
				title: this.pageTitle
			})
		}
	}
}
</script>

<style lang="scss">
page {
	width: 100%;
}
.check {
	padding: 32rpx;
	box-sizing: border-box;
	.charts-box {
		margin-top: 10rpx;
		width: 100%;
		height: 500rpx;
	}
	.notice-box {
		margin-bottom: 30rpx;
	}
	.table-box {
		margin-top: 20rpx;
	}
}
</style>
