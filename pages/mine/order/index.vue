<template>
	<view class="main">
		<view class="head" :style="{'padding-top':position.top+'px'}">

			<view class="head-title" :style="{'height':position.height+'px'}">
				<view class="back" @click="back()">

					<image src="../../../static/leftp.png"></image>

				</view>

				工单管理
			</view>
		</view>

		<view class="content">

			<view class="content-box" v-for="(item,index) of data" :key="index"
				@click=" goto('order/edit?objectid='+item.objectid)">
				<view class="flex">
					<view class="name">提交时间:</view><text>{{getDate(item.created
)}}</text>
				</view>
				<view class="flex">
					<view class="name">设备:</view><text>{{item.device_name}}</text>
				</view>
				<view class="flex">
					<view class="name">工单类型:</view><text>{{ type[item.model]}}</text>
				</view>
				<view class="flex">
					<view class="name">
						工单状态:</view>
					<text
						:class="[ item.status===' 处理中'?'green': item.status==='已接单' ?'blue':item.status==='已派单' ?'yellow':'' ]">
						{{item.status||"处理中"}}</text>
				</view>
			</view>

			<view class="add">
				<view>
					<button class="right" @click="goto('order/add')"> 添加工单 </button>
				</view>

			</view>

		</view>



	</view>
</template>

<script>
	export default {

		data() {
			return {
				type: {
					break: "故障",
					inspect: "保养"
				},
				data: [{
						time: '2023-09-09 10:00',
						device: '主卧的新风',
						type: '故障',
						status: '已完结/已回访'
					},
					{
						time: '2023-09-09 10:00',
						device: '主卧的新风',
						type: '故障',
						status: '处理中'
					},
					{
						time: '2023-09-09 10:00',
						device: '主卧的新风',
						type: '故障',
						status: '已接单'
					},
					{
						time: '2023-09-09 10:00',
						device: '主卧的新风',
						type: '故障',
						status: '已派单'
					}
				],
				time: '12:01',
				position: {
					top: '30',
					right: '',
					height: ''
				},
				order: []
			};
		},
		onShow() {
			this.load()
		},
		mounted() {
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}

		},
		methods: {

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
					url: 'workorder/search',
					data: {
						filter: {
							creator_objectid: uni.getStorageSync('user').objectid
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.data) {
					let order = res.data.data //
					this.order = []
					order.filter((item) => {

						this.loadOrder(item)


					})
					this.data = this.order

				}
			},
			async loadOrder(item) {
				const device = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: {

						objectid: item.device_id

					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (device.data.data) {
					this.order.push({
						...item,
						device_name: device.data.data.name
					})
				}
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
			//background: white;
			// background-color: white;
			overflow: scroll;

			box-sizing: border-box;
			padding: 0px 14px 8px 14px;
			margin-bottom: 60px;

			.content-box {
				background: white;
				border-radius: 6px;
				margin-bottom: 10px;
				box-sizing: border-box;
				padding: 20px 20px 4px;

				.flex {
					display: flex;
					margin-bottom: 16px;

					.name {
						text-align: right;
						width: 60px;
						color: rgba(153, 153, 153, 1);
						font-size: 14px;
						margin-right: 10px;
						line-height: 20px;
					}

					.green {
						color: rgba(0, 139, 137, 1);
					}

					.blue {
						color: rgba(0, 145, 255, 1);
					}

					.yellow {
						color: rgba(247, 181, 0, 1)
					}
				}
			}

			.add {
				position: fixed;
				bottom: 0px;
				right: 15px;
				display: flex;
				justify-content: flex-end;
				align-items: center;



				.right {
					background-color: rgba(0, 139, 137, 1);
					border-radius: 22px;
					padding: 11px 0;
					margin: 11px 0;
					width: 110px;
					color: rgba(255, 255, 255, 1);
					font-size: 16px;
					line-height: 22px;
				}
			}

		}

	}
</style>
