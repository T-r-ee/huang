<template>

	<intellect title="成员管理" text='删除成员' show="true" @rightBtn="rightBtn()">
		<view class="content-box" v-for="(item,index) of data" :key="index">
			<text class="title">{{item.name}}</text>

			<view class="box" @click="goto(index)">
				<text v-if="item.value"> {{user.username}}</text>
				<image v-else class="photo" :src="user.avatar"></image>
				<image class="icon" src="../../static/right.png"></image>
			</view>

		</view>



		<view class="share-box">
			<image src="../../static/share.png"></image>
			<text @click="open()">分享设备</text>
		</view>



		<uni-popup ref="popup" type="bottom">
			<view class="popup">
				<view class="topic">
					<text>分享设备</text>

				</view>
				<view class="middle">
					<uni-data-select class="select" :clear='false' v-model="type" placeholder="请选择空间"
						:localdata="range1" @change="change">
					</uni-data-select>
					<uni-data-select class="select" :clear='false' v-model="type" placeholder="请选择设备"
						:localdata="range1" @change="change">
					</uni-data-select>
				</view>
				<view class="run">
					<text @click="close">取消</text>
					<text class="share">分享</text>
				</view>


			</view>
		</uni-popup>



	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				range1: {},
				data: [{
						name: '头像',
						value: ''
					},
					{
						name: '名字',
						value: 'James'
					}
				],
				user: {},
				query: {}

			};
		},

		onLoad(options) {
			this.query = options
			this.load()
		},
		onShow() {
			this.load()
		},
		methods: {
			async rightBtn() {
				const res = await this.$request({
					method: 'POST',
					url: 'account/delete',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code = 200) {
					uni.showToast({
						title: "删除成功"
					})
					let time = setInterval(() => {
						uni.navigateBack();
						clearInterval(time)
					}, 1000)


				}
			},
			async load() {

				const res = await this.$request({
					method: 'POST',
					url: 'account/search',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				this.user = res.data.data

			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			goto(e) {
				console.log(e)
				if (e)
					uni.navigateTo({
						url: '/pages/mine/date/edit?objectid=' + this.user.objectid
					})
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
		margin-top: 10px;
		font-size: 16px;
		line-height: 22px;

		.title {
			display: flex;
			align-items: center;
			color: rgba(51, 51, 51, 1);
			margin-bottom: 20px
		}

		.box {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);

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

	.share-box {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;

		image {
			width: 17px;
			height: 17px;
			margin-right: 5px;
		}

		text {
			color: rgba(0, 139, 137, 1);
			font-size: 16px;
			line-height: 22px;
		}
	}

	.popup {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 5px 5px 0px 0px;

		.topic {

			font-size: 14px;
			line-height: 20px;
			display: flex;
			justify-content: center;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			padding: 15px;


		}

		.middle {
			display: flex;
			flex-direction: column;
			padding: 30px 0 10px 0;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			.select {
				margin-bottom: 30px;
			}

			/deep/ .uni-select__input-placeholder {
				font-size: 16px;
				color: rgba(51, 51, 51, 1);
			}

			/deep/ .uni-select {
				border: none;
			}

			/deep/ .uni-select__input-box {
				font-size: 16px;
			}

			/deep/ .uni-select__input-text {
				margin-right: 10px
			}

			.name {
				width: 50%;
				padding: 60px 0px;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.value {
				text-align: center;
				width: 50%;
				padding: 60px 0px;
			}
		}

		.run {
			display: flex;
			justify-content: center;
			margin: 10px 0px;

			text {
				width: 50%;
				text-align: center;
				line-height: 22px;
				padding: 10px 0;
				font-size: 16px
			}

			.share {
				color: rgba(0, 139, 137, 1);
			}
		}
	}
</style>
