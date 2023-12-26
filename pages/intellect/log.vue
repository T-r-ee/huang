<template>

	<intellect title="操作日志" :hide='true'>
		<view class="operate-log">
			<uni-swipe-action v-for="item of msg" :key="item">
				<uni-swipe-action-item style="width: 100%;" :right-options="options1" :auto-close="false"
					@click="deleteClick(item.objectid)">

					<view class="content-box">
						<view class="title">
							<image src="../../static/oclock.png"></image>
							<text>{{getDate(item.created)}} </text>
						</view>
						<text class="value"> {{item.label}}</text>
					</view>
					<!-- 	<view style="height: 19px;width:100%"></view> -->
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>


	</intellect>

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
				msg: [],


			};
		},

		mounted() {

			//this.load()

		},
		onShow() {
			this.load()
		},
		methods: {
			async deleteClick(e) {
				const res = await this.$request({
					method: 'POST',
					url: 'record/delete',
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
			getImageUrl(mes) {
				return '../../static/' + mes;
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
			async load() {
				const res = await this.$request({
					method: 'POST',
					url: 'record/search',
					data: {
						filter: {
							account_objectid: uni.getStorageSync("user").objectid
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200)
					this.msg = res.data.data

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
	.operate-log {
		position: relative;
		top: -13px;

		.content-box {
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid rgb(221, 221, 221);
			padding-top: 19px;

			.title {
				image {
					width: 14px;
					height: 14px;
					margin-right: 15px;
				}

				display: flex;
				align-items: center;
				color: rgba(153, 153, 153, 1);
				line-height: 20px;
				font-size: 14px;
			}

			.value {
				margin: 10px 0;
			}
		}
	}
</style>
