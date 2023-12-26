<template>
	<view class="main">
		<view class="head" :style="{'padding-top':position.top+'px'}">
			<view class="head-title" :style="{'height':position.height+'px'}">
				<div class="back" @click="back()">
					<image src="../../../static/leftp.png"></image>
				</div>

				消息中心
			</view>
		</view>

		<view class="content">

			<uni-swipe-action v-for="(item,index) of data" :key="index">
				<uni-swipe-action-item style="width: 100%;" :right-options="options1" :auto-close="false"
					@click="deleteClick(item.objectid)">

					<view class="content-box" @click="gotoUp('home/message/detail?objectid='+item.objectid)"
						:key="index">
						<view class="title">{{item.name}}</view>
						<view class="flex">
							<view class="name">时间:</view>
							<text>{{getDate(item.created)}}</text>
						</view>
						<view class="flex">
							<view class="name">内容:</view><text>{{item.content}}</text>
						</view>
						<view class="line">
							<image src="../../../static/line-black.png"></image>

						</view>

						<view class="flex flex-between">
							<view class="name font">
								{{item.read==="已读"?'已读':'未读'}}
							</view>
							<text class="green font" @click="gotoDown('home/repair')">一键报修</text>
						</view>
					</view>

				</uni-swipe-action-item>
			</uni-swipe-action>





		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				options1: [{
					text: '删除',
					style: {
						backgroundColor: 'rgba(224, 32, 32, 1)'
					}
				}],
				data: [],
				time: '12:01',
				position: {
					top: '30',
					right: '',
					height: ''
				}

			};
		},

		onShow() {
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}
			this.load()
		},

		methods: {
			async deleteClick(e) {
				const res = await this.$request({
					method: 'POST',
					url: 'msg/center/delete',
					data: {
						objectid: e
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
			back() {
				uni.navigateBack()
			},
			getDate(timestamp) {
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
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},
			async load() {

				const res = await this.$request({
					method: 'POST',
					url: 'msg/center/search',
					data: {
						account_objectid: uni.getStorageSync('user').objectid,
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					this.data = res.data.data
				}
			},

			gotoUp(mess) {
				uni.navigateTo({
					url: '/pages/' + mess
				})

			},
			gotoDown(mess) {
				uni.navigateTo({
					url: '/pages/' + mess
				})
				event.stopPropagation()
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
				align-items: center;
				justify-content: center;
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


					.name {
						width: 50px;
						color: rgba(153, 153, 153, 1);
						font-size: 14px;
						margin-right: 10px;
						line-height: 20px;
					}

					.font {
						font-size: 16px;
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


	}
</style>
