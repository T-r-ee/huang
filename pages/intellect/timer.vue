<template>

	<intellect title="创建场景" text='提交' show="true" @rightBtn="rightBtn()">
		<view class="content-box">
			<text class="title">指定时间</text>
			<picker mode="time" :value="time" @change="bindTimeChange">
				<view class="picker">
					{{time}}
					<image class="icon" src="../../static/right.png"></image>
				</view>
			</picker>
		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				time: '12:01'

			};
		},

		mounted() {


		},
		methods: {
			rightBtn() {
				let msg = uni.getStorageSync("trigger_condition")

				uni.setStorageSync("trigger_condition", {
					...msg,
					time: {
						label: "每天",
						value: this.time + "时"
					}
				})
				uni.redirectTo({
						url: '/pages/intellect/scene?time=ok'
					}

				)
			},
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},
			change(e) {
				this.tag = e.currentIndex
				switch (this.tag) {
					case 0:
						//this.setOption()
						break;
					case 1:

						break;
					case 2:
						//this.setOption()
						break;
					default:
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		justify-content: space-between;

		.title {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);
			line-height: 20px;
			font-size: 14px;
			margin-bottom: 20px
		}

		.picker {
			display: flex;
			align-items: center;

			.icon {
				width: 8px;
				height: 14px;
				margin-left: 10px;
			}



		}

	}
</style>
