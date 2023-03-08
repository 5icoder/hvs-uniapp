<template>
	<view class="article">
		<view class="article-header">
			<view class="article-header__title">{{title}}</view>
			<view class="article-header__desc">
				<text class="article-header__desc-author">{{ author }}</text>
				<text class="article-header__desc-date">{{date | timeFrom}}</text>
			</view>
		</view>
		<view class="article-content">
			<u-parse :html="detail" @ready="noMore=true"></u-parse>
		</view>
		<view style="height: 30rpx;"></view>
		<u-divider height="30rpx" v-show="noMore">没有更多了</u-divider>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: '',
				title: '',
				author: '',
				date: '',
				noMore: false
			};
		},
		onLoad(option) {
			this.title = option.title
			this.author = option.author
			this.date = option.date
			this.getArticleDetail(option._id)
		},
		methods: {
			getArticleDetail(id) {
				this.$api.getArticleDetail({id}).then(res=>{
					this.detail = res.data.content
				})
			}
		},
	}
</script>

<style lang="scss">
.article{
		padding: 30rpx;
		box-sizing: border-box;
	.article-header__title{
		font-size: 36rpx;
	}
	.article-header__desc{
		&-author{
			margin-right: 20rpx;
			color: $u-type-primary-dark;
		}
		&-date{
			color: $u-tips-color;
		}
	}
	&-content{
		padding: 40rpx;		
		padding-bottom: 0;
	}
}
</style>
