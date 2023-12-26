<template>

	<intellect title="空调运行数据" :hide='true'>
		<view class="content-box">
			<view class="title">
				<text>运行曲线</text>
				<view class="select">
					<view :class="['text',item.check?'check':'']" v-for="(item,index) of select" :key="index"
						@click="checkSelect(index)">
						{{item.value}}
					</view>
				</view>
			</view>
			<view class="echart">
				<!-- 	<image src="../../static/echart2.png" class="echarts"></image> -->
				<echarts-uniapp class="echarts" ref="echarts" :option="option" canvasId="echarts">
				</echarts-uniapp>
			</view>
			<view class="foot">
				<image src="../../static/date-left.png" @click="dateChange(0)"></image>

				<uni-dateformat :date="date" format='yyyy/MM/dd'></uni-dateformat>

				<image src="../../static/date-right.png" @click="dateChange(1)"></image>
			</view>
		</view>
	</intellect>

</template>

<script>
	import echarts from '../components/echarts-uniapp/echarts-uniapp.vue'

	export default {
		components: {
			'echarts-uniapp': echarts
		},
		data() {
			return {
				date: null,
				option: {},
				allEnergy: 0,
				select: [{
					value: '日',
					check: true
				}, {
					value: '月',
					check: false
				}],
				activeColor: 'rgb(6,115,121)',
				msg: [{

						time: '2023-09-09 09:00',
						value: '用户[Jerry]开启了离家模式',

					},
					{

						time: '2023-09-09 09:00',
						value: '用户[Jerry]开启了离家模式',

					},
					{

						time: '2023-09-09 09:00',
						value: '用户[Jerry]开启了离家模式',

					}
				],


			};
		},

		onReady() {
			this.date = new Date();
			this.option = {

				legend: {
					// icon: 'circle',
					top: '3%',
					left: '0%',

					itemGap: 20,
					textStyle: {
						color: '#556677'
					}
				},
				grid: {
					top: '15%',
					left: '0%',
					right: '3%',
					bottom: '8%',
					containLabel: true,
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					axisLine: { //坐标轴轴线相关设置。数学上的x轴
						show: false,
						lineStyle: {
							color: '#233e64'
						},
					},
					axisLabel: { //坐标轴刻度标签的相关设置
						textStyle: {
							color: 'white',
							margin: 15,
						},
					},
					axisTick: {
						show: false,
					},
					data: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7'],
				}],
				yAxis: [{
					type: 'value',
					min: 0,
					max: 140,
					splitNumber: 7,
					splitLine: {
						show: true,
						lineStyle: {
							color: 'rgba(187, 187, 187, 0.1)'
						}
					},
					axisLine: {
						show: false,
					},
					axisLabel: {
						margin: 20,
						textStyle: {
							color: 'rgba(187, 187, 187, 0.8)',

						},
					},
					axisTick: {
						show: false,
					},
				}],
				series: [{
						name: '温度',
						type: 'line',
						smooth: true, //是否平滑曲线显示
						// 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
						symbolSize: 0,

						lineStyle: {
							normal: {
								color: "#3deaff" // 线条颜色
							}
						},
						areaStyle: { //区域填充样式
							normal: {

								color: "rgba(81,219,248,0.3)",

								shadowColor: 'rgba(81,219,248,0.3)', //阴影颜色
								shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
							}
						},
						data: [90, 105, 84, 125, 110, 92, 98]
					},
					{
						name: '湿度',
						type: 'line',
						smooth: true, //是否平滑曲线显示
						// 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
						symbolSize: 0,

						lineStyle: {
							// normal: {
							// 	color: "rgba(34,114,69,0.3)" // 线条颜色
							// }
						},
						areaStyle: { //区域填充样式
							normal: {

								color: "rgba(34,114,69,0.3)",

								shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
								shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
							}
						},
						data: [11, 22, 33, 44, 55, 36, 48]
					}
				]
			};
		},
		methods: {
			dateChange(e) {
				if (e)
					this.date = new Date(this.date.setDate(this.date.getDate() + 1))
				else this.date = new Date(this.date.setDate(this.date.getDate() - 1))
			},
			checkSelect(e) {

				this.select[e].check = true
				if (e) {
					this.select[0].check = false
				} else this.select[1].check = false
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
			load() {
				uni.request({
					url: 'https://iot.tillan.cn/tingxin/api/device/list',
					method: 'GET',

					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					},
					success: (res) => {
						this.device = res.data.data
						console.log(this.device)
						this.device.filter((item) => {



						})




					},
					fail: (err) => {}
				});
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
	.content-box {
		display: flex;
		flex-direction: column;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.select {
				display: flex;
				background-color: rgba(239, 239, 239, 1);
				border-radius: 100px;
				color: rgba(187, 187, 187, 1);
				overflow: hidden;
				width: 100px;
				height: 30px;


				.text {
					width: 50%;
					height: 100%;

					display: flex;
					align-items: center;
					justify-content: center;
				}

				.check {
					background: rgb(6, 115, 121);
					color: white
				}
			}
		}

		.echart {

			width: 100%;
			height: 500px;

			.echarts {
				width: 100%;
				height: 100%;
			}

		}

		.foot {
			display: flex;
			justify-content: space-between;
			align-items: center;

			border-radius: 5px;

			height: 50px;
			border: 1px solid rgba(221, 221, 221, 1);
			padding: 14px 51px 14px 51px;
			box-sizing: border-box;

			image {
				width: 6px;
				height: 12px;
			}

			.font {}
		}
	}
</style>
