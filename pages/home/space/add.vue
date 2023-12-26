<template>

	<intellect title="添加空间" text='确认添加' @rightBtn="add()">
		<view class="content-box">
			<text class="title">空间名称</text>
			<input style="flex:1;" v-model="name" placeholder="请输入名称" />
		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				name: ""
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
			async add() {


				const res = await this.$request({
					method: 'POST',
					url: 'space/create',
					data: {
						name: this.name,
						account_objectid: uni.getStorageSync('user').objectid
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.code === 200)

				{
					uni.showToast({
						title: "创建成功"
					})

					let time = setInterval(() => {
						uni.navigateBack()
						// uni.redirectTo({
						// 	url: "/pages/home/space/index",
						// });
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
