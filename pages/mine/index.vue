<template>

	<intellect title="我的" :hide='true'>
		<view class="content-box">
			<view class="title">


				<image :src="src + '?t=' + Date.now()"></image>
				<view class="font">{{user.username}} 的家</view>
			</view>
			<view class="list">
				<view v-for="(item,index) of list" @click="goto(item.src)" :key="index">
					<view class="list-item">
						<text>{{item.name}}</text>
						<image src="../../static/right.png"></image>
					</view>
					<view class="line" v-if="index===3||index===5"></view>
					<view class="noline" v-else></view>
				</view>



			</view>

		</view>
	</intellect>


</template>

<script>
	export default {
		data() {
			return {

				src: '',
				user: {},
				list: [{
						name: '个人资料',
						src: 'mine/date/index'
					}, {
						name: '我的空间',
						src: 'home/space/index'
					},
					{
						name: '家庭管理',
						src: 'mine/home/index'
					}, {
						name: '收货地址',
						src: ''
					},
					{
						name: '工单管理',
						src: 'mine/order/index'
					}, {
						name: '项目文档',
						src: ''
					},
					{
						name: '使用指南',
						src: ''
					}, {
						name: '使用反馈',
						src: ''
					},
					{
						name: '联系客服',
						src: ''
					}, {
						name: '关于天朗',
						src: ''
					}
				],

			};
		},


		mounted() {


		},
		onShow() {





			this.user = uni.getStorageSync('user')
			this.src = this.user.avatar
		},
		methods: {
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			goto(mess) {
				uni.navigateTo({
					url: "/pages/" + mess,
				});
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},
			// async load() {

			// 	const res = await this.$request({
			// 		method: 'POST',
			// 		url: 'account/search',
			// 		data: {

			// 			objectid: uni.getStorageSync('user').objectid

			// 		},
			// 		header: {
			// 			'Authorization': 'Bearer ' + uni.getStorageSync('token')
			// 		},
			// 	})
			// 	this.user = res.data.data
			// 	uni.setStorageSync('user', this.user)
			// 	this.src = this.user.avatar

			// },
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		font-size: 16px;
		display: flex;
		flex-direction: column;
		padding: 0px 5px 0px;

		.title {
			display: flex;
			align-items: center;
			margin-bottom: 30px;


			.font {}

			image {
				border-radius: 50%;
				margin-right: 10px;
				width: 44px;
				height: 44px;
			}
		}

		.line {
			width: 100%;
			height: 1px;
			background: rgb(221, 221, 221);
			margin: 11px 0;
		}

		.noline {
			width: 100%;
			height: 1px;
			margin: 11px 0;
		}

		.list {
			width: 100%;
			box-sizing: border-box;

			margin-bottom: 10px;

			.list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				// margin-bottom: 17px;

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



				image {
					width: 8px;
					height: 14px;
					margin: 3px 0;
				}
			}

		}



	}
</style>
