<template>

	<intellect title="编辑" @rightBtn="rightBtn()" text='保存空间' locate='left'>
		<view class="title">房间编辑</view>
		<view class="content-box" v-for="(item,index) of data" :key="index">
			<text class="name">{{item.name}}</text>

			<view class="value">
				<!-- {{item.value}} -->
				<input v-model="item.value">
				<image class="icon" src="../../static/right.png"></image>
			</view>

		</view>

		<view class="back"></view>

		<view class="control">
			<view class="line"></view>
			<text>模块编辑</text>
			<view class="content-box">
				<text class="name">批量控制</text>

				<view class="value">
					<image class="icon" src="../../static/right.png"></image>
				</view>

			</view>

		</view>
	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				data: [{
						name: '房间名称',
						value: '阳台'
					},
					{
						name: '房间壁纸',
						value: ''
					},

				],
				id: ''
			};
		},


		onLoad(options) {
			this.id = options.space
			this.load()
		},

		mounted() {


		},
		methods: {
			async rightBtn() {

				const res = await this.$request({
					method: 'POST',
					url: 'space/update',
					data: {
						objectid: this.id,
						data: {
							name: this.data[0].value
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) {
					uni.showToast({
						title: "保存成功!"
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)

				}



			},
			async load() {
				if (this.id) {
					const res = await this.$request({
						method: 'POST',
						url: 'space/search',
						data: {
							objectid: this.id
						},
						header: {
							'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						}

					})
					if (res.data.data) {
						this.data[0].value = res.data.data.name
					}
				} else {
					this.data[0].value = "全部"
				}
			},
			async edit() {
				const res = await this.$request({
					method: 'POST',
					url: 'device/update',
					data: {
						objectid: this.id,
						data: {
							name: status
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
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
	.title {
		overflow-wrap: break-word;
		color: rgba(51, 51, 51, 1);
		margin-bottom: 20px;
		font-size: 21px;
		line-height: 29px;
	}

	.content-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;
		font-size: 16px;
		line-height: 22px;
		margin-bottom: 20px;

		.name {
			display: flex;
			align-items: center;
			color: rgba(51, 51, 51, 1);



		}

		.value {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);

			input {
				text-align: right;
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

	.back {
		background-color: rgba(237, 243, 254, 1);
		border-radius: 5px;
		height: 82px;
		margin-top: 16px;
		// padding-bottom: 40px;

	}

	.control {


		.line {
			margin: 20px 0px;
			width: 100%;
			height: 1px;
			background: rgb(221, 221, 221)
		}

		text {
			color: rgba(153, 153, 153, 1);
		}
	}
</style>
