<template>

	<intellect title="编辑名称" text='确认修改' @rightBtn="edit()">
		<view class="content-box">
			<text class="title">用户名称</text>
			<input style="flex:1;" v-model="name" placeholder="请输入名称" />
		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				name: "",
				user: {},
				id: ''
			};
		},
		onLoad(option) {
			this.id = option.objectid
			this.load()
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
			async load() {
				this.user = uni.getStorageSync('user')
				if (this.id === this.user.objectid)
					this.name = this.user.username
				else {

					const res = await this.$request({
						method: 'POST',
						url: 'account/search',
						data: {

							objectid: this.id

						},
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync('token')
						},
					})
					this.name = res.data.data.username

				}
			},
			message() {

			},
			async edit() {


				const res = await this.$request({
					method: 'POST',
					url: 'account/update',
					data: {
						data: {
							username: this.name
						},
						objectid: this.id === this.user.objectid ? uni.getStorageSync('user').objectid : this
							.id
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.code === 200)

				{
					uni.showToast({
						title: "修改成功"
					})
					if (this.id === this.user.objectid) {
						this.user.username = this.name
						uni.setStorageSync('user', this.user)
					}
					let time = setInterval(() => {
						uni.navigateBack()
						// uni.redirectTo({
						// 	url: "/pages/home/space/index",
						// });
						clearInterval(time)
					}, 1000)
				} else {
					uni.showToast({
						title: "修改失败",
						icon: "error"
					})
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
