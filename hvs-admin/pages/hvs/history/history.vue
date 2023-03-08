<template>
	<view>
		<view class="uni-header">
			<view class="uni-group"><view class="uni-title">历史数据</view></view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="searchVal" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini">新增</button>
				<button class="uni-button" type="default" size="mini" @click="delTable">删除</button>
			</view>
		</view>
		<view class="uni-container">
			<uni-table :loading="loading" border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
				<uni-tr>
					<uni-th width="150" align="center">日期</uni-th>
					<uni-th width="150" align="center">姓名</uni-th>
					<uni-th align="center">手机号</uni-th>
					<uni-th align="center">身份证号</uni-th>
					<uni-th align="center">性别</uni-th>
					<uni-th width="204" align="center">假期是否离校</uni-th>
					<uni-th width="204" align="center">14天内发热情况</uni-th>
					<uni-th width="224" align="center">14天确诊或疑似病例接触情况</uni-th>
					<uni-th width="204" align="center">健康状态</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td align="center">{{ item.date }}</uni-td>
					<uni-td align="center">
						<view class="name">{{ item.name }}</view>
					</uni-td>
					<uni-td align="center">{{ item.phoneNumber }}</uni-td>
					<uni-td align="center">{{ item.license }}</uni-td>
					<uni-td align="center">{{ item.gender }}</uni-td>
					<uni-td align="center">{{ item.leave || item.destination }}</uni-td>
					<uni-td align="center">{{ item.abnormal }}</uni-td>
					<uni-td align="center">{{ item.caseContact }}</uni-td>
					<uni-td align="center">123s</uni-td>
				</uni-tr>
			</uni-table>
			<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
		</view>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</view>
</template>

<script>
import tableData from '../../demo/table/tableData.js'
export default {
	data() {
		return {
			searchVal: '',
			tableData: [],
			// 每页数据量
			pageSize: 10,
			// 当前页
			pageCurrent: 1,
			// 数据总量
			total: 0,
			loading: false
		}
	},
	onLoad() {
		this.selectedIndexs = []
		this.getData(1)
	},
	methods: {
		// 多选处理
		selectedItems() {
			return this.selectedIndexs.map(i => this.tableData[i])
		},
		// 多选
		selectionChange(e) {
			console.log(e.detail.index)
			this.selectedIndexs = e.detail.index
		},
		//批量删除
		delTable() {
			console.log(this.selectedItems())
		},
		// 分页触发
		change(e) {
			this.getData(e.current)
		},
		// 搜索
		search() {
			this.getData(1, this.searchVal)
		},
		// 获取数据
		getData(pageCurrent, value = '') {
			this.loading = true
			this.pageCurrent = pageCurrent
			this.request({
				pageSize: this.pageSize,
				pageCurrent: pageCurrent,
				value: value,
				success: res => {
					// console.log('data', res);
					this.tableData = res.data
					this.total = res.total
					this.loading = false
				}
			})
		},
		request(options) {
			const { pageSize, pageCurrent, success, value } = options
			let total = tableData.length
			let data = tableData.filter((item, index) => {
				const idx = index - (pageCurrent - 1) * pageSize
				return idx < pageSize && idx >= 0
			})
			if (value) {
				data = []
				tableData.forEach(item => {
					if (item.name.indexOf(value) !== -1) {
						data.push(item)
					}
				})
				total = data.length
			}

			setTimeout(() => {
				typeof success === 'function' &&
					success({
						data: data,
						total: total
					})
			}, 500)
		}
	}
}
</script>

<style>
/* #ifndef H5 */
page {
	padding-top: 85px;
}
/* #endif */
</style>