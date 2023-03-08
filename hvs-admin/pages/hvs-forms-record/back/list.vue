<template>
	<view class="container">
		<unicloud-db
			ref="udb"
			v-slot:default="{ data, pagination, loading, hasMore, error }"
			collection="hvs-forms-record"
			field="register_id,form_id,record"
			:where="where"
			:getcount="true"
			page-data="replace"
			:page-size="options.pageSize"
			:page-current="options.pageCurrent"
		>
			<view class="uni-header">
				<view class="uni-group"><view class="uni-title">历史数据</view></view>
				<view class="uni-group">
					<input class="uni-search" type="text" v-model="query" placeholder="请输入内容" />
					<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
					<button class="uni-button" type="default" size="mini" @click="reload">重置</button>
				</view>
			</view>
			<view v-if="error">{{ error.message }}</view>
			<view v-else-if="data">
				<uni-table :loading="loading" border stripe type="selection" emptyText="暂无更多数据">
					<uni-tr>
						<uni-th width="150" align="center">日期</uni-th>
						<uni-th width="150" align="center">姓名</uni-th>
						<uni-th width="150" align="center">用户编号</uni-th>
						<uni-th align="center">手机号</uni-th>
						<uni-th align="center">身份证号</uni-th>
						<uni-th align="center">性别</uni-th>
						<uni-th width="204" align="center">假期是否离校</uni-th>
						<uni-th width="204" align="center">14天内发热情况</uni-th>
						<uni-th width="224" align="center">14天确诊或疑似病例接触情况</uni-th>
						<uni-th width="204" align="center">健康状态</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in data" :key="index">
						<uni-td align="center">{{ item.record.create_date }}</uni-td>
						<uni-td align="center">
							<view class="name">{{ item.record.data.name }}</view>
						</uni-td>
						<uni-td align="center">{{ item.register_id }}</uni-td>
						<uni-td align="center">{{ item.record.data.phone_number }}</uni-td>
						<uni-td align="center">{{ item.record.data.license }}</uni-td>
						<uni-td align="center">{{ item.record.data.gender === '1' || item.record.data.gender === 1 ? '男' : '女' }}</uni-td>
						<uni-td align="center">{{ item.record.data.leave === '0' || item.record.data.leave === 0 ? '否' : item.record.data.destination }}</uni-td>
						<uni-td align="center">{{ item.record.data.abnormal | formatValue }}</uni-td>
						<uni-td align="center">{{ item.record.data.case_contact | formatValue }}</uni-td>
						<uni-td align="center">{{ item.record.status === 0 ? '健康' : '异常' }}</uni-td>
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
const dbOrderBy = 'register_id asce' // 排序字段
const dbSearchFields = ['register_id', 'record.create_date', 'record.status', 'record.data.destination',  'record.data.name',  'record.data.license',  'record.data.phone_number']
export default {
	data() {
		return {
			options: {
				pageSize: 20,
				pageCurrent: 1
			},
			where: "form_id=='CODE_FORM_002'",
			query: '',
			selectedIndexs: []
		}
	},
	filters: {
		formatValue: function(value) {
			if (value === '1') {
				return '是'
			}
			return '否'
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
			let newWhere = ''
			if(!this.getWhere()){
				newWhere = `form_id=='CODE_FORM_002'`
			}else{
				newWhere = `form_id=='CODE_FORM_002'&&(${this.getWhere()})`
			}
			console.log(newWhere);
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
		// 重置
		reload() {
			this.query = ''
			this.where = "form_id=='CODE_FORM_002'",
			this.loadData()
		}
	}
}
</script>

<style></style>
