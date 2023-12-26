<template>

	<intellect :title="space.name" text='编辑空间' show="true" text2='删除空间' @leftBtn="leftBtn()" @rightBtn="rightBtn()">
		<view class="title">
			<input v-model="space.name" />
		</view>
		<view class=" content-box " v-for="(item,index) of device" :key="index">
			<view class="name">{{item.name}}</view>

			<view class="value">
				1台设备
			</view>

		</view>



		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="primary" cancelText="取消" confirmText="确定" title="提示" content="添加设备?"
				@confirm="dialogConfirm" @close="dialogClose">

				<uni-data-select v-model="checkDevice" :localdata="range"></uni-data-select>

			</uni-popup-dialog>
		</uni-popup>
		<view class="foot" @click="showAlert">
			<image src="../../../static/add.png"></image>
			<text>添加设备</text>
		</view>
	</intellect>
</template>

<script>
	export default {
		data() {
			return {

				space: {},
				data: [],
				query: {},
				checkDevice: "",
				range: [],
				allDevice: null,
				device: []
			};
		},

		onLoad(options) {
			this.query = options
			this.load()
		},
		methods: {
			async dialogConfirm() {
				// for (let i = 0; i < this.device.length; i++) {
				// 	if (this.device[i].location === this.space.name) {
				// 		uni.showToast({
				// 			icon: 'error',
				// 			title: "不能重复添加！"
				// 		})
				// 		return
				// 	}
				// }


				// const msg = await this.$request({
				// 	method: 'POST',
				// 	url: 'space/search',
				// 	data: {
				// 		filter: {
				// 			name: this.device.location
				// 		}
				// 	},
				// 	header: {
				// 		'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				// 	}

				// })



				const res = await this.$request({
					method: 'POST',
					url: 'device/update',
					data: {
						objectid: this.checkDevice,
						data: {
							location: this.space.name
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "修改成功！ "
					});
					let time = setInterval(() => {
						uni.navigateBack()
						clearInterval(time)
					}, 1000)

				}

			},
			dialogClose() {},
			showAlert() {
				this.$refs.alertDialog.open()
			},
			async load() {
				const res = await this.$request({
					method: 'POST',
					url: 'space/search',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) this.space = res.data.data
				this.data = this.space.list

				const device = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: {
						filter: {
							location: this.space.name
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (device.data.data) {
					this.device = device.data.data
				}

				this.loadDevice()
			},
			async loadDevice() {
				const res = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: {
						filter: {
							account_objectid: uni.getStorageSync('user').objectid
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) {
					this.allDevice = res.data.data

					this.allDevice.filter((item) => {
						this.range.push({
							value: item.objectid,
							text: item.name
						})
					})
				}

			},
			async leftBtn() {



				const res = await this.$request({
					method: 'POST',
					url: 'space/delete',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "删除成功！"
					});
					let time = setInterval(() => {
						uni.navigateBack()
						clearInterval(time)
					}, 1000)

				}

			},
			async rightBtn() {
				const res = await this.$request({
					method: 'POST',
					url: 'space/update',
					data: {
						objectid: this.query.objectid,
						data: this.space
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "修改成功！ "
					});
					let time = setInterval(() => {
						uni.navigateBack()
						clearInterval(time)
					}, 1000)

				}
			},


		}
	}
</script>

<style lang="scss" scoped>
	.title {
		color: rgba(102, 102, 102, 1);
		font-size: 16px;
		margin-top: 10px;
		line-height: 22px;
		margin-bottom: 22px
	}

	.content-box {
		display: flex;
		justify-content: space-between;
		align-items: center;

		margin-bottom: 22px;
		font-size: 16px;
		line-height: 22px;

		.name {
			color: rgba(51, 51, 51, 1);
			font-size: 16px;
			line-height: 22px;
		}

		.value {
			color: rgba(153, 153, 153, 1);
			font-size: 16px;
			line-height: 22px;
		}

	}

	.foot {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;

		image {
			width: 14px;
			height: 14px;
			margin-right: 5px;
		}

		text {
			color: rgba(0, 139, 137, 1);
			font-size: 16px;
			line-height: 22px;
		}
	}
</style>
