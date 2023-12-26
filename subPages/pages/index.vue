<template>
	<view class="main">
		<view class="head">
			<view class="location" :style="{ 'padding-top':position.top+'px'  ,'height':position.height+'px'}">
				<div class="left" @click="back()">
					<image referrerpolicy="no-referrer" src="../../static/leftp.png"></image>

				</div>

				<div class="text">{{device.name}}</div>
				<image class="right" referrerpolicy="no-referrer" src="../../static/shareoff.png"
					:style="{ 'margin-right':position.right+'px'}" @click="menuOpen('share')">
				</image>

			</view>
			<view class="name">{{device.location}}</view>
		</view>

		<view class="middle">
			<view class="title">
				<view class="box">

					<image :src="'../../static/'+icon[device.model||4]"></image>

					<view class="name">
						<text class="text-name">{{device.name}} </text>
						<text class="text-temper">当前温度 {{ device.info?device.info.temperature:"0"  }}°C</text>
					</view>
				</view>
				<text class="data" @click="gotoText()">运行数据</text>
			</view>


			<view class="pattern">
				<view
					:class="[ 'pattern-box',deviceStatus?'':'close' ,menuCheck===1?'green':'',device.model==='fs'?'gap':'']"
					@click="menuOpen('adjust')">
					<image :src="'../../static/' +menuStatus[0]"></image>
					<text>调节模式</text>
				</view>
				<view v-if="device.model!=='6'"
					:class="[ 'pattern-box',deviceStatus?'':'close','pattern-margin' ,menuCheck===2?'green':'']"
					@click="menuOpen('wind')">
					<image :src="'../../static/' +menuStatus[1]"></image>
					<text>风量</text>
				</view>
				<view :class="[ 'pattern-box',deviceStatus?'':'close' ,menuCheck===3?'green':'']"
					@click="menuOpen('humidity')">
					<image :src="'../../static/' +menuStatus[2]"></image>
					<text>湿度</text>
				</view>
			</view>
			<view class="temper">
				<div class="down" @click="tempDown()">
					<image src="../../static/jian.png"></image>
				</div>

				<view class="echart">
					<div class="font">
						<view class="name">{{setTemp }}</view>

						<view class="value">
							<view class="hide"> ℃</view>
							<view class="move"> ℃</view>
						</view>

					</div>
					<echarts-uniapp class="echarts" style="position: absolute;" ref="echarts3" :option="option3"
						canvasId="echarts3">
					</echarts-uniapp>
					<echarts-uniapp class="echarts" ref="echarts" :option="option" canvasId="echarts">
					</echarts-uniapp>
				</view>

				<image class="up" src="../../static/jia.png" @click="tempUp()"></image>
			</view>

			<view class="type">
				<view v-if="!(device.model==='6'&&index==1)"
					:class="['type-box', index===1?'border':'font',(device.model==='6'&&index==0)?'normal-border':'' ]"
					v-for="(item,index) of type" :key="index">
					<view class="value">{{item.value}} </view>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
		</view>

		<proup ref="shareRef" title='分享给家人' class="share">
			<template v-slot:content>
				<view class="share-box">
					<view v-for="(item,index) of member" :class="['item',index!==0?'margin':'']" :key="index">
						<view class="left">
							<image class="photo" :src="item.avatar"></image>
							<text>{{item.username}}</text>
						</view>
						<image class="icon" src="../../static/sharegray.png" @click="share()"></image>
					</view>
					<view v-if="!member.length" class="share-add" @click="goto('mine/home/add')">

						<image src="../../static/add.png"></image>
						<text>添加</text>


					</view>
				</view>

			</template>

			<template v-slot:foot>
				<view @click="menuClose('share')">取消</view>
			</template>
		</proup>


		<proup ref="adjustRef" title='调节模式' class="share" @maskClick="menuClose('adjust')">
			<template v-slot:content>
				<view class="adjust-box">
					<view v-for="(item,index) of adjust" @click="checkAdjust(index)" :key="index"
						:class="['item',index!==0?'margin':'',item.check?'check':'']">
						<view class="font">
							<text>{{item.name}}</text>
						</view>
						<image v-if="item.check" class="icon" src="../../static/check.png"></image>
					</view>
				</view>

			</template>

			<template v-slot:foot>
				<view class="adjust-foot">
					<view @click="menuClose('adjust')">取消</view>
					<view @click="confirmMenu('adjust')" class="confirm">确定</view>
				</view>

			</template>
		</proup>



		<proup ref="windRef" title='风量' class="share" @maskClick="menuClose('wind')">
			<template v-slot:content>
				<view class="adjust-box">
					<view v-for="(item,index) of wind" @click="checkWind(index)" :key="index"
						:class="['item',index!==0?'margin':'',item.check?'check':'']">
						<view class="font">
							<text>{{item.name}}</text>
						</view>
						<image v-if="item.check" class="icon" src="../../static/check.png"></image>
					</view>
				</view>

			</template>

			<template v-slot:foot>
				<view class="adjust-foot">
					<view @click="menuClose('wind')">取消</view>
					<view @click="confirmMenu('wind')" class="confirm">确定</view>
				</view>

			</template>
		</proup>



		<proup ref="humidityRef" title='湿度' class="share" @maskClick="menuClose('humidity')">
			<template v-slot:content>
				<view class="humidity-box">
					<view class="font">{{setHumility}}</view>
					<view class="scroll">
						<div class="down" @click="down()">
							<image src="../../static/jian.png"></image>
						</div>

						<slider activeColor="#008C8B" block-color="#008C8B" v-model="setHumility" style="flex: 1;"
							min="40" max="70" step="1" block-size="20" @changing="sliderChange" />


						<image src="../../static/jia.png" class="up" @click="up()"></image>
					</view>

				</view>

			</template>

			<template v-slot:foot>
				<view class="adjust-foot">
					<view @click="menuClose('humidity')">取消</view>
					<view @click="confirmMenu('humidity')" class="confirm">确定</view>
				</view>

			</template>
		</proup>


		<view class="foot">

			<text @click="goto('home/repair?objectid='+query.objectid)">我要报修</text>
			<image class="open" v-if='deviceStatus' src="../../static/openbtn.png" @click="deviceChange(0)"></image>
			<image class="open" v-else src="../../static/closebtn.png" @click="deviceChange(1)"></image>
			<image class="setting" :src="'../../static/'+menuStatus[3]" @click="settingLink() "></image>
		</view>


	</view>

