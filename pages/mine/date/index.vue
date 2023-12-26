<template>

	<intellect title="个人资料" :hide='true'>
		<view :class="['content-box',  index!==0?'content-margin':'']" v-for="(item,index) of data" :key="index">
			<view class="title">{{item.name}}</view>

			<view class="box" @click="goto(index)">
				{{item.value}}
				<view v-if="!item.value">
					<uni-file-picker class="custom-file-picker" limit="1" :del-icon="false" disable-preview
						:auto-upload="false" :value="fileLists" @select="handleSelect" file-mediatype="image">
					</uni-file-picker>
				</view>
				<!-- <image v-if="!item.value" class="photo" src="../../static/photo.png"></image> -->
				<image class="icon" src="../../../static/right.png"></image>
			</view>

		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {

				user: {},
				fileLists: [{
					url: 'https://file.tillan.cn/account/655f110cb800474cc78de29e/avatar.png',
					extname: 'png',
					name: 'shuijiao.png'
				}],
				data: [{
						name: '头像',
						value: ''
					},
					{
						name: '昵称',
						value: 'James',

					},
					{
						name: '手机号',
						value: '12999887777'
					}
				]

			};
		},
		onShow() {
			this.load()


		},
		mounted() {


		},
		methods: {
			goto(e) {
				if (e === 1) {
					uni.navigateTo({
						url: "/pages/mine/date/edit?objectid=" + uni.getStorageSync('user').objectid
					})
				}
			},
			async load() {

				const res = await this.$request({
					method: 'POST',
					url: 'account/search',
					data: {

						objectid: uni.getStorageSync('user').objectid

					},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token')
					},
				})
				this.user = res.data.data
				uni.setStorageSync('user', this.user)
				this.data[1].value = this.user.username
				this.data[2].value = this.user.phone
				this.fileLists[0].url = this.user.avatar + '?t=' + Date.now()

			},
			handleSelect(e) {

				const tempFilePaths = e.tempFilePaths;
				console.log(e)
				uni.uploadFile({
					url: 'https://iot.tillan.cn/v2/api/account/avatar?id=' +
						this.user.objectid, //上传图片的后端接口
					filePath: tempFilePaths[0],
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token')
					},
					name: 'file',
					success: res => {
						this.load()
						// this.user.avatar = JSON.parse(res.data).data[
						// 	0]

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
	.content-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;
		font-size: 16px;
		line-height: 22px;



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
		margin-top: 20px;
	}
</style>
