<template>


	<intellect title="创建场景" text='创建' @rightBtn="add()">
		<view class="content-box">
			<text class="title">场景名称</text>
			<input class="uni-input" v-model="data.name" placeholder="最大输入长度为10" />
		</view>
		<view class="content-box">
			<text class="title">如果</text>
			<view class="list" v-if="addShow">
				<view class=" list-item list-bottom" @click="goto('timer')">
					<text>{{timer?timer.label+timer.value:"定时"}} </text>
					<image src="../../static/right.png"></image>
				</view>
				<view v-if="!indoor.length " class="list-item list-bottom" @click="goto('indoor?title=in')">
					<text>室内环境 </text>
					<image src="../../static/right.png"></image>
				</view>
				<view v-else class=" list-item list-bottom" v-for="(item,index) of indoor"
					@click="goto('indoor?title=in')" :key="index">
					<text>{{item.label+item.value }}</text>
					<image src="../../static/right.png"></image>
				</view>
				<view v-if="!outdoor.length" class=" list-item " @click="goto('indoor?title=out')">
					<text>室外环境</text>
					<image src="../../static/right.png"></image>
				</view>
				<view v-else :class="['list-item' ,index!==outdoor.length-1?'list-bottom':'']"
					v-for="(item,index) of outdoor" :key="index" @click="goto('indoor?title=out')">
					<text>{{item.label+item.value}}</text>
					<image src="../../static/right.png"></image>
				</view>
			</view>
			<view class="item" @click="clickAdd()">
				<image src="../../static/circleadd.png"></image>
				<text>添加触发条件</text>
			</view>
		</view>
		<view class="content-box">
			<text class="title">将设备调整为</text>
			<view class="list" v-if="actionShow">
				<view :class="['list-item' ,index!==device.length-1?'list-bottom':'']" v-for="(item,index) of device"
					:key="index">
					<text>{{item.name}}</text>
					<image src="../../static/right.png"></image>
				</view>
			</view>
			<view class="item" @click="goto('action')">
				<image src="../../static/circleadd.png"></image>
				<text>添加执行动作</text>
			</view>
		</view>


	</intellect>



</template>

<script>
	export default {
		data() {
			return {
				data: {
					name: "",
					trigger_condition: [],
					perform_action: [],
					account_objectid: '',
				},
				addShow: false,
				actionShow: false,

				timer: '',
				indoor: [],
				outdoor: [],
				device: [],
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
		onShow() {
			this.load()
		},
		mounted() {

			let msg = uni.getStorageSync('trigger_condition')
			console.log(msg)
			if (msg) {
				this.addShow = true
				this.timer = msg.time
				for (let key in msg.indoor) {
					this.indoor.push(msg.indoor[key])
				}
				for (let key in msg.outdoor) {
					this.outdoor.push(msg.outdoor[key])
				}
			}


			let action = uni.getStorageSync('perform_action')
			console.log(action)
			if (action) {
				this.actionShow = true
				this.device = []
				action.filter((item) => {
					this.device.push({
						name: item.label + item.value
					})
				})
			}
		},
		methods: {
			async load() {
				const res = await this.$request({
					method: 'POST',
					url: 'workpart/search',
					// data: {
					// 	name: "cs场景"
					// },
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})

			},
			async add() {

				this.data.account_objectid = uni.getStorageSync("user").objectid
				let conditionArray = [this.timer, ...this.indoor, ...this.outdoor]
				this.data.trigger_condition = conditionArray

				this.data.perform_action = uni.getStorageSync('perform_action')

				if (!this.data.name || !this.data.trigger_condition || !this.data.perform_action) {

					uni.showToast({
						title: "数据不完整！",
						icon: "error"
					})
					console.log(1)
					return
				}

				const res = await this.$request({
					method: 'POST',
					url: 'workpart/create',
					data: this.data,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}

				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "创建成功"
					})
					let timer = setInterval(() => {
						uni.switchTab({
							url: "/pages/intellect/index"
						})
					}, 1000)
				}
			},
			goto(mess) {
				uni.navigateTo({
					url: '/pages/intellect/' + mess
				})
			},
			clickAdd() {
				this.addShow = !this.addShow
			},
			clickAction() {
				this.actionShow = !this.actionShow
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
		flex-direction: column;
		margin-bottom: 19px;

		.list {
			border-radius: 5px;
			border: 1px solid rgba(221, 221, 221, 1);
			padding: 9px;
			margin-bottom: 10px;

			.list-bottom {
				margin-bottom: 15px;
			}

			.list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				image {
					width: 8px;
					height: 14px;
					margin: 3px 0;
				}
			}

		}

		input {
			border-radius: 5px;
			border: 1px solid rgba(221, 221, 221, 1);
			padding: 11px 0px 11px 9px;
		}

		.title {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);
			line-height: 20px;
			font-size: 14px;
			margin-bottom: 20px
		}

		.item {
			display: flex;
			align-items: center;
			color: rgba(0, 139, 137, 1);
			font-size: 14px;
			line-height: 20px;

			image {
				margin-right: 10px;
				width: 20px;
				height: 20px;
			}

		}

		.value {
			margin: 10px 0;
		}
	}
</style>
