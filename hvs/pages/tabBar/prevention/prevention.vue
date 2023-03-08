<template>
	<view>
		<u-swiper :height="360" effect3d :list="sliderList"></u-swiper>
		<u-card :title="item._id" :sub-title="item.list[0].create_date | timeFrom" v-for="item in articleList" :key='item._id'>
			<view class="" slot="body">
				<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0" @click="navToAarticle(list)" v-for="list in item.list" :key='list._id'>
					<view class="u-body-item-title u-line-2">{{list.title}}</view>
					<image :src="list.cover"></image>
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
import checkLogin from '@/common/check.js'
export default {
	data() {
		return {
			sliderList: [
				'//vkceyugu.cdn.bspapp.com/VKCEYUGU-a0ff070e-a200-4659-9bd1-b211b31246e1/a64d247a-55cf-442b-8646-48ec4f761f22.jpeg',
				'//vkceyugu.cdn.bspapp.com/VKCEYUGU-a0ff070e-a200-4659-9bd1-b211b31246e1/7b20cef5-9346-404a-801a-6efb00407962.jpeg',
				'//vkceyugu.cdn.bspapp.com/VKCEYUGU-a0ff070e-a200-4659-9bd1-b211b31246e1/351a062b-5184-4914-914a-fd44cab806f4.jpeg'
			],
			articleList: []
		}
	},
	onReady() {
		checkLogin(this.vuex_user)
	},
	onLoad() {
		this.getArticleList()
	},
	methods: {
		navToAarticle(list) {
			uni.navigateTo({
				url: `/pages/article-detail/article-detail?_id=${list._id}&title=${list.title}&author=${list.author}&date=${list.create_date}`
			})
		},
		getArticleList(){
			this.$api.getArticleList().then(res=>{
				this.articleList = res.data
			})
		}
	}
}
</script>

<style scoped lang="scss">
.u-card-wrap {
	background-color: $u-bg-color;
	padding: 1px;
}

.u-body-item {
	justify-content: space-between;
	font-size: 32rpx;
	color: #333;
	padding: 20rpx 10rpx;
}

.u-body-item-title {
	font-size: 28rpx;
}

.u-body-item image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	margin-left: 16rpx;
}
</style>
