<template>
	<view class="main">
		<view class="head" :style="{'padding-top':position.top+'px'}">
			<view class="location" :style="{'height':position.height+'px'}">
				<view class="left" @click="back()">
					<image referrerpolicy="no-referrer" src="../../static/leftp.png"></image>
				</view>

				<text>{{device.name}}设置</text>

			</view>
			<view class="setting" v-if="device.model!=='8'">
				<view class="setting-item margin">
					<text>定时设置</text>
					<image class="right" src="../../static/right.png"></image>
				</view>
				<view class="setting-item">
					<text>童锁设置</text>
					<switch color="rgb(0,139,137)" @change="lockChange( )" :checked="locked" />
				</view>
			</view>

			<view class="setting" v-if="device.model==='xfxt'">
				<view class="setting-item margin">
					<text>控制CO2</text>
				</view>

				<view class="setting-item">

					<text class="num">0 ppm</text>

					<slider class="progress" activeColor="#008C8B" block-color="#008C8B" v-model="setHumility"
						style="flex: 1;" min="0" max="100" step="1" block-size="20" @changing="sliderChange" />

					<!-- <bestjhh-movable-area icon="ppm" class="progress" max='100' min='0' @change='change'>
					</bestjhh-movable-area> -->
					<text class="num" style=" text-align: right">5000 ppm</text>
				</view>
			</view>


			<view class="setting">
				<view class="setting-item margin">
					<text>屏幕亮度</text>
				</view>

				<view class="setting-item">

					<text class="num">0%</text>
					<slider activeColor="#008C8B" block-color="#008C8B" v-model="setHumility" style="flex: 1;" min="0"
						max="100" step="1" block-size="20" @changing="sliderChange" />
					<text class="num" style=" text-align: right">100%</text>
				</view>
			</view>


			<view class=" setting" v-if="device.model==='xfxt'">
				<view class="setting-item margin">
					<text>定时设置</text>
					<image class="right" src="../../static/right.png"></image>
				</view>
				<view class="setting-item">
					<text>童锁设置</text>
					<switch color="rgb(0,139,137)" checked />
				</view>
			</view>


			<view class="setting">
				<view class="setting-item margin">
					<text>系统模式</text>
				</view>
				<view class="setting-item">
					<button @click="typenChange(index)" v-for="(item,index) of type" :key="index"
						:class="[item.check?'button':'']">{{item.name}}</button>
				</view>
			</view>


			<view class="menu" v-if="device.model!=='xfxt'">
				<view class="col" v-if="device.model==='fs'"><text>开启</text><text class="value">顶棚水阀</text></view>
				<view class="col" v-else><text>开启</text><text class="value">风盘水阀</text></view>
				<view class="col"><text>关闭</text><text class="value">地面水阀</text></view>
			</view>


			<view class="setting">
				<view class="setting-item  margin" v-if="device.model==='xfxt'">
					<text>过滤网寿命</text>
					<text class="value">10年</text>
				</view>
				<view class="setting-item">
					<text>固件版本</text>
					<text class="value">固件版本</text>
				</view>
			</view>


		</view>





	</view>

</template>

