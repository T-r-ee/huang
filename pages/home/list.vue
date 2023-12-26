<template>
	<view class="main">
		<view class="head" :style="{ 'padding-top':position.top+'px' }">
			<view class="location" :style="{  'height':position.height+'px'}">
				<view class="left"> <text>昭昭的家</text>
					<image class="icon_1" referrerpolicy="no-referrer" src="../../static/down.png"></image>
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

				<uni-popup ref="menuRef" type="custom" @maskClick="maskClick( )">
					<view class="popup">
						<view :class="['device',index!==5?'margin':'']" v-for="(item,index) of menu" :key="index"
							@click="menuClick(item.name)">
							<view class="name">
								{{item.name}}
							</view>
							<view class="value">
								{{item.value}}
							</view>

						</view>
						<image class="image" src="../../static/line.png"></image>
						<view class="manager">

							<view class="device" @click="menuClick('空间管理')">
								<view class="name margin">
									空间管理
								</view>
								<image class="manager-icon" src="../../static/manageron.png"></image>

							</view>

							<view class="device" @click="menuClick('全部设备')">
								<view class="name">
									全部设备
								</view>

								<image class="icon" src="../../static/searchon.png"></image>

							</view>
						</view>
						<image class="image" src="../../static/line.png"></image>
						<view class="add" @click="goto('device/add')">

							添加设备

							<image class="icon" src="../../static/adddevice.png"></image>

						</view>
						<view class="bottom"></view>
					</view>
				</uni-popup>

			</view>



		</view>

		<!-- <view class="nodevice" v-if="!device[0] ">
			<image class="icon_1" referrerpolicy="no-referrer" src="../../static/nodevice.png"></image>
			<view>暂无设备，请<button style="" @click="goto('device/add')">添加</button>设备</view>
		</view>
	 -->
		<view class="all" v-if="!checkDevice.length">
			<view class="noall">
				<image referrerpolicy="no-referrer" src="../../static/noall.png"></image>
				<view>房间内无设备</view>
			</view>
			<button class="edit" @click="goto('device/add')">添加</button>
		</view>


		<view class="content" v-if=" checkDevice.length ">
			<view v-for="(item,index) of  checkDevice" class="box" :key="index">
				<view class="box1">

					<view class="mess">
						<view class="mess-top" @click="goto('device/index?objectid='+item.objectid)">
							<view class="air1">
								<image class="icon_1" referrerpolicy="no-referrer" :src="getImageUrl(item.model)">
								</image>

								<text>{{ item.name ? item.name:''}}</text>
							</view>
							<view class="">{{item.location}}</view>

						</view>
						<view class="mess-mid">
							<view class="property">
								<text class="name">温度</text>
								<text class="value">{{ item.temperature }}</text>

							</view>

							<view class="property">
								<text class="name">湿度</text>
								<text class="value">{{ item.humidity }}</text>

							</view>


							<view class="property" v-if="item.model==='xfxt'">
								<text class="name">设置</text>

								<text :class="['status',item.set ?'green':'']" @click="setStatus(!item.set,index)">设置
								</text>
							</view>


						</view>
						<image class="mess-line" referrerpolicy="no-referrer" src="../../static/line.png"></image>
						<view class="mess-btm">
							<view><text :class="[!item.switch?'check':'']">关 </text>
								<text class="mess-margin">/</text>
								<text :class="[item.switch?'check':'']"> 开</text>
							</view>
							<image class="icon_1" v-if="item.switch" referrerpolicy="no-referrer"
								src="../../static/open.png" @click="deviceStatus(0,item.objectid,item.name)"></image>
							<image class="icon_1" v-else referrerpolicy="no-referrer"
								@click="deviceStatus(1,item.objectid,item.name)" src="../../static/closeoff.png">
							</image>
						</view>
					</view>
				</view>

			</view>
			<view :class="['edit', checkDevice.length%2===0?'double':''] " checkDevice><button
					@click="goto('home/edit')">编辑</button></view>
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
						<image src="../../static/jian.png" class="down" @click="down()"></image>

						<bestjhh-movable-area ref="progress" :show="false" class="progress" :max='100' :min='0'
							@change='change' @scoreChange='humilityChange($event)'>
						</bestjhh-movable-area>

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
				setHumility: "0",
				position: {
					top: '30',
					right: "0",
					height: ''
				},
				menu: [{
						name: '全屋',
						value: 3
					}, {
						name: '中厅',
						value: 3
					}, {
						name: '外廊',
						value: 3
					},
					{
						name: '内厅',
						value: 3
					}, {
						name: '二楼水吧',
						value: 3
					}, {
						name: '共享设备',
						value: 3
					}
				],
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
					},
					{
						name: '中厅',
						check: false,
						list: []
					},
					{
						name: '外廊',
						check: false,
						list: []
					},
					{
						name: '内厅',
						check: false,
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
				setDevice: []
			};
		},

		mounted() {

			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				this.position.right = menuButtonInfo.width
			}

			this.load()

		},
		methods: {
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
					uni.showTabBar()
					uni.showToast({
						title: '已关闭！'
					})
				}

				this.checkDevice[index].set = status


			},
			async deviceStatus(status, id, name) {

				const res = await this.$request({
					method: 'POST',
					url: 'device/update',
					data: {
						objectid: id,
						data: {
							switch: status
						}
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200)
					uni.showToast({
						title: name + "设备" + (status ? "打开" : "关闭")
					})
				this.load()

			},
			proupOpen() {
				uni.hideTabBar()
				this.$refs.humidityRef.open();
			},
			menuConfirm() {
				//操作设备
				uni.showToast({
					title: '已开启!'
				})
				uni.showTabBar()
				this.$refs.humidityRef.close();
			},
			proupClose() { //关闭不操作加湿
				uni.showTabBar()
				this.$refs.humidityRef.close();
				this.checkDevice[this.operateIndex].set = false

			},
			checkItem(index) {
				switch (index) {
					case 0:
						this.checkDevice = this.device
						break;
					case 1:
						this.checkDevice = []
						this.device.filter(item => {
							if (item.location === '中厅')
								this.checkDevice.push(item)
						})
						break;
					case 2:
						this.checkDevice = []
						this.device.filter(item => {
							if (item.location === '外廊')
								this.checkDevice.push(item)
						})
						break;
					case 3:
						this.checkDevice = []
						this.device.filter(item => {
							if (item.location === '内厅')
								this.checkDevice.push(item)
						})
						break;
					default:
						break;
				}
				this.title.filter((item) => {
					item.check = false
				})
				this.title[index].check = true

			},
			getImageUrl(mes) {
				let path = '../../static/'
				switch (mes) {
					case 'kt':
						path = path + 'air1.png'
						break;
					case 'xfxt':
						path = path + 'air2.png'
						break;
					case 'fs':
						path = path + 'air3.png'
						break;
					default:
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
				this.$refs.progress.up();
			},
			down() {
				this.$refs.progress.down();
			},
			async load() {

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

				this.device = res.data.data
				this.setDevice = [0]
				this.device.filter((item, index) => {

					if (item.model === 'xfxt') this.device[index].set = true

				})

				this.checkDevice = JSON.parse(JSON.stringify(this.device)) //[...this.device]

				console.log(this.device)


			},
			goto(mess) {
				uni.navigateTo({
					url: "/pages/" + mess,
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
		box-sizing: border-box;
		padding: 0 20px 85px;
		background: url("../../static/homeBack.png") 100% no-repeat;
		background-size: 100% 100%;
		position: relative;

		.head {


			.location {
				//margin-top: 10px;
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
					//margin-right: 60px;
				}
			}

		}

		.middle {
			position: relative;
			display: flex;
			justify-content: space-between;



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


			}





		}

		.nodevice {
			margin-top: 50px;
			display: flex;
			flex-direction: column;

			align-items: center;

			image {
				width: 170px;
				height: 120px;
				margin-bottom: 8px;
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
					margin: 0 2px;
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

						.air1 {
							font-size: 16px;
							display: flex;
							flex-direction: column;

							text {
								color: rgba(51, 51, 51, 1);
								font-size: 16px;
								font-weight: 500;
								line-height: 14px;
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

			.edit {
				// background: red;
				display: flex;
				justify-content: center;
				align-items: center;

				// height: 100%;

				button {
					border-radius: 22px;
					padding: 15px 26px 15px 26px;
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

				.progress {
					margin: 0 20px;
					flex: 1;
				}

				.down {
					width: 20px;
					height: 2px;
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

		.fixed {
			height: 70px;
			width: 100vw;
			background-color: transparent;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			background: white;

			.line {
				height: 1px;
				width: 100%;
			}

			.tabbar {
				display: flex;
				height: 100%;
				align-items: center;

				.bar {
					width: 50%;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.img1 {
						width: 22px;
						height: 20px;
					}

					.img2 {
						width: 19px;
						height: 22px;
					}

					.img3 {
						width: 22px;
						height: 22px;
					}

					text {
						margin-top: 7px;
					}
				}

			}
		}
	}
</style>
