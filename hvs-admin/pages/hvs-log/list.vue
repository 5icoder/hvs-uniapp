<template>
	<view class="container">
		<unicloud-db
			ref="udb"
			collection="hvs-log"
			:options="options"
			:where="where"
			field="create_date,type,desc,register_id,pricipal"
			page-data="replace"
			v-slot:default="{ data, pagination, loading, error }"
			:orderby="orderby"
			:getcount="true"
			:page-size="options.pageSize"
			:page-current="options.pageCurrent"
		>
			<view class="uni-header">
				<view class="uni-group"><view class="uni-title">异常日志</view></view>
				<view class="uni-group">
					<input class="uni-search" type="text" v-model="query" placeholder="请输入搜索内容" />
					<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
					<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
					<button class="uni-button" type="default" size="mini" @click="delTable">批量删除</button>
				</view>
			</view>
			<view v-if="error">{{ error.message }}</view>
			<view v-else-if="data">
				<uni-table :loading="loading" border stripe type="selection" emptyText="暂无更多数据" @selection-change="selectionChange">
					<uni-tr>
						<uni-th width="150" align="center">日期</uni-th>
						<uni-th width="150" align="center">类型</uni-th>
						<uni-th align="center">用户编号</uni-th>
						<uni-th align="center">描述</uni-th>
						<uni-th align="center">责任人编号</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in data" :key="index">
						<uni-td align="center">{{ item.create_date }}</uni-td>
						<uni-td align="center">
							<view class="name">{{ item.type | formatVal }}</view>
						</uni-td>
						<uni-td align="center">{{ item.register_id }}</uni-td>
						<uni-td align="center">{{ item.create_date + ' ' + item.desc }}</uni-td>
						<uni-td align="center">{{ item.pricipal }}</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
				</view>
			</view>
		</unicloud-db>
	</view>
</template>

<script>
// 表查询配置
const dbOrderBy = 'create_date desc' // 排序字段
const dbSearchFields = ['create_date', 'type', 'desc', 'register_id', 'pricipal']
// 分页配置
const pageSize = 20
const pageCurrent = 1
export default {
	data() {
		return {
			query: '',
			where: '',
			orderby: dbOrderBy,
			options: {
				pageSize,
				pageCurrent
			},
			selectedIndexs: []
		}
	},
	filters: {
		formatVal: function(value) {
			if (value === 0) {
				return '体温异常'
			} else if (value === 1) {
				return '高风险地区返校'
			} else if (value === 2) {
				return '接触感染者'
			}
		}
	},
	onPullDownRefresh() {
		this.$refs.udb.loadData(
			{
				clear: true
			},
			() => {
				uni.stopPullDownRefresh()
			}
		)
	},
	methods: {
		getWhere() {
			const query = this.query.trim()
			if (!query) {
				return ''
			}
			const queryRe = new RegExp(query, 'i')
			return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
		},
		search(e) {
			const newWhere = this.getWhere()
			const isSameWhere = newWhere === this.where
			this.where = newWhere
			if (isSameWhere) {
				// 相同条件时，手动强制刷新
				this.loadData()
			}
		},
		loadData(clear = true) {
			this.$refs.udb.loadData({
				clear
			})
		},
		onPageChanged(e) {
			this.$refs.udb.loadData({
				current: e.current
			})
		},
		navigateTo(url, clear) {
			// clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
			uni.navigateTo({
				url,
				events: {
					refreshData: () => {
						this.loadData(clear)
					}
				}
			})
		},
		// 多选处理
		selectedItems() {
			var dataList = this.$refs.udb.dataList
			return this.selectedIndexs.map(i => dataList[i]._id)
		},
		//批量删除
		delTable() {
			const ids = this.selectedItems()
			this.$refs.udb.remove(ids)
		},
		// 多选
		selectionChange(e) {
			this.selectedIndexs = e.detail.index
		},
		confirmDelete(item) {
			const currentUserId = this.userInfo._id
			if (currentUserId === item._id) {
				uni.showToast({
					icon: 'none',
					title: '不允许 admin 账号删除自己',
					duration: 1500
				})
				return
			}
			this.$refs.udb.remove(item._id)
		}
	}
}
</script>

<style></style>