<script>
	export default {
		data() {
			return {
				locked: 1,
				pgList: [0, 0, 0, 0],
				option: {},
				type: [{
					name: '制冷',
					check: true
				}, {

					name: '制热',
					check: false
				}, {
					name: '通风',
					check: false
				}, {
					name: '自动',
					check: false
				}],
				pattern: [{
					src: 'refresh.png',
					name: '调节模式'
				}, {
					src: 'wind.png',
					name: '风量'
				}, {
					src: 'humidity.png',
					name: '湿度'
				}],
				acc: 0,
				options1: [{
					text: '删除',
					style: {
						backgroundColor: 'rgba(224, 32, 32, 1)'
					}
				}],
				device: {},

				status: [],
				query: {},
				position: {
					top: '',
					height: '',
					right: ''
				},
				setHumility: 0
			};
		},


		onLoad(options) {
			this.query = options
			this.load()
		},
		methods: {
			sliderChange(e) {
				this.setHumility = e.detail.value
				console.log(e)
			},
			lockChange() {
				this.locked = !this.locked
				this.sendComand({
					sn: this.device.sn,
					canid: this.device.canid,
					point: "4",
					value: this.locked ? 1 : 0
				})
			},
			back() {
				uni.navigateBack()
			},
			async sendComand(e) {
				const res = await this.$request({
					method: 'POST',
					url: 'cmd/send',
					data: e,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				uni.showToast({
					title: res.data.msg
				})
			},
			typenChange(e) {
				this.type.filter(item => {
					item.check = false
				})
				this.type[e].check = true
			},
			canvasIdErrorCallback: function(e) {
				console.error(e.detail.errMsg)
			},
			getImageUrl(mes) {

				return '../../static/' + mes;
			},
			async load() {

				let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
				if (menuButtonInfo) {
					this.position.top = menuButtonInfo.top
					this.position.height = menuButtonInfo.height
					this.position.right = menuButtonInfo.width
				}

				const res = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				this.device = res.data.data

			},
			bindClick(num) {
				if (!num.objectid) return


				uni.request({
					url: `https://iot.tillan.cn/tingxin/api/device/delete?objectid=${num.objectid}`,
					method: 'DELETE',
					// data: {
					// 	objectid: num.objectid
					// },
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					},
					success: (res) => {
						uni.showToast({
							title: '删除成功...'
						});
						getApp().globalData.iteml = this.data
						uni.setStorageSync('item', this.data)
						let time = setInterval(() => {
							uni.redirectTo({
								url: '/pages/main/home/index'

							});
							clearInterval(time)
						}, 700)

					},
					fail: (err) => {}
				});

			},
			goto(mess) {
				uni.navigateTo({
					url: "/pages/main/" + mess,
				});
			},
			gotoDetail(detail) {
				getApp().globalData.iteml = detail
				uni.setStorageSync('item', detail)
				console.log(uni.getStorageSync('item'))
				uni.navigateTo({
					url: "/pages/main/device/device",
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: rgb(249, 249, 249);
	}

	.main {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		//padding: 0 20px 85px;
		background: url("../../static/homeBack.png") 100% no-repeat;
		background-size: 100% 100%;
		position: relative;

		.head {
			padding: 0 10px 10px;

			.location {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 17px;

				color: rgba(51, 51, 51, 1);
				font-size: 18px;

				font-weight: 600;

				line-height: 25px;

				//margin: 17px 0px;
				.left {
					padding: 0 10px;
					margin-left: -10px;

					image {
						width: 8px;
						height: 14px;
					}

				}

				text {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
				}
			}

			.setting {


				border-radius: 5px;
				padding: 14px 10px 15px 10px;
				background: white;
				margin-bottom: 10px;
				box-sizing: border-box;

				.margin {
					margin-bottom: 25px;
				}

				.setting-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;

					/deep/ uni-slider .uni-slider-handle-wrapper {
						height: 7px !important;
					}

					/deep/ uni-slider .uni-slider-thumb {
						// position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					/deep/ uni-slider .uni-slider-thumb::before {
						content: '';
						position: absolute;
						width: 10px;
						height: 10px;
						border-radius: 50%;
						background: white;
					}

					/deep/ wx-slider .wx-slider-thumb {
						// position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					/deep/ wx-slider .wx-slider-thumb::before {
						content: '';
						position: absolute;
						width: 10px;
						height: 10px;
						border-radius: 50%;
						background: white;
					}

					/deep/ wx-slider .wx-slider-handle-wrapper {
						height: 7px !important;
					}

					.button {
						background: rgb(0, 139, 137);
						color: white;
					}

					.value {
						color: rgba(153, 153, 153, 1);
						font-size: 14px;
						line-height: 20px;
					}

					.num {
						color: rgba(153, 153, 153, 1);
						font-size: 12px;
						line-height: 17px;
					}


					.progress {
						// margin: 0 20px;
						flex: 1;
					}

					button {
						background-color: rgba(210, 233, 232, 1);
						border-radius: 16px;
						padding-top: 6px;
						padding-bottom: 6px;
						font-size: 14px;
						color: rgba(0, 139, 137, 1);
						line-height: 20px;
					}

					button::after {
						border: none;
					}

					.right {
						width: 8px;
						height: 14px;
					}


					/deep/ uni-switch {
						display: flex;
					}

					/deep/ .uni-switch-input {
						width: 40px;
						height: 20px;
						margin-right: 0px;
					}

					/deep/.uni-switch-input:before {
						height: 0px;
					}

					/deep/.uni-switch-input:after {
						width: 18px;
						height: 18px;
					}

					/deep/ wx-switch {
						display: flex;
					}

					/deep/ .wx-switch-input {
						width: 40px;
						height: 20px;
						margin-right: 0px;
					}

					/deep/.wx-switch-input:before {
						height: 0px;
					}

					/deep/.wx-switch-input:after {
						width: 18px;
						height: 18px;
					}


				}
			}


			.menu {

				border-radius: 5px;
				padding: 14px 10px 15px 10px;
				background: white;
				margin-bottom: 10px;
				display: flex;

				.col {
					width: 50%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.value {

						color: rgba(153, 153, 153, 1);
						line-height: 17px;
						margin-top: 15px;
					}
				}

			}
		}


	}
</style>