</template>

<script>
	import echarts from '../components/echarts-uniapp/echarts-uniapp.vue'

	export default {
		components: {
			'echarts-uniapp': echarts
		},

		data() {
			return {
				checked: [0, 0, 0],
				setHumility: 40,
				member: [],
				device: {},
				icon: {
					4: "air1.png",
					6: "air2.png",
					8: "air3.png",
					9: "air1.png",
					1: "air1.png"
				},
				tempMenu: ['', '', ''],
				menuCheck: 0,
				menuStatus: ['refresh.png', 'wind.png', 'humidity.png', 'setting.png'],
				chartColor: ['#008B89', '#E3E3E3'],
				menuIcon: [{
						normal: 'refresh.png',
						on: 'refreshon.png',
						off: 'refreshoff.png'
					},
					{
						normal: 'wind.png',
						on: 'windon.png',
						off: 'windoff.png'
					},
					{
						normal: 'humidity.png',
						on: 'humidityon.png',
						off: 'humidityoff.png'
					},
					{
						normal: 'setting.png',
						off: 'settingoff.png'
					}
				],
				deviceStatus: true,
				adjust: [{
						name: '空调',
						check: false
					},
					{
						name: '地板',
						check: false
					},
					{
						name: '空调+地板',
						check: false
					},
					{
						name: '除湿',
						check: false
					},
					{
						name: '通风',
						check: false
					}

					// {
					// 	name: '冷风',
					// 	check: false
					// },
					// {
					// 	name: '暖风',
					// 	check: false
					// },
					// {
					// 	name: '地冷',
					// 	check: false
					// },
					// {
					// 	name: '地暖',
					// 	check: false
					// },
					// {
					// 	name: '冷风+地冷',
					// 	check: false
					// },
					// {
					// 	name: '暖风+地暖',
					// 	check: false
					// },
					// {
					// 	name: '除湿',
					// 	check: false
					// },
					// {
					// 	name: '通风',
					// 	check: false
					// }
				],
				wind: [{
						name: '微风',
						check: false,
						value: 1
					},
					{
						name: '低速',
						check: false,
						value: 2
					},
					{
						name: '中速',
						check: false,
						value: 3
					},
					{
						name: '高速',
						check: false,
						value: 4
					},
					{
						name: '强劲',
						check: false,
						value: 5
					},
					{
						name: '自动',
						check: false,
						value: 0
					}
				],
				people: [{
						photo: 'photo.png',
						name: 'Jerry',
						icon: 'shareoff.png'
					},
					{
						photo: 'photo.png',
						name: 'Jerry',
						icon: 'shareoff.png'
					},
					{
						photo: 'photo.png',
						name: 'Jerry',
						icon: 'shareoff.png'
					},
					{
						photo: 'photo.png',
						name: 'Jerry',
						icon: 'shareoff.png'
					}
				],
				option: {},
				type: [{
					name: '模式',
					value: '顶冷+地冷'
				}, {

					name: '风速',
					value: '强劲'
				}, {
					name: '湿度',
					value: '60%'
				}],
				pattern: [{
					src: 'refresh.png',
					name: '调节模式'
				}, {
					src: 'wind.png',
					name: '风量'
				}, {
					src: 'humidity.png',
					name: '湿度'
				}],
				acc: 0,
				options1: [{
					text: '删除',
					style: {
						backgroundColor: 'rgba(224, 32, 32, 1)'
					}
				}],
				title: [{
						name: '全屋',
						check: false
					},
					{
						name: '中厅',
						check: true
					},
					{
						name: '外廊',
						check: false
					},
					{
						name: '内厅',
						check: false
					}
				],
				topic: [{
						name: "室外温湿度",
						value: "30.3°C/70%",
					},
					{
						name: "室外PM2.5",
						value: "13.0",
					},
					{
						name: "室外PM10",
						value: "20.0",
					},

				],
				device: [{
					name: '空调',
					locate: '中厅',
					src: 'air1.png',
					property: [{
							name: '温度',
							value: '27℃'
						},
						{
							name: '湿度',
							value: '70%'
						}
					],
					status: true
				}, {
					name: '辐射',
					src: 'air3.png',
					locate: '外廊',
					property: [{
							name: '温度',
							value: '27℃'
						},
						{
							name: '湿度',
							value: '70%'
						}
					],
					status: true
				}, {
					name: '新风系统',
					locate: '中厅',
					src: 'air2.png',
					property: [{
							name: '温度',
							value: '27℃'
						},
						{
							name: '湿度',
							value: '70%'
						},
						{
							name: '加湿',
							status: '70%'
						}
					],
					status: true
				}],
				status: [],
				device_id: '',
				query: {},
				position: {
					top: '',
					height: '',
					right: ''
				},
				setTemp: 20,
				option3: {},
			};
		},


		onShow(options) {

		},
		onLoad(options) {

			this.query = options
			this.load()
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}

		},
		onReady() {
			this.option3 = {

				angleAxis: {
					show: false,
					max: 100 * 360 / 270, //-45度到225度，二者偏移值是270度除360度
					type: 'value',
					startAngle: 225, //极坐标初始角度
					splitLine: {
						show: false
					}
				},
				barMaxWidth: 14, //圆环宽度
				radiusAxis: {
					show: false,
					type: 'category',
				},
				//圆环位置和大小
				polar: {
					center: ['50%', '52%'],
					radius: '150'
				},
				series: [{ //下层圆环，显示最大值
						type: 'bar',
						data: [{
							value: 100,
							itemStyle: {
								color: 'rgb(246,246,246)'
							}
						}],
						barGap: '-100%',
						coordinateSystem: 'polar',
						roundCap: true,
						z: 1,
						silent: true,
					},

				]
			}


			this.option = {

				title: [{
					text: '目标温度',
					x: 'center',
					bottom: 15,
					padding: [7, 14],
					textStyle: {
						fontWeight: 'normal',
						fontSize: 12,
						color: 'rgb(153,153,153)'
					}
				}],
				angleAxis: {
					show: false,
					max: 100 * 360 / 270, //-45度到225度，二者偏移值是270度除360度
					type: 'value',
					startAngle: 225, //极坐标初始角度
					splitLine: {
						show: false
					}
				},
				barMaxWidth: 14, //圆环宽度
				radiusAxis: {
					show: false,
					type: 'category',
				},
				//圆环位置和大小
				polar: {
					center: ['50%', '52%'],
					radius: '150'
				},
				series: [{
					type: 'bar',
					data: [{ //上层圆环，显示数据
						value: this.setTemp,
						itemStyle: {
							color: this.chartColor[0]
						},
					}],
					barGap: '-100%', //柱间距离,上下两层圆环重合
					coordinateSystem: 'polar',
					roundCap: true, //顶端圆角从 v4.5.0 开始支持
					z: 2 //圆环层级，同zindex
				}, ]
			}



		},
		methods: {
			async sendComand(e) {
				const res = await this.$request({
					method: 'POST',
					url: 'cmd/send',
					data: e,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				uni.showToast({
					title: res.data.msg
				})
			},
			tempDown() {
				if (!this.deviceStatus) {
					uni.showToast({
						title: '请开启开关！',
						icon: 'error'
					});
					return
				}
				if (this.setTemp > 16 && this.deviceStatus) {
					this.setTemp -= 0.5
					this.reviewEchart()
					this.temperShowToast()
				} else {
					uni.showToast({
						title: "最低16度！"
					})
				}
			},
			tempUp() {
				if (!this.deviceStatus) {
					uni.showToast({
						title: '请开启开关！',
						icon: 'error'
					});
					return
				}
				if (this.setTemp < 30) {
					this.setTemp += 0.5
					this.reviewEchart()
					this.temperShowToast()
				} else {
					uni.showToast({
						title: "最高30度！"
					})
				}

			},
			gotoText(mess) {
				uni.navigateTo({
					url: "/subPages/pages/detail",
				});

			},
			sliderChange(e) {
				this.setHumility = e.detail.value
			},
			slider2change(e) {
				console.log(e)
			},

			share() {
				uni.showToast({
					title: "分享链接！"
				})
				this.$refs.shareRef.close();
			},
			humilityChange(e) {
				this.setHumility = e

			},
			async load() {

				const res = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: this.query,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				this.device = res.data.data
				console.log(this.device)

				const member = await this.$request({
					method: 'POST',
					url: 'account/search',
					data: {

						filter: {
							super_objectids: [
								uni.getStorageSync('user').objectid
							]
						}

					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				this.member = member.data.data
				console.log(this.member)

			},


			back() {
				uni.navigateBack()
			},
			settingLink() {
				if (!this.deviceStatus) {
					uni.showToast({
						title: '请开启开关！',
						icon: 'error'
					});
					return
				} else this.goto('device/setting?objectid=' + this.device.objectid)
			},
			deviceChange(e) {
				this.deviceStatus = e
				if (e) {
					//设备关
					this.sendComand({
						sn: this.device.sn,
						canid: this.device.canid,
						point: 'open',
						value: 0
					})


					this.option.series = [{
							type: 'bar',
							data: [{ //上层圆环，显示数据
								value: this.setTemp,
								itemStyle: {
									color: this.chartColor[0]
								},
							}],
							barGap: '-100%', //柱间距离,上下两层圆环重合
							coordinateSystem: 'polar',
							roundCap: true, //顶端圆角从 v4.5.0 开始支持
							z: 2 //圆环层级，同zindex
						}

					]

					this.menuCheck = 0

					this.menuStatus.filter((item, index) => {
						this.menuStatus[index] = this.menuIcon[index].normal
					})
				} else {
					this.sendComand({
						sn: this.device.sn,
						canid: this.device.canid,
						point: 'open',
						value: 1
					})
					this.option.series = [{
						type: 'bar',
						data: [{ //上层圆环，显示数据
							value: this.setTemp,
							itemStyle: {
								color: this.chartColor[1],
							},
						}],
						barGap: '-100%', //柱间距离,上下两层圆环重合
						coordinateSystem: 'polar',
						roundCap: true, //顶端圆角从 v4.5.0 开始支持
						z: 2 //圆环层级，同zindex
					}]

					this.menuCheck = 0

					this.menuStatus.filter((item, index) => {
						this.menuStatus[index] = this.menuIcon[index].off
					})
				}
			},
			up() {
				if (this.setHumility >= 0 && this.setHumility < 100) {
					this.setHumility += 1;
					this.$forceUpdate();
				}
				// this.$refs.progress.up();
			},
			down() {
				if (this.setHumility > 0 && this.setHumility <= 100) {
					this.setHumility -= 1;
					this.$forceUpdate();
				}
				// this.$refs.progress.down();
			},
			reviewEchart() {
				this.option.series = [{
						type: 'bar',
						data: [{ //上层圆环，显示数据
							value: this.setTemp,
							itemStyle: {
								color: this.chartColor[0]
							},
						}],
						barGap: '-100%', //柱间距离,上下两层圆环重合
						coordinateSystem: 'polar',
						roundCap: true, //顶端圆角从 v4.5.0 开始支持
						z: 2 //圆环层级，同zindex
					},

				]



			},
			menuOpen(e) {
				if (e !== 'share' && !this.deviceStatus) {
					uni.showToast({
						title: '请开启开关！',
						icon: 'error'
					});
					return
				}
				switch (e) {
					case "share":
						this.$refs.shareRef.open();
						break;
					case "adjust":
						this.menuFilter(0)
						this.$refs.adjustRef.open();
						break;
					case "wind":
						this.menuFilter(1)
						this.$refs.windRef.open();
						break;
					case "humidity":
						this.menuFilter(2)
						this.$refs.humidityRef.open();
						break;
					default:
						break;
				}
			},
			menuFilter(num) {
				this.menuCheck = num + 1
				this.menuStatus.filter((item, index) => {
					if (index === num) this.menuStatus[index] = this.menuIcon[index].on
					else this.menuStatus[index] = this.menuIcon[index].normal
				})
				this.menuStatus = [...this.menuStatus];
			},
			menuClose(e) {
				// uni.showToast({
				// 	title: '已关闭！',
				// 	icon: 'error'
				// });
				switch (e) {
					case "share":
						this.$refs.shareRef.close();
						break;
					case "adjust":
						this.menuCheck = 0
						this.menuStatus[0] = this.menuIcon[0].normal
						this.$refs.adjustRef.close();
						break;
					case "wind":
						this.menuCheck = 0
						this.menuStatus[1] = this.menuIcon[1].normal
						this.$refs.windRef.close();
						break;
					case "humidity":
						this.menuCheck = 0
						this.menuStatus[2] = this.menuIcon[2].normal
						this.$refs.humidityRef.close();
						break;
					default:
						break;
				}
			},

			checkWind(e) {
				this.wind[this.checked[1]].check = false
				this.wind[e].check = true
				this.checked[1] = e
				this.tempMenu[1] = this.wind[e].name
			},
			checkAdjust(e) {

				this.adjust[this.checked[0]].check = false
				this.adjust[e].check = true
				this.checked[0] = e
				this.tempMenu[0] = this.adjust[e].name
			},
			adjustShowToast() {
				this.sendComand({
					sn: this.device.sn,
					canid: this.device.canid,
					point: "7",
					value: this.checked[0]
				})
			},
			windShowToast() {
				this.sendComand({
					sn: this.device.sn,
					canid: this.device.canid,
					point: "8",
					value: this.wind[this.checked[1]].value
				})
			},
			humilityShowToast() {
				this.sendComand({
					sn: this.device.sn,
					canid: this.device.canid,
					point: "12",
					value: this.setHumility
				})
			},
			temperShowToast() {
				this.sendComand({
					sn: this.device.sn,
					canid: this.device.canid,
					point: "11",
					value: this.setTemp * 10
				})

			},
			showToast() {

				// this.sendComand({
				// 	sn: this.deice.sn,
				// 	canid: this.deice.canid,
				// 	point: "8",
				// 	value: this.checked[0]
				// })

				uni.showToast({
					title: "下发成功！"

				})

			},
			confirmMenu(e) {
				if (this.device.model === "4")
					switch (e) {

						case "adjust":
							if (!this.tempMenu[0]) {
								uni.showToast({
									title: "请选择！",
									icon: 'error'
								})
								return
							}
							this.type[0].value = this.tempMenu[0]
							this.$refs.adjustRef.close();
							this.adjustShowToast()
							break;
						case "wind":

							if (!this.tempMenu[1]) {
								uni.showToast({
									title: "请选择！",
									icon: 'error'
								})
								return
							}
							this.type[1].value = this.tempMenu[1]
							this.$refs.windRef.close();
							this.windShowToast()
							break;
						case "humidity":

							this.type[2].value = this.setHumility + "%"

							this.$refs.humidityRef.close();
							this.humilityShowToast()
							break;
						default:
							break;

							uni.showToast({
								title: '已开启'
							})
					}


				else {
					uni.showToast({
						title: "未开放",
						icon: "error"
					})
				}
			},

			alertConfirm(e) {

				if (!this.tempMenu[e]) {
					uni.showToast({
						title: "请选择！",
						icon: 'error'
					})
					return
				}
				this.type[e].value = this.tempMenu[e]
			},

			canvasIdErrorCallback: function(e) {
				console.error(e.detail.errMsg)
			},


			bindClick(num) {
				if (!num.objectid) return



			},
			goto(mess) {
				uni.navigateTo({
					url: "/pages/" + mess,
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
		},
		options: {
			styleIsolation: 'shared'
		}

	}
</script>

<style lang="scss" scoped>
	page {
		background: rgb(249, 249, 249);
	}

	.main {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		//padding: 0 20px 85px;
		background: url("../../static/deviceback.png") 100% no-repeat;
		background-size: 100% 100%;
		position: relative;

		.head {
			padding: 0 10px 10px;

			.location {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 17px;
				color: rgba(51, 51, 51, 1);
				font-size: 18px;
				font-weight: 600;
				position: relative;

				.text {
					width: 180px;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
				}

				//margin: 17px 0px;
				.left {

					padding: 0 10px 0 10px;
					margin-left: -10px;

					image {
						width: 8px;
						height: 14px;
					}



				}

				.right {
					width: 21px;
					height: 18px;
					z-index: 2
				}
			}

			.name {
				color: rgba(102, 102, 102, 1);
				font-size: 14px;
				line-height: 14px;
				text-align: center
			}
		}

		.middle {
			background-color: white;
			height: 100%;
			width: 100%;

			border-radius: 30px 30px 0px 0px;
			box-sizing: border-box;
			padding: 36px 14px 8px 14px;

			.title {
				display: flex;
				justify-content: space-between;

				.box {
					display: flex;

					image {
						width: 59px;
						height: 37px;
					}

					.name {
						margin-left: 12px;
						display: flex;
						flex-direction: column;




						.text-name {
							line-height: 14px;
							margin-bottom: 9px;
							overflow: hidden;
						}

						.text-temper {
							color: rgba(102, 102, 102, 1);
							font-size: 12px;
							line-height: 17px;
						}
					}
				}


				.data {
					color: rgba(0, 139, 137, 1);
					font-size: 14px;
					line-height: 14px;
				}
			}


			.pattern {
				display: flex;
				justify-content: space-between;
				margin-top: 20px;

				.pattern-margin {
					margin: 0 10px;
				}

				.pattern-box {
					box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
					flex: 1;
					border-radius: 8px;
					padding: 12px 0px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					image {
						width: 20px;
						height: 20px;
						margin-bottom: 10px;
					}

					text {

						color: rgba(153, 153, 153, 1);
						line-height: 20px;

					}
				}

				.gap {
					margin-right: 10px;
				}

				.close {
					background-color: rgba(246, 246, 246, 1);
					color: rgba(187, 187, 187, 1);
				}

				.green {
					background: rgba(210, 232, 232, 1);

					text {
						color: rgba(0, 139, 137, 1);
					}
				}
			}

			.temper {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20px;

				.down {

					width: 24px;
					height: 24px;
					display: flex;
					align-items: center;

					image {
						width: 24px;
						height: 3px;
					}


				}

				.echart {

					margin: 0 10px;
					width: 170px;
					height: 160px;
					position: relative;

					.font {
						position: absolute;
						display: flex;
						// align-items: flex-start;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);


						.name {
							color: black;
							font-size: 35px;
							font-weight: 600;
						}

						.value {
							font-weight: 600;
							color: rgb(153, 153, 153);
							font-size: 21px;
							position: relative;

							.hide {
								visibility: hidden;
							}

							.move {
								position: absolute;
								top: -15px;
								left: 1px
							}
						}

						.hide {}

					}


					.echarts {
						width: 100%;
						height: 100%;
					}

				}

				.up {

					width: 24px;
					height: 24px;
				}

				.progress {
					position: relative;
					margin: 0 10px;

					.value {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						overflow-wrap: break-word;
						color: rgba(51, 51, 51, 1);
						font-size: 40px;

						font-weight: 600;

						line-height: 56px;
					}

					.item {
						position: absolute;
						left: 50%;
						bottom: 10%;
						transform: translateX(-50%);
						color: rgba(153, 153, 153, 1);
						font-size: 12px;
						line-height: 17px;

					}
				}



			}


			.type {
				display: flex;
				justify-content: space-between;
				margin-top: 20px;

				.normal-border {
					position: relative;

					&::after {
						content: '';
						position: absolute;
						width: 1px;
						height: 50%;
						background: rgb(221, 221, 221);
						right: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}

				.border {
					position: relative;

					&::before {
						content: '';
						position: absolute;
						width: 1px;
						height: 50%;
						background: rgb(221, 221, 221);
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}

					&::after {
						content: '';
						position: absolute;
						width: 1px;
						height: 50%;
						background: rgb(221, 221, 221);
						right: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}

				.font {
					text-align: right;

				}

				.type-box {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;

					.name {
						color: rgba(51, 51, 51, 1);
						font-size: 18px;
						line-height: 25px;

					}

					.value {
						margin-bottom: 5px;
						color: rgba(153, 153, 153, 1);
						font-size: 14px;
						line-height: 20px;
					}
				}

			}
		}

		.share {


			.share-box {
				box-sizing: border-box;
				padding: 10px;

				.share-add {

					display: flex;
					justify-content: center;
					align-items: center;
					margin: 30px 0px;

					image {
						width: 14px;
						height: 14px;
						margin-right: 5px;
					}

					text {
						color: rgba(0, 139, 137, 1);
						font-size: 16px;
						line-height: 22px;
					}

				}


				.margin {
					margin-top: 10px;
				}

				.item {
					display: flex;
					justify-content: space-between;
					align-items: center;


					.left {
						display: flex;
						align-items: center;

						.photo {
							width: 44px;
							height: 44px;
							box-shadow: 0 0 3px rgb(221, 221, 221);
							border-radius: 50%
						}

						text {
							color: rgba(51, 51, 51, 1);
							font-size: 16px;
							line-height: 22px;
							margin-left: 11px;
						}
					}
				}

				.icon {
					width: 20px;
					height: 20px;
				}
			}

			.adjust-box {
				box-sizing: border-box;
				padding: 10px;

				.margin {
					margin-top: 30px;
				}

				.check {
					color: rgba(0, 139, 137, 1);
				}

				.item {
					display: flex;
					position: relative;
					justify-content: center;
					align-items: center;


					.left {
						display: flex;
						align-items: center;

						.photo {
							width: 44px;
							height: 44px;
						}

						text {

							color: rgba(51, 51, 51, 1);
							font-size: 16px;
							line-height: 22px;
						}
					}
				}

				.icon {
					position: absolute;
					right: 20px;
					width: 13px;
					height: 9px;
				}
			}

			.adjust-foot {
				display: flex;
				width: 100%;

				view {
					width: 50%;
					text-align: center
				}

				.confirm {
					color: rgba(0, 139, 137, 1);
				}
			}

			.humidity-box {
				padding: 0 30px;

				.font {
					margin: 20px 0;
					text-align: center;
					color: rgba(51, 51, 51, 1);
					font-size: 48px;

					font-weight: 600;

					line-height: 67px;
				}

				.scroll {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 40px;

					/deep/ uni-slider .uni-slider-handle-wrapper {
						height: 7px !important;
					}

					/deep/ uni-slider .uni-slider-thumb {
						// position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					/deep/ uni-slider .uni-slider-thumb::before {
						content: '';
						position: absolute;
						width: 10px;
						height: 10px;
						border-radius: 50%;
						background: white;
					}

					/deep/ wx-slider .wx-slider-thumb {
						// position: relative;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					/deep/ wx-slider .wx-slider-thumb::before {
						content: '';
						position: absolute;
						width: 10px;
						height: 10px;
						border-radius: 50%;
						background: white;
					}

					/deep/ wx-slider .wx-slider-handle-wrapper {
						height: 7px !important;
					}





					.progress {
						margin: 0 20px;
						flex: 1;
					}

					.down {
						width: 20px;
						height: 20px;
						display: flex;
						align-items: center;

						image {
							width: 20px;
							height: 2px;

						}

					}

					.up {
						width: 20px;
						height: 20px;
					}
				}


			}
		}

		.foot {
			height: 54px;
			position: fixed;
			width: 100%;
			bottom: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 10px;
			box-sizing: border-box;

			text {

				color: rgba(0, 139, 137, 1);
				font-size: 16px;
				line-height: 22px;

			}

			.open {
				width: 54px;
				height: 54px;
				position: absolute;
				left: 50%;
				bottom: 0px;
				transform: translateX(-50%)
			}

			.setting {
				width: 30px;
				height: 29px;
			}
		}
	}
</style>
