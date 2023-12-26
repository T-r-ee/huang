<template>
	<view class="main">
		<view class="head" :style="{'padding-top':position.top+'px'}">
			<view class="head-title" :style="{'height':position.height+'px'}">
				<div class="back" @click="back()">

					<image src="../../../static/leftp.png"></image>

				</div>

				消息详情
			</view>
		</view>

		<view class="content">

			<view class="content-box">
				<view class="title">{{data.name||'设备'}} </view>
				<view class="flex">
					<view class="name">报修内容：</view><text>{{data.content||"报修内容"}}</text>
				</view>
				<view class="flex">
					<view class="name">报修时间：</view><text>{{getTime(data.created)}}</text>
				</view>

				<view class="flex">
					<view class="name">报修图片：</view>
					<image :src="'../../../static/view.png'"></image>
				</view>
			</view>
		</view>
		<view class="foot">
			<button class="left" @click="edit()">修改</button>
			<button class="right" @click="alert()">一键报修</button>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				// data: [{
				// 		time: '2023-09-09 10:00',
				// 		content: '空调打不开',
				// 		src: ['view.png', 'view.png']
				// 	},

				// ],
				data: {},
				time: '12:01',
				position: {
					top: '30',
					right: '',
					height: ''
				}

			};
		},
		onLoad(option) {
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}
			this.load(option.objectid)
		},
		mounted() {


		},
		methods: {
			edit() {
				uni.showToast({
					title: "修改"
				})
			},
			back() {
				uni.navigateBack()
			},
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			async load(e) {

				const res = await this.$request({
					method: 'POST',
					url: 'msg/center/search',
					data: {
						objectid: e,
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					this.data = res.data.data
					console.log(this.data)
				}

				const read = await this.$request({
					method: 'POST',
					url: 'msg/center/update',
					data: {
						objectid: e,
						data: {
							read: "已读"
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
			},
			getTime(timestamp) {
				var date = new Date(timestamp * 1000); // 将秒数转换为毫秒数
				var year = date.getFullYear();
				var month = date.getMonth() + 1; // 月份是从0开始计数的，所以要加1
				var day = date.getDate();
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();

				return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hours <
					10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' :
					'') + seconds;
			},

			goto(mess) {
				uni.navigateBack({
					url: '/pages/' + mess
				})
			},
			alert() {
				uni.showToast({
					title: "上报消息"
				})
				let time = setInterval(() => {
					this.goto('home/message/index')
					clearInterval(time)
				}, 1000)

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
		background: url("../../../static/homeBack.png") 100% no-repeat;
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
					position: absolute;
					left: 0px;
					padding: 0 10px;

					image {
						width: 8px;
						height: 14px;
					}


				}
			}

		}

		.content {
			height: 100%;
			overflow: scroll;

			box-sizing: border-box;
			padding: 0px 14px 8px 14px;

			.content-box {


				background: white;
				border-radius: 6px;
				margin-bottom: 10px;
				box-sizing: border-box;
				padding: 20px 20px 4px;


				.title {
					width: 64px;
					color: rgba(51, 51, 51, 1);
					font-size: 16px;
					line-height: 22px;
					margin-bottom: 10px
				}

				.line {
					display: flex;
					margin-bottom: 17px;

					image {
						height: 1px;
						width: 100%
					}
				}

				.flex {
					display: flex;
					margin-bottom: 16px;
					flex-wrap: wrap;

					image {
						width: 83px;
						height: 83px;
						margin-left: 10px;
					}

					.name {

						color: rgba(153, 153, 153, 1);
						font-size: 14px;
						margin-right: 10px;
						line-height: 20px;
					}


					.green {
						color: rgba(0, 139, 137, 1);
					}

					.red {
						color: rgba(224, 32, 32, 1);
					}


				}


				.flex-between {
					display: flex;
					justify-content: space-between;
				}
			}
		}

		.foot {
			position: fixed;
			bottom: 10px;
			right: 10px;
			display: flex;
			align-items: center;

			.left {
				color: rgba(0, 139, 137, 1);
				font-size: 16px;
				line-height: 22px;
				background: transparent;
			}

			.left::after {
				border: none;
			}

			.right {
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
