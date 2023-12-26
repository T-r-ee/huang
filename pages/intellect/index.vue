<template>

	<intellect title="智能" :hide='true'>
		<view class="title">
			<view class="box">
				<uni-segmented-control :current="tag" :values="items" style-type="text" :active-color="activeColor"
					@clickItem="change" />
				<!-- <text class="text-name">自定义</text> -->
			</view>
			<text class="data" @click="goto('log')">操作日志</text>
		</view>
		<view class="recommend" v-if="tag===0">
			<view class="box" v-for="(item,index) of menu" :key="index">
				<view class="title-box">
					<image :src="'../../static/'+item.src"></image>
					<view class="value-box">
						<text>{{item.title}}</text>
						<text>{{menuMsg(index)}}</text>
					</view>
				</view>
				<switch color="rgb(0,139,137)" @change="switchChange(index)" :checked="item.check" />
			</view>
		</view>






		<view class="custom" v-if="tag===1">


			<uni-swipe-action v-for="(item,index) of custom" :key="index">
				<uni-swipe-action-item style="width: 100%;" :right-options="options1" :auto-close="false"
					@click="deleteClick(item.objectid)">

					<view class="custom-box">
						<view class="title">
							<text>{{item.name}}</text>
							<switch style="transform:scale(0.8)" color="rgb(0,139,137)" checked />
						</view>
						<view class="msg">
							<text v-for="msg of item.trigger_condition" :key="msg">{{msg.label}}{{msg.value}}</text>
						</view>
						<view class="msg">
							<text v-for="msg of item.perform_action" :key="msg">{{msg.label}}{{msg.value}}</text>
						</view>
					</view>

				</uni-swipe-action-item>
			</uni-swipe-action>



			<!-- <view class="custom-box" v-for="(item,index) of custom" :key="index">
				<view class="title">
					<text>{{item.name}}</text>
					<switch color="rgb(0,139,137)" checked />
				</view>
				<view class="msg">
					<text v-for="msg of item.trigger_condition" :key="msg">{{msg.label}}{{msg.value}}</text>
				</view>
				<view class="msg">
					<text v-for="msg of item.perform_action" :key="msg">{{msg.label}}{{msg.value}}</text>
				</view> 
			</view> -->

			<view class="custom-foot">
				<image src="../../static/add.png"></image>
				<text @click="goto('scene')">创建场景</text>
			</view>
			<view style="height: 50px;width: 1px;"></view>
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
				custom: [
					// {
					// 	title: '下午别忘关空调',
					// 	list: [
					// 		'每天18:00',
					// 		'室内温度低于28C',
					// 		'室外温度高于30°C',
					// 		'一楼卧室空调调整到26°C',
					// 		'三楼阁楼空调关掉'
					// 	]
					// },
					// {
					// 	title: '下午别忘关空调',
					// 	list: [
					// 		'每天18:00',
					// 		'室内温度低于28C',
					// 		'室外温度高于30°C',
					// 		'一楼卧室空调调整到26°C',
					// 		'三楼阁楼空调关掉'
					// 	]
					// }
				],
				menu: [{
						src: 'away.png',
						title: '离家',
						msg: '一键关闭所有设备',
						check: true
					},
					{
						src: 'home.png',
						title: '回家',
						msg: '一键开启所有设备',
						check: false
					},
					{
						src: 'night.png',
						title: '晚安',
						msg: '所有已开启设备风量调至最低',
						check: false
					}
				],
				items: ['推荐', '自定义'],
				tag: 0,
				activeColor: 'rgb(6,115,121)',
				query: {}


			};
		},
		onLoad(options) {
			this.query = options
			this.load()
			this.clear()
		},

		methods: {
			async deleteClick(e) {
				const res = await this.$request({
					method: 'POST',
					url: 'workpart/delete',
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

			clear() {
				uni.removeStorageSync("trigger_condition")
				uni.removeStorageSync('perform_action')
				uni.removeStorageSync('parameter')

			},
			menuMsg(e) {
				let msg
				switch (e) {
					case 0:
						this.menu[0].check ? msg = "一键关闭所有设备" : msg = "一键开启所有设备"
						this.command('cmd/lj')
						break;
					case 1:
						this.menu[1].check ? msg = "一键关闭所有设备" : msg = "一键开启所有设备"
						this.command('cmd/hj')
						break;
					case 2:
						this.menu[2].check ? msg = "所有已开启设备风量调至最低" : msg = "所有已开启设备风量调至最低"
						this.command('cmd/wan')
						break;
					default:

						break;
				}
				return msg
			},
			async command(url) {
				const res = await this.$request({
					method: 'POST',
					url: url,
					data: {
						account_objectid: uni.getStorageSync('user').objectid
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
			},
			async switchChange(e) {
				this.menu[e].check = !this.menu[e].check
				this.menuMsg(e)
				let log = {
					label: ("用户" + (this.menu[e].check ? "开启了" : "关闭了") + this.menu[e].title + "模式"),
					account_objectid: uni.getStorageSync('user').objectid
				}


				const res = await this.$request({
					method: 'POST',
					url: 'record/create',
					data: log,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) uni.showToast({
					title: "下发成功"
				})
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},

			change(e) {
				this.tag = e.currentIndex

			},
			async load() {
				let query = this.query
				if (query && query.tag)
					this.tag = Number(query.tag)

				const res = await this.$request({
					method: 'POST',
					url: 'workpart/search',

					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.data) this.custom = res.data.data

			},


			goto(mess) {

				uni.navigateTo({
					url: "/pages/intellect/" + mess,
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
	.title {
		display: flex;
		justify-content: space-between;


		.box {
			display: flex;

			line-height: 22px;
			align-items: center;


			/deep/ .segmented-control__item--text {
				border: none;
				color: rgba(153, 153, 153, 1);
			}

			/deep/ .segmented-control__text {
				font-size: 16px;

			}

			/deep/ .segmented-control__item {
				margin-right: 10px;
				flex: none;
			}

			/deep/ .segmented-control__item--text::after {
				content: '';
				position: absolute;
				width: 40%;
				height: 2px;
				background-color: rgb(58, 166, 164);
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}



		}


		.data {
			display: flex;
			align-items: center;
			line-height: 22px;
			color: rgba(0, 139, 137, 1);
			font-size: 15px;
		}
	}

	.recommend {


		.box {
			margin-top: 28px;
			display: flex;
			justify-content: space-between;

			.title-box {
				display: flex;
				align-items: center;

			}

			.value-box {
				margin-left: 10px;
				display: flex;
				flex-direction: column;
			}

			image {
				width: 30px;
				height: 30px;
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


			/deep/ wx-switch {
				display: flex;
			}

			/deep/ .wx-switch-input {
				width: 40px;
				height: 20px;
				margin-right: 0px;
			}

			/deep/.wx-switch-input:before {
				height: 0px;
			}

			/deep/.wx-switch-input:after {
				width: 18px;
				height: 18px;
			}
		}
	}

	.custom {
		display: flex;
		flex-direction: column;
		margin-top: 14px;

		.custom-box {
			border-bottom: 1px solid rgb(221, 221, 221);

			.title {
				font-size: 16px;
				display: flex;
				justify-content: space-between;
				margin: 14px 0;

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

				/deep/ wx-switch {
					display: flex;
				}

				/deep/ .wx-switch-input {
					width: 40px;
					height: 20px;
					margin-right: 0px;
				}

				/deep/.wx-switch-input:before {
					height: 0px;
				}

				/deep/.wx-switch-input:after {
					width: 18px;
					height: 18px;
				}
			}

			.msg {
				display: flex;
				flex-direction: column;
				color: rgba(153, 153, 153, 1);
				font-size: 14px;

				text {
					line-height: 20px;
					margin-bottom: 14px;
				}
			}
		}

		.custom-foot {
			display: flex;
			justify-content: center;
			align-items: center;
			color: rgba(0, 139, 137, 1);
			font-size: 16px;
			line-height: 22px;
			margin: 16px;

			image {
				width: 14px;
				height: 14px;
				margin: 4px 0 4px 0;
				margin-right: 5px;
			}
		}
	}
</style>
