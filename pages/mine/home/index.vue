<template>

	<intellect title="家庭管理" :hide='true'>

		<view class="content-box">
			<view class="title">
				<image class="photo" :src="src"></image>
				<view class="col">
					<text>{{user.username}}的家</text>
					<text class="value">家庭所有者</text>
				</view>
			</view>
			<image class="edit" src="../../../static/edit.png" @click="goto('mine/date/edit?objectid='+ user.objectid)">
			</image>
		</view>


		<view class="text">成员管理</view>


		<view class="content-box" v-for="item of member" :key="item"
			@click="goto('mine/member?objectid='+item.objectid)">
			<view class="title">
				<image class="list-icon" :src="item.avatar"></image>
				{{item.username}}
			</view>

			<view class="box">
				{{item.nick}}
				<image class="icon" src="../../../static/right.png"></image>
			</view>
		</view>

		<view class="foot" @click="goto('mine/home/add')">
			<image src="../../../static/add.png"></image>
			<text>添加成员</text>
		</view>
	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				data: [{
						name: 'Jerry',
						value: '妻子'
					},
					{
						name: 'Jerry',
						value: '女儿'
					},
					{
						name: 'Jerry',
						value: '妹妹'
					}
				],
				member: [],
				user: {}
			};
		},

		mounted() {


		},
		onShow() {
			this.load()
		},
		methods: {
			async load() {

				this.user = uni.getStorageSync('user')
				this.src = this.user.avatar
				const res = await this.$request({
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
				this.member = res.data.data

			},
			bindTimeChange(e) {
				this.time = e.detail.value
			},
			getImageUrl(mes) {
				return '../../../static/' + mes;
			},
			goto(mess) {
				uni.navigateTo({
					url: '/pages/' + mess
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text {
		color: rgba(51, 51, 51, 1);
		font-size: 16px;
		margin-bottom: 22px;
		// display: block;
	}

	.content-box {
		display: flex;
		justify-content: space-between;
		margin: 10px 0 20px;
		font-size: 16px;
		line-height: 22px;



		.title {
			display: flex;
			align-items: center;
			color: rgba(51, 51, 51, 1);
			// margin-bottom: 20px;

			.list-icon {
				width: 44px;
				height: 44px;
				margin-right: 8px;
				border-radius: 50%;
				box-shadow: 0 0 10px rgb(220, 220, 220);
			}

			.photo {
				width: 60px;
				height: 60px;
				margin-right: 15px;
				border-radius: 50%;
			}

			.value {
				margin-top: 5px;
				color: rgba(153, 153, 153, 1);
				line-height: 22px;
			}

			.col {
				display: flex;
				flex-direction: column;
			}

		}

		.edit {
			width: 20px;
			height: 20px;
		}

		.box {
			display: flex;
			align-items: center;
			color: rgba(153, 153, 153, 1);


			.photo {
				width: 44px;
				height: 44px;
				border-radius: 50%;
			}

			.icon {
				width: 8px;
				height: 14px;
				margin-left: 10px;
			}



		}


	}

	.foot {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;

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
</style>
