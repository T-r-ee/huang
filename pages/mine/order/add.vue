<template>

	<intellect title="发起工单" :hide='true'>



		<view class="content-box">
			<text class="name">设备名称</text>
			<view class="value">

				<uni-data-select @change="changeName" :clear="false" :localdata="range">
				</uni-data-select>

				<!-- 	{{device.sn}} -->
			</view>
		</view>



		<view class="content-box" style="padding-bottom: 7px; border-bottom:1px solid rgb(221,221,221);">
			<text class="name">工单分类</text>
			<view class="value">
				<uni-data-checkbox selectedColor="rgb(0,139,137)" v-model="active" @change="change" :localdata="tag">
				</uni-data-checkbox>
			</view>
		</view>

		<view class="form">
			<view class="form-box">
				<text class="title">联系方式</text>

				<input class="input" style="flex:1;" v-model="order.phone" placeholder="请输入联系方式" />
			</view>
			<!-- <view class="form-box">
				<text class="title">预约时间</text>
				<uni-datetime-picker placeholder="请选择预约时间" type="datetime" v-model="datetimesingle"
					@change="changeLog" />

			</view> -->
			<view class="form-box">
				<text class="title">问题描述（必填）</text>
				<textarea class="input" v-model="order.problem_desc" placeholder="请输入问题描述"></textarea>
			</view>
			<view class="form-box">
				<text class="title">上传照片（非必填）</text>




				<uni-file-picker class="upload" limit="3" :del-icon="true" disable-preview :auto-upload="false"
					:value="fileLists" @select="handleSelect" @delete="handleDelete" file-mediatype="image">
				</uni-file-picker>
			</view>
		</view>

		<view class="placeholder"></view>

		<view class="foot">
			<view>
				<button @click="add()">提交报修</button>
			</view>

		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				range: [],
				fileLists: [
					// 	{
					// 	url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao-small.jpg',
					// 	extname: 'png',
					// 	name: 'shuijiao.png'
					// },
				],
				order: {
					device_id: "",
					model: "inspect",
					phone: "",
					problem_desc: "",
					dealer_objectid: "", //经销商id
					project_objectid: "",
					creator_objectid: ""
				},
				active: 0,


				status: 0,
				tag: [{
						text: '保养',
						value: 0
					},
					{
						text: '故障',
						value: 1
					}
				],
				tagMess: ["inspect", "break"],
				device: [],
				deviceIndex: {},
				objectid: '',
				tempFilePaths: [],
				orderid: ''

			};
		},
		onShow() {

			this.deviceSearch()
		},
		mounted() {

			this.objectid = uni.getStorageSync('user').objectid

		},
		methods: {

			changeName(e) {
				console.log(e)
				this.order.creator_objectid = uni.getStorageSync('user').objectid
				this.order.device_id = e
				this.order.dealer_objectid = this.device[this.deviceIndex[e]].dealer_objectid
				this.order.project_objectid = this.device[this.deviceIndex[e]].project_objectid

			},

			async deviceSearch() {

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
					this.deviceIndex = {}
					this.device = res.data.data
					this.device.filter((item, index) => {
						this.range.push({
							text: item.name,
							value: item.objectid
						})
						this.deviceIndex[item.objectid] = index
					})
					console.log(this.device)
				}

			},
			changeLog(e) {
				console.log('change事件:', e);
			},
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			async add() {
				if (!this.order.problem_desc || !this.order.device_id) {
					uni.showToast({
						icon: "error",
						title: "请输入!"
					})
					return
				}



				const res = await this.$request({
					method: 'POST',
					url: 'workorder/create',
					data: this.order,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) {

					this.orderid = res.data.data

					this.tempFilePaths.filter((item) => {

						uni.uploadFile({
							url: 'https://iot.tillan.cn/v2/api/workorder/up/img?id=' + this
								.orderid, //上传图片的后端接口
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
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
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
			change(e) {
				this.order.model = this.tagMess[this.active]
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		justify-content: space-between;
		margin-bottom: 14px;
		font-size: 14px;


		.name {
			display: flex;
			align-items: center;
			overflow-wrap: break-word;
			color: rgba(153, 153, 153, 1);
			line-height: 20px;

		}

		.value {
			display: flex;


			align-items: center;

			/deep/ .uni-select {
				min-width: 100px;
			}

			/deep/ .uni-select__input-box {
				justify-content: flex-end;
			}

			/deep/ .checklist-box {
				margin-right: 5px;
			}

			image {
				width: 80px;
				height: 80px;
				margin-right: 10px;
			}

		}

	}

	.form {

		box-sizing: border-box;


		.form-box {
			display: flex;
			flex-direction: column;
			margin-bottom: 14px;

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
					background: rgb(187, 187, 187);
				}

				/deep/ .file-picker__box-content {
					border: none !important;
					background: rgb(244, 244, 244);

				}


			}

			/deep/ .uniui-calendar::before {
				content: ''
			}

			/deep/ .uni-date__x-input {
				padding: 5px;
				// font-size: 16px;
			}

			.input {
				border-radius: 5px;
				border: 1px solid rgba(221, 221, 221, 1);
				padding: 11px 9px;
				width: 100%;
				box-sizing: border-box;
				font-size: 14px
			}

			.title {
				display: flex;
				align-items: center;
				color: rgba(153, 153, 153, 1);
				line-height: 20px;
				font-size: 14px;
				margin-bottom: 10px
			}

		}


	}

	.placeholder {
		width: 1px;
		height: 30px;
	}

	.foot {
		display: flex;
		justify-content: flex-end;

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
</style>
