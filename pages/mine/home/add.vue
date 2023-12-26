<template>

	<intellect title="添加成员" text='确认添加' @rightBtn="add()">
		<view class="content-box">
			<text class="title">成员名称</text>
			<input v-model="data.username" placeholder="请输入名称" />
		</view>

		<view class="content-box">
			<text class="title">成员电话</text>
			<input v-model="data.phone" placeholder="请输入成员电话" />
		</view>

		<view class="content-box">
			<text class="title">登陆密码</text>
			<input v-model="data.password" placeholder="请输入登陆密码" />
		</view>
		<view class="content-box">
			<text class="title">成员关系</text>
			<input v-model="data.nick" placeholder="请输入成员关系" />
		</view>
	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				data: {
					username: "",
					phone: "",
					password: "",
					nick: "",
					role: "client_sub",
					super_objectids: [uni.getStorageSync('user').objectid]
				}


			};
		},

		mounted() {


		},
		methods: {
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			getImageUrl(mes) {
				return '../../static/' + mes;
			},

			async add() {

				const res = await this.$request({
					method: 'POST',
					url: 'account/create',
					data: this.data,
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.code === 200)

				{
					uni.showToast({
						title: "添加成功"
					})

					let time = setInterval(() => {
						uni.navigateBack()

						clearInterval(time)
					}, 1000)
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		flex-direction: column;
		margin-bottom: 19px;


		input {
			border-radius: 5px;
			border: 1px solid rgba(221, 221, 221, 1);
			padding: 11px 9px;
			flex: 1;
			box-sizing: border-box;
		}

		.title {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);
			line-height: 20px;
			font-size: 14px;
			margin-bottom: 10px
		}




	}
</style>
