<template>

	<intellect title="湿度" text='提交' @rightBtn="rightBtn()">
		<view class="content-box">
			<uni-data-checkbox selectedColor="rgb(0,139,137)" v-model="checkUp" @change="change(1)" :localdata="up">
			</uni-data-checkbox>
			<view class="temp" v-if="checkUp">
				<text class="title">温度</text>



				<picker :range="array" :value="humidity" @change="bindHumidityChange">
					<view class="box">
						<text>{{humidity}}%</text>
						<image src="../../static/right.png"></image>
					</view>
				</picker>



			</view>
			<view class="downCheck"> </view>
			<uni-data-checkbox selectedColor="rgb(0,139,137)" v-model="checkDown" @change="change(0)" :localdata="down">
			</uni-data-checkbox>
			<view class="temp" v-if="checkDown">
				<text class="title">温度</text>
				<picker :range="array" :value="0" @change="bindHumidityChange">
					<view class="box">
						<text>{{humidity}}%</text>
						<image src="../../static/right.png"></image>
					</view>
				</picker>
			</view>
		</view>

	</intellect>


</template>

<script>
	export default {
		data() {
			return {
				array: [],
				humidity: '41',
				checkUp: 1,
				checkDown: 0,
				up: [{
					text: '升高到',
					value: 1
				}],
				down: [{
					text: '降低到',
					value: 1
				}],
				list: [{
					name: '温度',
					src: ''
				}, {
					name: '湿度',
					src: ''
				}, {
					name: 'PM2.5',
					src: ''
				}],

			};
		},

		mounted() {
			for (let i = 20; i <= 70; i++)
				this.array.push(i)

		},
		methods: {
			bindHumidityChange(e) {

				this.humidity = this.array[e.detail.value]
			},
			rightBtn() {
				let msg = uni.getStorageSync('parameter')
				uni.setStorageSync('parameter', {
					...msg,
					humidity: this.humidity
				})
				uni.navigateBack()
			},
			change(e) {
				if (e) {
					this.checkUp = 1;
					this.checkDown = 0
				} else {
					this.checkUp = 0;
					this.checkDown = 1
				}
			},
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},

		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		flex-direction: column;

		/deep/ .checklist-text {
			font-size: 16px !important;
		}

		.temp {
			display: flex;
			justify-content: space-between;
			background-color: rgba(249, 249, 249, 1);
			border-radius: 5px;

			margin-top: 14px;
			padding: 14px 10px 14px 10px;

			.title {}

			.box {
				display: flex;
				align-items: center;


				text {
					margin-right: 10px;
					color: rgba(51, 51, 51, 1);
					font-size: 14px;

					line-height: 20px;

				}

				image {
					width: 8px;
					height: 14px;
					margin: 4px 0 4px 0;
				}
			}
		}


		.downCheck {
			margin-top: 14px;
		}
	}
</style>
