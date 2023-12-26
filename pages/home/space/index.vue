<template>

	<intellect title="空间管理" text='添加空间' @rightBtn="rightBtn()">


		<!-- 	<uni-swipe-action v-for="(item,index) of data">
			<uni-swipe-action-item style="width: 100%;" :right-options="options1" :auto-close="false"
				@click="deleteClick(item)">

				<view style=" height: 100%;" class="content-box  content-margin"
					@click="goto( 'home/space/detail?objectid='+item.objectid)">
					<view class=" title">{{item.name}}</view>

					<view class="box">
						{{item.value?item.value:0}}台设备
						<image class="icon" src="../../../static/right.png"></image>
					</view>

				</view>
			</uni-swipe-action-item>
		</uni-swipe-action> -->
		<view class="content-box  content-margin">
			<view class="title">全屋</view>

			<view class="box">
				{{allNum}}台设备
				<image class="icon" src="../../../static/right.png"></image>
			</view>

		</view>


		<view class="content-box  content-margin" v-for="(item,index) of device" :key="index"
			@click="goto( 'home/space/detail?objectid='+item.objectid)">
			<view class="title">{{item.name}}</view>

			<view class="box">
				{{item.num||0}}台设备
				<image class="icon" src="../../../static/right.png"></image>
			</view>

		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				space: [],
				show: false,
				allNum: 0,
				data: [],
				device: []
			};
		},

		mounted() {

			// this.load()
		},
		onShow() {
			this.load()
		},
		methods: {
			async deleteClick(e) {
				const res = await this.$request({
					method: 'POST',
					url: 'space/delete',
					data: {
						objectid: e.objectid
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "删除成功！"
					});
					this.load()
				}
			},
			async load() {
				const allDevice = await this.$request({
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
				if (allDevice.data.data) this.allNum = allDevice.data.all



				const res = await this.$request({
					method: 'POST',
					url: 'space/search',
					data: {
						filter: {
							account_objectid: uni.getStorageSync('user').objectid
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					this.data = res.data.data
					this.data.filter(async (item, index) => {

							const msg = await this.$request({
								method: 'POST',
								url: 'device/search',
								data: {
									filter: {
										account_objectid: uni.getStorageSync('user').objectid,
										location: item.name
									}
								},
								header: {
									'Authorization': `Bearer ${uni.getStorageSync('token')}`,
								}

							})

							if (msg.data.all) {
								this.data[index].num = msg.data.all

							} else {
								this.data[index].num = 0
							}
							if (index === this.data.length - 1) {
								this.device = this.data
							}
						}

					)

				}

			},
			async searchDevice(name, index) {

				return (await this.$request({
					method: 'POST',
					url: 'device/search',
					data: {
						filter: {
							account_objectid: uni.getStorageSync('user').objectid,
							location: name
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				}))



			},
			goto(e) {
				uni.navigateTo({
					url: '/pages/' + e
				})
			},
			rightBtn() {
				uni.navigateTo({
					url: '/pages/home/space/add'
				})
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
		justify-content: space-between;
		align-items: center;
		// margin-top: 10px;
		font-size: 16px;
		// line-height: 33px;



		.title {
			display: flex;
			align-items: center;
			color: rgba(51, 51, 51, 1);



		}

		.box {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);

			/deep/ .file-picker__box {
				height: 54px !important;
				width: 54px !important;
				padding: 0px !important;

			}

			/deep/ .file-picker__box-content {

				border-radius: 50% !important;
				border: none !important;
				//margin: 0px;
			}


			.photo {
				width: 44px;
				height: 44px;
			}

			.icon {
				width: 8px;
				height: 14px;
				margin-left: 10px;
			}



		}

	}

	.content-margin {
		box-sizing: border-box;
		padding: 10px 0px;
	}
</style>
