<template>
	<view class="flow-card" :style="{color: cardColor}">
		<view class="title">{{ title }}</view>
		<u-line :color="cardColor" :hair-line="false" margin="30rpx 0 20rpx" />
		<view class="content">
			<view class="flow-count">
				<text class="number">{{ flow.occupy }}</text>
				<br />
				当前人数
			</view>
			<view class="flow-count">
				<text class="number">{{ flow.occupy + flow.remind }}</text>
				<br />
				可同时容纳
			</view>
			<view class="flow-count">
				<view class="charts-box"><qiun-data-charts type="ring" :chartData="chartData" :opts="chartOpts" background="none" :animation="false" /></view>
				占有比例
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'flow-card',
	props: ['title', 'flow', 'dobj'],
	data() {
		return {
			chartOpts: {
				color: ['#2b85e4', '#e8e8e8'],
				title: {
					name: ''
				},
				subtitle: {
					name: '',
					fontSize: 16,
					color: '#2b85e4'
				},
				dataLabel: false,
				legend: {
					show: false
				},
				extra: {
					ring: {
						ringWidth: 10,
						activeRadius: 0,
						border: false,
						offsetAngle: -90
					},
					tooltip: {
						showBox: false
					}
				}
			},
			cardColor: "#2b85e4"
		}
	},
	computed: {
		chartData() {
			let dataObj = {
				series: [
					{
						data: [
							{
								name: '当前人数',
								value: this.flow.occupy
							},
							{
								name: '剩余容纳',
								value: this.flow.remind
							}
						]
					}
				]
			}
			return dataObj
		}
	},
	mounted() {
		this.getThemeColor()
	},
	methods: {
		getThemeColor() {
			const percent = this.flow.occupy / (this.flow.occupy + this.flow.remind)
			let themeColor = '#909399'
			if(percent>0.8&&percent<=1){
				themeColor = '#f52415'
			}else if(percent>=0.6&&percent<=0.8){
				themeColor = '#f59403'
			}else{
				themeColor = '#2b85e4'
			}
			this.cardColor = themeColor
			this.chartOpts.subtitle.name = `${(percent * 100).toFixed(2) + '%'}`
			this.chartOpts.color[0] = this.chartOpts.subtitle.color = themeColor
		}
	},
}
</script>

<style lang="scss">
.flow-card {
	width: 100%;
	height: 400rpx;
	padding: 30rpx;
	border-bottom: 20rpx #e8e8e8 solid;
	box-sizing: border-box;
	.title {
		font-size: 32rpx;
		font-weight: 600;
	}
	.charts-box {
		width: 200rpx;
		height: 200rpx;
	}
	.content {
		height: 240rpx;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		.flow-count {
			text-align: center;
			.number {
				font-weight: 600;
				line-height: 200rpx;
			}
		}
	}
}
</style>
