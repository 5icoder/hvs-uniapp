<template>
	<view class="menu">
		<view class="menu-title" @click="dropDown">
			<text style="margin: 4rpx;">{{ title }}</text>
			<u-icon :name="flod ? 'arrow-up' : 'arrow-down'" size="16" color="#fff"></u-icon>
		</view>
		<view class="menu-item" v-show="flod">
			<view :class="[{ 'item-active': currentType === item.type }, 'item']" v-for="item in menuItems" :key="item.type" @click="clickItem(item)">{{ item.name }}</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'dropdown-menu',
	props: {
		menuItems: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data() {
		return {
			flod: false,
			title: '统计类别',
			currentType: 'person'
		}
	},
	methods: {
		dropDown() {
			this.flod = this.flod ? false : true
		},
		clickItem(item) {
			this.currentType = item.type
			this.title = item.name
			this.flod = false
			this.$emit('clickItem', item.type)
		}
	}
}
</script>

<style lang="scss">
.menu {
	z-index: 1;
	position: relative;
	width: 160rpx;
	.menu-title {
		height: 48rpx;
		padding: 0 12rpx;
		box-sizing: border-box;
		line-height: 48rpx;
		border-radius: 6rpx;
		color: #fff;
		background-color: #2979ff;
	}
	.menu-item {
		position: absolute;
		width: 160rpx;
		color: #2979ff;
		text-align: center;
		.item {
			width: 100%;
			padding: 8rpx;
			box-sizing: border-box;
			font-weight: 500;
		}
		.item-active {
			background-color: #e8e8e8;
		}
	}
}
</style>
