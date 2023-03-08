<template>
	<view>
		<flow-card :title="item.title" :flow="item.flow" v-for="item in cardList" :key="item.title"></flow-card>
			</view>
</template>

<script>
import checkLogin from '@/common/check.js'
export default {
	data() {
		return {
			cardList: [
				{
					title: '图书馆',
					flow: {
						remind: 1401,
						occupy: 2099
					}
				},
				{
					title: '食堂',
					flow: {
						remind: 514,
						occupy: 1199
					}
				},
				{
					title: '浴室(女)',
					flow: {
						remind: 1,
						occupy: 159
					}
				},
				{
					title: '浴室(男)',
					flow: {
						remind: 23,
						occupy: 61
					}
				}
			]
		}
	},
	onReady() {
		checkLogin(this.vuex_user)
	}
}
</script>

<style lang="scss"></style>
