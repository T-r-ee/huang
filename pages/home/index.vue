<template>
	<view class="main">
		<view class="head">
			<view class="location"
				:style="{ 'padding-top':position.top+'px','margin-right':position.right+'px','height':position.height+'px'}">
				<view class="left"> <text>{{user.username}}的家</text>
					<image class="icon_1" referrerpolicy="no-referrer" src="../../static/down.png"></image>
				</view>

				<image class="right" @click="goto('home/message/index')" src="../../static/msg.png"></image>

			</view>

			<view class="topic">
				<view class="topic-top">
					<view class="temp">
						<view class="local" @click="getAddress()">
							<image class="icon_1" referrerpolicy="no-referrer" src="../../static/location.png"></image>
							<text>{{location}}</text>
						</view>
						<view class="local-msg">
							<text>15°C-22°C</text>
							<image referrerpolicy="no-referrer" src="../../static/midLine.png"></image>
							<text>多云</text>
						</view>

					</view>
					<view class="weather">
						<image referrerpolicy="no-referrer" src="../../static/cloud.png"></image>
					</view>
				</view>
				<view class="topic-btm">
					<view v-for="(item, index) of topic" :key="index">
						<view class="title" :class="[index === 0 ? 'left' : '']">{{
              item.name
            }}</view>
						<view class="value">{{ item.value }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="middle">
			<view class="middle-box">
				<view class="middle-title" v-for="(item,index) of title" :key="index">
					<text @click="checkItem(index)" :class="[ item.check?'choose':'']">{{item.name}}</text>
				</view>
			</view>
			<view class="more-menu">
				<image @click="showMenu" class="more" referrerpolicy="no-referrer" src="../../static/more.png"></image>


				<uni-popup ref="menuRef" type="custom">
					<view class="popup">
						<view class=" device   margin ]" @click="menuClick('全屋')">
							<view class="name">
								全屋
							</view>
							<view class="value">
								{{deviceNum||0}}
							</view>
						</view>

						<view :class="['device',index!==menu.length-1?'margin':'']" v-for="(item,index) of menu"
							:key="index" @click="menuClick(item.name)">
							<view class="name">
								{{item.name}}
							</view>
							<view class="value">
								{{item.value}}
							</view>

						</view>
						<image class="image" src="../../static/line.png"></image>
						<view class="manager">

							<view class="device" @click="goto('home/space/index')">
								<view class="name margin">
									空间管理
								</view>
								<image class="manager-icon" src="../../static/manageron.png"></image>

							</view>

							<view class="device" @click="searchAll()">
								<view class="name">
									全部设备
								</view>

								<image class="icon" src="../../static/searchon.png"></image>

							</view>
						</view>
						<image class="image" src="../../static/line.png"></image>
						<view class="add" @click="deviceAdd('device/add')">

							添加设备

							<image class="icon" src="../../static/adddevice.png"></image>

						</view>
						<view class="bottom"></view>
					</view>
				</uni-popup>

			</view>



		</view>

		<view class="nodevice" v-if="!checkDevice.length">

			<image class="icon_1" referrerpolicy="no-referrer" src="../../static/nodevice.png"></image>
			<view>暂无设备，请<button style="" @click="deviceAdd('device/add')">添加</button>设备</view>
		</view>



		<view class="content" v-if=" checkDevice.length ">
			<view v-for="(item,index) of  checkDevice" class="box" :key="index">
				<view class="box1">
					<!-- device/index -->
					<view class="mess" @click="gotoText(item.objectid)">
						<view class="mess-top">
							<view class="air1">
								<image class="icon_1" referrerpolicy="no-referrer" :src="getImageUrl(item.model)">
								</image>

								<view class="value">{{ item.name ? item.name:''}}</view>
							</view>
							<view class="font">{{item.location||'全屋'}}</view>

						</view>
						<view class="mess-mid">
							<view class="property">
								<text class="name">温度</text>
								<text
									class="value">{{ item.info?item.info.temperature?item.info.temperature:'暂无':'暂无' }}</text>

							</view>

							<view class="property">
								<text class="name">湿度</text>
								<text
									class="value">{{item.info? item.info.humidity?item.info.humidity :'暂无' :'暂无'}}</text>

							</view>


							<view class="property" v-if="item.model==='8'">
								<text class="name">设置</text>

								<text :class="['status',item.set ?'green':'']" @click="setStatus(!item.set,index)">设置
								</text>
							</view>


						</view>
						<image class="mess-line" referrerpolicy="no-referrer" src="../../static/line.png"></image>
						<view class="mess-btm" catchtap="stopTag">
							<view><text :class="[  item.info?(!item.info.open?'check':''):'check' ]">关 </text>
								<text class="mess-margin">/</text>
								<text :class="[item.info?(item.info.open?'check':''):'']"> 开</text>
							</view>
							<image class="icon_1" v-if="item.switch" referrerpolicy="no-referrer"
								src="../../static/open.png" @click="deviceStatus(0,item )"></image>
							<image class="icon_1" v-else referrerpolicy="no-referrer" @click="deviceStatus(1,item)"
								src="../../static/closeoff.png">
							</image>
						</view>
					</view>
				</view>

			</view>
			<!-- 	@click="goto('home/list')" -->
			<view :class="['edit', checkDevice.length%2===0?'double':''] " @click="spaceEdit()" checkDevice>
				<button>编辑</button>
			</view>
		</view>


		<proup ref="humidityRef" title='加湿湿度' class="share" @maskClick="proupClose()">
			<template v-slot:content>
				<view class="humidity-box">
					<view class="space">
						<text class="name">开关</text>
						<switch color="rgb(0,139,137)" checked />
					</view>
					<view class="space">
						<text class="name">设置</text>
						<text class="value">{{setHumility}}</text>
					</view>

					<view class="scroll">
						<div class="down" @click="down()">
							<image src="../../static/jian.png"></image>
						</div>
						<slider activeColor="#008C8B" block-color="#008C8B" v-model="setHumility" style="flex: 1;"
							min="0" max="100" step="1" block-size="20" @changing="sliderChange" />
						<image src="../../static/jia.png" class="up" @click="up()"></image>
					</view>




				</view>

			</template>

			<template v-slot:foot>
				<view class="adjust-foot">
					<view @click="proupClose()">取消</view>
					<view @click="menuConfirm()" class="confirm">确定</view>
				</view>

			</template>
		</proup>

		<view class="placeholder"></view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				quality: {},
				location: "请打开定位",
				setHumility: 0,
				position: {
					top: '30',
					right: "0",
					height: ''
				},
				menu: [],
				isMenuVisible: false,
				menuStyle: '',
				page: null,
				acc: 0,
				options1: [{
					text: '删除',
					style: {
						backgroundColor: 'rgba(224, 32, 32, 1)'
					}
				}],
				title: [{
						name: '全屋',
						check: true,
						list: []
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
				checkDevice: [],
				device: [],
				status: [],
				operateIndex: 0,
				setDevice: [],
				menuCheck: 0,
				cs: false,
				user: {},
				deviceNum: 0,
			};
		},
		onShow() {
			this.load()
			this.$refs.menuRef.close();
		},
		mounted() {

			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}


			this.asyncQuality()
		},

		methods: {
			stopTag() {},
			searchAll() {

				this.checkItem(0)
				this.$refs.menuRef.close();
			},
			sliderChange(e) {
				this.setHumility = e.detail.value
				console.log(e)
			},
			async asyncQuality() {

				const res = await this.$request({
					method: 'POST',
					url: 'device/search',
					data: {
						filter: {
							account_objectid: uni.getStorageSync('user').objectid,
							model: '9'
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) {
					this.quality = res.data.data[0].info
					console.log(this.quality)
					this.topic[0].value = (this.quality.temperature ||
						"30.3") + "℃/" + (this.quality.humidity || "70") + "%"

					this.topic[1].value = this.quality.pm25 || "13.0"
					this.topic[2].value = this.quality.pm10


				}
			},
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
			getAddress() {

				uni.chooseLocation({
					success: (res) => {
						console.log(res.address)
						this.location = res.address
					}
				});

			},
			spaceEdit() {
				this.goto('home/edit?space=' + this.title[this.menuCheck].id)
			},
			change() {},
			humilityChange(e) {
				this.setHumility = e

			},
			menuClick(mes) {
				uni.showToast({
					title: mes
				})
				this.$refs.menuRef.close();

			},

			setStatus(status, index) {

				this.operateIndex = index
				if (status) {
					uni.hideTabBar()

					this.$refs.humidityRef.open();


				} else {
					// uni.showTabBar()
					// uni.showToast({
					// 	title: '已关闭！'
					// })
				}

				this.checkDevice[index].set = status


			},


			myLocation() {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						//this.longitude=res.longitude;
						//this.latitude=res.latitude; 
						uni.openLocation({
							latitude: Number.parseFloat(res.latitude),
							longitude: Number.parseFloat(res.longitude),
							address: location,
							success: function() {
								// console.log('success');
							}
						});
					}
				})
			},
			tomap(longitude, latitude, location) {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						console.log("latitude", Number.parseFloat(latitude));
						console.log("longitude", Number.parseFloat(longitude));
						console.log(location)

						uni.openLocation({

							latitude: Number.parseFloat(latitude),
							longitude: Number.parseFloat(longitude),
							address: location,
							success: function() {
								// console.log('success');
							}
						});
					}
				})
			},



			async deviceStatus(status, item) {
				// event ? event.stopPropagation() : ''
				switch (item.model) {
					case '4':
						this.sendComand({
							sn: item.sn,
							canid: item.canid,
							point: "6",
							value: status ? 1 : 0
						})
						this.load()
						break;

					default:
						uni.showToast({
							title: "未开放！",
							icon: "error"
						})
						break;
				}




			},
			proupOpen() {
				uni.hideTabBar()

				this.cs = true
			},
			menuConfirm() {
				//操作设备
				// this.sendComand({
				// 	sn: item.sn,
				// 	canid: item.canid,
				// 	point: 'RW',
				// 	value: 40
				// })
				// uni.showToast({
				// 	title: '已开启!'
				// })
				uni.showTabBar()

				this.cs = false
			},
			proupClose() { //关闭不操作加湿
				uni.showTabBar()
				this.cs = false
				this.checkDevice[this.operateIndex].set = false

			},
			checkItem(index) {
				if (!index) this.checkDevice = this.device
				else {

					this.checkDevice = []
					this.device.filter(item => {
						if (item.location === this.title[index].name)
							this.checkDevice.push(item)
					})

				}
				this.title[this.menuCheck].check = false
				this.title[index].check = true
				this.menuCheck = index
			},
			getImageUrl(mes) {
				let path = '../../static/'
				switch (mes) {
					case '4':
						path = path + 'air1.png'
						break;
					case '8':
						path = path + 'air2.png'
						break;
					case '6':
						path = path + 'air3.png'
						break;
					default:
						path = path + 'air1.png'
						break;
				}

				return path;
			},
			showMenu() {
				this.$refs.menuRef.open();

			},
			hideMenu() {
				this.isMenuVisible = false;
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
			async load() {
				this.user = uni.getStorageSync('user')
				const space = await this.$request({
					method: 'POST',
					url: 'space/search',
					data: {
						filter: {
							account_objectid: uni.getStorageSync('user').objectid
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (space.data.code === 200) {
					let spaceItem = space.data.data
					this.title = [{
						name: '全屋',
						check: true,
						id: '',
						list: []
					}]
					this.menu = []
					spaceItem.filter(async (item, index) => {
						index < 3 ? this.title.push({
							name: item.name,
							check: false,
							id: item.objectid,
							list: []
						}) : ''




						const msg = await this.$request({
							method: 'POST',
							url: 'device/search',
							data: {
								filter: {
									account_objectid: uni.getStorageSync('user').objectid,
									location: item.name
								}
							},
							header: {
								'Authorization': `Bearer ${uni.getStorageSync('token')}`,
							}

						})
						let num = 0
						if (msg.data.all) {
							num = msg.data.all

						}
						this.menu.push({
							name: item.name,
							value: num
						})

						// if (index === this.spaceItem.length - 1) {
						// 	this.menuDesc = this.menu
						// }

					})

				}


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
				this.deviceNum = res.data.all
				this.device = res.data.data
				this.setDevice = [0]
				this.device.filter((item, index) => {

					if (item.model === 'xfxt') this.device[index].set = true

				})

				this.checkDevice = JSON.parse(JSON.stringify(this.device)) //[...this.device]

				console.log(this.device)


			},
			deviceAdd(mess) {

				uni.scanCode({
					success: function(res) {
						uni.showToast({
							title: "扫码成功"
						})
					}
				});

			},
			goto(mess) {
				uni.navigateTo({
					url: "/pages/" + mess,
				});
			},
			gotoText(mess) {

				uni.navigateTo({
					url: "/subPages/pages/index?objectid=" + mess,
				});

			}
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
		overflow: scroll;
		box-sizing: border-box;
		padding: 0 20px 85px;
		background: url("../../static/homeBack.png") 100% no-repeat;
		background-size: 100% 100%;
		position: relative;

		.head {


			.location {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 17px;

				//margin: 17px 0px;
				.left {
					display: flex;
					align-items: center;

					image {
						width: 14px;
						height: 8px;
						margin-left: 20px;
					}

					text {

						color: rgba(51, 51, 51, 1);
						font-size: 18px;
						font-weight: 600;
						line-height: 20px;
					}
				}

				.right {
					width: 21px;
					height: 18px;
					// margin-right: 80px;
				}
			}

			.topic {
				background: white;
				display: flex;
				border-radius: 4px;
				padding: 9px 20px 12px 20px;
				box-sizing: border-box;
				flex-direction: column;
				justify-content: space-between;

				.topic-top {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.temp {

						overflow-wrap: break-word;
						color: rgba(51, 51, 51, 1);
						display: flex;
						flex-direction: column;
						justify-content: center;

						.local {
							display: flex;

							image {
								width: 16px;
								height: 16px;
								margin: 2px;
								margin-right: 5px;
							}

							text {

								font-size: 14px;
								text-align: left;
								white-space: nowrap;
								line-height: 20px;
							}
						}

						.local-msg {
							margin-top: 15px;
							display: flex;
							align-items: center;

							text {
								color: rgba(51, 51, 51, 1);
								font-size: 16px;
								line-height: 22px;


							}

							image {
								width: 1px;
								height: 14px;
								margin: 0 20px;
							}
						}
					}

					.weather {
						display: flex;
						align-items: center;

						image {
							width: 50px;
							height: 47px;
							margin-right: 5px;
						}


					}
				}

				.topic-btm {
					display: flex;
					justify-content: space-between;

					.title {
						color: rgba(153, 153, 153, 1);
						font-size: 12px;
						line-height: 17px;
						margin: 12px 0 8px 0;

						text-align: center;
					}

					.left {
						text-align: left;
					}

					.value {
						color: rgba(51, 51, 51, 1);
						font-size: 14px;
						text-align: left;
						line-height: 20px;
						text-align: left;
					}
				}
			}
		}

		.middle {
			position: relative;
			display: flex;
			justify-content: space-between;
			margin-top: 30px;


			.middle-box {
				display: flex;

				.middle-title {
					display: flex;

					text {
						color: rgba(153, 153, 153, 1);
						font-size: 21px;
						margin-right: 26px;
					}

					.choose {
						color: rgba(51, 51, 51, 1);
						font-size: 21px;
						font-weight: 600;

					}
				}
			}


			.more-menu {
				position: relative;



				.more {

					right: 0;
					width: 26px;
					height: 26px;
				}

				.popup {
					background: white;
					overflow: scroll;
					border-radius: 6px;
					padding: 20px 20px 0;
					box-sizing: border-box;
					width: 150px;

					.image {
						width: 100%;
						height: 1px;
						display: flex;
						margin: 10px 0;
					}

					.margin {
						margin-bottom: 20px;
					}

					.device {
						display: flex;
						justify-content: space-between;
						font-size: 14px;


						.name {
							color: rgba(51, 51, 51, 1);
						}

						.value {
							color: rgba(153, 153, 153, 1);
						}
					}

					.manager {
						.icon {
							width: 20px;
							height: 20px;
						}

						.manager-icon {
							width: 20px;
							height: 17px;
						}
					}

					.add {
						display: flex;
						justify-content: space-between;
						color: rgba(0, 139, 137, 1);
						align-items: center;

						.icon {
							width: 20px;
							height: 20px;
						}
					}

					.bottom {
						width: 1px;
						height: 20px
					}
				}

				.menu {
					z-index: 999;
					position: absolute;
					right: 20px;
					width: 100px;

					background-color: #fff;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
					border-radius: 5px;
					padding: 10px;
					box-sizing: border-box;

					.menu-item {
						line-height: 30px;
						padding: 5px;
					}
				}


			}





		}

		.nodevice {
			margin-top: 50px;
			display: flex;
			flex-direction: column;
			color: rgba(153, 153, 153, 1);
			align-items: center;

			image {
				width: 170px;
				height: 120px;
				margin-bottom: 17px;
			}

			view {

				display: flex;

				button {
					background-color: rgb(0, 139, 137);
					border-radius: 11px;

					padding: 1px 9px 1px 9px;
					color: rgba(255, 255, 255, 1);
					box-sizing: border-box;
					font-size: 14px;
					line-height: 20px;
					margin: 0 4px;
				}
			}
		}

		.all {
			display: flex;
			flex-direction: column;
			justify-content: center;

			.noall {
				background-color: rgba(255, 255, 255, 1);
				border-radius: 6px;
				display: flex;
				flex-direction: column;
				width: 100%;
				justify-content: center;
				align-items: center;
				margin-top: 10px;
				padding: 21px 0px;

				image {
					width: 154px;
					height: 110px;
				}

				view {

					color: rgba(153, 153, 153, 1);
					font-size: 14px;

					line-height: 20px;

				}
			}

			button {
				background-color: rgba(255, 255, 255, 1);
				border-radius: 22px;
				color: rgba(51, 51, 51, 1);
				font-size: 14px;
				font-weight: 600;
				padding: 14px 25px 14px 25px;
				line-height: 14px;
				margin-top: 20px;
			}

			button::after {
				border: none;

			}
		}

		.content {

			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-auto-rows: auto;
			grid-gap: 10px;
			margin-top: 17px;

			.box {
				background-color: rgba(255, 255, 255, 1);
				border-radius: 4px;
				// margin-top: 17px;
				padding: 15px 10px 8px 11px;
				box-sizing: border-box;

				.box1 {
					display: flex;
					align-items: center
				}


				.device-icon {
					margin-right: 19px;
					width: 50px;
					height: 60px;
				}

				.mess {
					width: 100%;
					font-size: 14px;

					.mess-top {
						margin-bottom: 14px;
						display: flex;
						justify-content: space-between;
						// align-items: center;
						color: rgba(51, 51, 51, 1);
						// font-size: 16px;
						line-height: 22px;

						.font {
							min-width: 28px;

						}

						.air1 {
							font-size: 16px;
							display: flex;
							flex-direction: column;

							.value {
								color: rgba(51, 51, 51, 1);
								font-size: 16px;
								font-weight: 500;
								margin-top: 15px;
							}

							image {

								width: 39px;
								height: 26px;
							}

						}

					}

					.mess-mid {
						display: flex;
						justify-content: space-between;

						.property {
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							.name {
								overflow-wrap: break-word;
								color: rgba(102, 102, 102, 1);

								line-height: 20px;
							}



							.value {
								margin-top: 10px;
								color: rgb(0, 139, 137);
							}

							.status {
								border-radius: 5px;

								border: 1px solid rgba(221, 221, 221, 1);
								overflow-wrap: break-word;
								color: rgba(187, 187, 187, 1);
								font-size: 14px;
								line-height: 20px;
								box-sizing: border-box;
								padding: 0 7px;
							}

							.green {
								color: rgb(0, 139, 137);
								border: 1px solid rgb(0, 139, 137);
							}
						}
					}

					.mess-line {
						width: 100%;
						height: 1px;
					}

					.mess-btm {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 12px;
						line-height: 17px;
						color: rgba(153, 153, 153, 1);

						.mess-margin {
							margin: 0 3px
						}

						.check {
							color: rgba(51, 51, 51, 1);
						}

						image {
							width: 30px;
							height: 30px;
						}
					}

					.green-font {
						color: green;
					}

					.red-font {
						color: red;
					}


				}
			}

			.double {
				margin-top: 30px;
			}

			.edit {
				// background: red;
				display: flex;
				justify-content: center;
				align-items: center;

				// height: 100%;

				button {
					border-radius: 22px;
					padding: 15px 26px;
					background: white;
					color: rgba(51, 51, 51, 1);
					font-size: 14px;
					font-weight: 600;
					line-height: 14px;
				}

				button::after {
					border: none;
				}
			}
		}

		.placeholder {
			height: 80px;
			width: 100%
		}

		.humidity-box {

			padding: 16px 25px 0px;

			.space {
				display: flex;
				justify-content: space-between;
				margin-bottom: 17px;

				.name {

					font-size: 14px;
					font-weight: 400;
					color: #999999;
					line-height: 20px;
					margin-bottom: 16px
				}

				.value {
					font-size: 18px;
					font-weight: 600;
					color: #333333;
					line-height: 25px;
				}

				/deep/ uni-switch {
					display: flex;
				}

				/deep/ .uni-switch-input {
					width: 40px;
					height: 20px;
					margin-right: 0px;
				}

				/deep/.uni-switch-input:before {
					height: 0px;
				}

				/deep/.uni-switch-input:after {
					width: 18px;
					height: 18px;
				}
			}

			.scroll {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 33px;
				height: 20px;



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
	}
</style>
