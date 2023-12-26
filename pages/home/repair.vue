<template>
	<view class="main">
		<view class="head" :style="{'padding-top':position.top+'px'}">
			<view class="head-title" :style="{'height':position.height+'px'}">
				<view class="back" @click="back()">

					<image src="../../static/leftp.png"></image>

				</view>

				报修
			</view>
		</view>

		<view class="select">
			<view class="box">
				<view>
					<uni-data-select :clear='false' v-model="data.location" placeholder="空间" :localdata="range1"
						@change="change">
					</uni-data-select>
				</view>
			</view>

			<view class="box">
				<view>
					<uni-data-select :clear='false' v-model="data.name" placeholder="设备" :localdata="range2"
						@change="change">
					</uni-data-select>
				</view>
			</view>

		</view>

		<view class="content">
			<view class="content-box">
				<text class="text">问题描述（必填）</text>
				<textarea v-model="data.problem_desc"></textarea>
			</view>
			<view class="content-box">
				<text class="text">上传图片（非必填）</text>

				<uni-file-picker class="upload" limit="3" :del-icon="true" disable-preview :auto-upload="false"
					:value="fileLists" @select="handleSelect" @delete="handleDelete" file-mediatype="image">
				</uni-file-picker>
			</view>
		</view>

		<view class="foot">
			<button @click="add()">提交</button>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				data: {
					device_id: "",
					model: "inspect",
					phone: "",
					problem_desc: "",
					dealer_objectid: "", //经销商id
					project_objectid: "",
					creator_objectid: ""
				},
				range1: [],
				range2: [],
				fileLists: [],
				device: {},
				query: {},
				position: {
					top: '30',
					right: "0",
					height: ''
				},
				tempFilePaths: [],
				user: {}
			};
		},

		onLoad(options) {

			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}
			this.query = options
			this.user = uni.getStorageSync('user')
			this.load()
		},

		methods: {
			async load() {

				// const spaceRes = await this.$request({
				// 	method: 'POST',
				// 	url: 'space/search',

				// 	header: {
				// 		'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				// 	}

				// })
				// if (spaceRes.data.code === 200) {
				// 	const data = spaceRes.data.data
				// 	data.filter((item) => {
				// 		this.range1.push({
				// 			value: item.name,
				// 			text: item.name
				// 		})
				// 	})

				// }





				const res = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				this.device = res.data.data
				this.data.name = this.device.name
				this.data.location = this.device.location
				this.data.device_id = this.device.objectid
				this.data.dealer_objectid = this.device.dealer_objectid
				this.data.project_objectid = this.device.project_objectid
				this.data.creator_objectid = this.user.objectid
				this.data.phone = this.user.phone
				this.device.location ? this.range1.push({
					text: this.device.location,
					value: this.device.location
				}) : ''
				this.device.name ? this.range2.push({
					text: this.device.name,
					value: this.device.name
				}) : ''

			},
			back() {
				uni.navigateBack()
			},

			bindTimeChange(e) {
				this.time = e.detail.value
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},
			change(e) {

			},
			handleSelect(e) {
				e.tempFilePaths.filter((item) => {
					this.tempFilePaths.push(item)
				})
			},
			handleDelete(e) {
				this.tempFilePaths.filter((item, index) => {
					if (item === e.tempFilePath) {
						this.tempFilePaths.splice(index, 1)
					}
				})
			},
			async add() {

				if (!this.data.problem_desc) {
					uni.showToast({
						icon: "error",
						title: "请输入!"
					})
					return
				}


				const res = await this.$request({
					method: 'POST',
					url: 'workorder/create',
					data: this.data,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) {

					let orderid = res.data.data

					this.tempFilePaths.filter((item) => {

						uni.uploadFile({
							url: 'https://iot.tillan.cn/v2/api/workorder/up/img?id=' +
								orderid, //上传图片的后端接口
							filePath: item,
							header: {
								'Authorization': 'Bearer ' + uni.getStorageSync('token')
							},
							name: 'file',
							success: res => {}
						})

					})

					uni.showToast({
						title: "创建成功！"
					})
					let time = setTimeout(() => {
						uni.navigateBack()
					}, 1500)

				}


				// const res = await this.$request({
				// 	method: 'POST',
				// 	url: 'msg/center/create',
				// 	data: this.data,

				// 	header: {
				// 		'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				// 	}
				// })
				// if (res.data.code === 200) {
				// 	uni.showToast({
				// 		title: "创建成功"
				// 	});
				// 	let time = setInterval((item) => {
				// 		uni.navigateBack()
				// 		clearInterval(time)
				// 	}, 1000) 
				// }

			},
			goto(mess) {
				uni.navigateTo({
					url: '/pages/mine/' + mess
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		background: url("../../static/homeBack.png") 100% no-repeat;
		background-size: 100% 100%;
		position: relative;

		.head {
			padding: 0 10px 0px;
			font-size: 16px;


			.head-title {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 17px;
				color: rgba(51, 51, 51, 1);
				font-size: 18px;
				font-weight: 600;
				line-height: 25px;

				.back {
					image {
						width: 8px;
						height: 14px;
					}

					position: absolute;
					left: 0px;
					padding: 0 10px;
				}
			}

		}

		.select {
			// background-color: white;
			display: flex;

			justify-content: center;

			.box {
				width: 50%;

				display: flex;
				justify-content: center;
				font-size: 16px;

				/deep/ .uni-select__input-placeholder {
					font-size: 16px;
					color: rgba(51, 51, 51, 1);
				}

				/deep/ .uni-select {
					border: none;
					padding: 0 15px;
				}

				/deep/ .uni-select__input-box {
					font-size: 16px;
				}

				/deep/ .uni-select__input-text {
					margin-right: 10px
				}
			}


		}

		.content {
			height: 100%;
			//background: white;
			// background-color: white;
			overflow: scroll;

			box-sizing: border-box;
			padding: 0px 14px 8px 14px;

			.content-box {
				display: flex;
				flex-direction: column;

				.upload {
					margin-top: 10px;

					/deep/ .file-picker__box {
						height: 94px !important;
						width: 94px !important;
						padding: 0px !important;

					}

					/deep/ .icon-add {
						width: 30px;
						height: 4px;
					}

					/deep/ .file-picker__box-content {
						border: none !important;
						background: white;

					}
				}



				.text {
					color: rgba(102, 102, 102, 1);
					font-size: 16px;
					line-height: 22px;
					margin-top: 11px;
				}

				textarea {
					background: white;
					border-radius: 6px;
					margin-top: 11px;
					width: 100%;
					padding: 12px;
					box-sizing: border-box;
				}
			}


		}

		.foot {
			position: fixed;
			bottom: 10px;
			right: 10px;
			display: flex;
			align-items: center;



			button {
				background-color: rgba(0, 139, 137, 1);
				border-radius: 22px;
				padding: 11px 0;
				width: 110px;
				color: rgba(255, 255, 255, 1);
				font-size: 16px;
				line-height: 22px;
			}
		}

	}
</style>
