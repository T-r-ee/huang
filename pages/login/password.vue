<template>


	<view class="login ">

		<view class="title flex">
			<image src="../../static/tillan.png" class="image_2"></image>
		</view>

		<view class=" flex">
			<image src="../../static/loginBack.png" class="image_3"></image>
		</view>





		<view class="bottom">
			<view class="input_1 ">
				<span class="tag" style="margin-right: 10px;">+86</span>
				<input class="input" placeholder="请输入手机号" v-model="data.phone" />
			</view>
			<view class="input_1 " style="margin: 20px 0;">
				<input class="input" placeholder="请输入密码" v-model="data.password" />
			</view>
			<button class="button_1 flex" @click="loginHandle">
				<view class="image-text_1">

					<span class="text-group_1">登录</span>
				</view>
			</button>
			<span class="text_3 flex" @click="goto('verify')">手机验证码登录&gt;&gt;</span>
		</view>




		<view class="image-text_2">
			<checkbox-group @change="checkboxChange">
				<checkbox value='1' :checked="check" color="rgb(0,139,137)" style="transform:scale(0.7)" />
			</checkbox-group>
			<span class="text-group_2">我已阅读并接受《xxxx用户使用协议》</span>
		</view>


	</view>








</template>


<script>
	export default {
		data() {
			return {
				data: {
					phone: '',
					password: ''
				},
				show: 1,
				username: '张高峰',
				password: '12345678',
				check: false
			};
		},
		onBackPress(e) {
			uni.redirectTo({
				url: '/pages/login/index'
			});
			return true
		},
		methods: {
			async loginHandle() {
				if (!this.check) {
					uni.showToast({
						icon: 'error',
						title: '请先勾选协议'
					});
					return;
				}


				const res = await this.$request({
					method: 'GET',
					url: 'login',
					data: this.data,

				})

				if (res.data.data) {
					uni.setStorageSync('token', res.data.data.token)
					uni.setStorageSync('user', res.data.data.object)

					uni.showToast({
						icon: 'success',
						title: '登陆成功'
					});
					let time = setInterval(() => {
						uni.reLaunch({
							url: "/pages/home/index",
						});
						clearInterval(time)
					}, 500)
				} else {
					uni.showToast({
						icon: 'error',
						title: '账户验证错误！'
					});
				}



			},
			goto(mes) {
				// uni.redirectTo({
				uni.redirectTo({
					url: '/pages/login/' + mes
				});
			},
			checkboxChange(e) {
				if (e.detail.value.length)
					this.check = true
				else this.check = false
			}
		},
	}
</script>

<style lang="scss" scoped>
	.login {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;


		.flex {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1
		}

		.title {

			padding: 13px 0 35px 0;
			box-sizing: border-box;

			.image_2 {
				width: 156px;
				height: 50px;
				align-self: center;
				margin-top: 25px;
			}
		}




		.bottom {

			padding: 30px 32px 9px 30px;
			flex: 1;
			box-sizing: border-box;

			.input_1 {
				display: flex;
				align-items: center;
				border-radius: 22px;
				//width: 328px;
				border: 1px solid rgba(221, 221, 221, 1);
				padding: 10px 10px 10px 19px;

				.input {
					overflow-wrap: break-word;
					color: rgba(153, 153, 153, 1);
					font-size: 16px;
					font-family: PingFangSC-Regular;
					font-weight: NaN;
					white-space: nowrap;
					line-height: 22px;
					// margin-top: 20px;
				}
			}

			//padding: 13px 0 35px 0;
			.button_2 {
				height: 44px;
				border-radius: 22px;
				border: 1px solid rgba(221, 221, 221, 1);
				margin-top: 20px;

				.tag {
					overflow-wrap: break-word;
					color: rgba(51, 51, 51, 1);
					font-size: 16px;
					font-family: PingFangSC-Regular;
					font-weight: NaN;
					text-align: left;
					white-space: nowrap;
					line-height: 22px;
				}
			}

			.button_1 {
				height: 44px;
				background-color: rgba(0, 139, 137, 1);
				border-radius: 22px;


				.image-text_1 {
					width: 128px;

					.icon_1 {
						width: 25px;
						height: 20px;
					}

					.text-group_1 {
						overflow-wrap: break-word;
						color: rgba(255, 255, 255, 1);
						font-size: 16px;
						font-family: PingFangSC-Regular;
						font-weight: NaN;
						text-align: left;
						white-space: nowrap;
						line-height: 22px;
					}
				}

			}
		}


		.image_3 {
			width: 320px;
			height: 270px;
			align-self: center;
			margin-top: -1px;
		}

		.text_3 {
			overflow-wrap: break-word;
			color: rgba(153, 153, 153, 1);
			font-size: 14px;
			font-family: PingFangSC-Regular;
			font-weight: NaN;
			white-space: nowrap;
			line-height: 20px;
			margin-top: 20px;
		}

		.image-text_2 {
			width: 260px;
			display: flex;
			align-items: center;
			position: relative;
			left: 30px;
			bottom: 3px;

			.checkbox_1 {
				background-color: rgba(255, 255, 255, 1);
				border-radius: 2px;
				width: 14px;
				height: 14px;
				border: 1px solid rgba(153, 153, 153, 1);
				margin: 3px 3px 3px 0;
			}

			.text-group_2 {
				overflow-wrap: break-word;
				color: rgba(102, 102, 102, 1);
				font-size: 14px;
				font-family: PingFangSC-Regular;
				font-weight: NaN;
				text-align: left;
				white-space: nowrap;
				line-height: 20px;
			}
		}



		// .home-indicator_1 {
		// 	background-color: rgba(0, 0, 0, 1);
		// 	border-radius: 3px;
		// 	width: 136px;
		// 	height: 5px;
		// 	margin: 23px 95px 0 97px;
		// }

	}
</style>
