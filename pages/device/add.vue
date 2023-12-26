<template>

	<intellect title="添加设备" text='确认添加' @rightBtn="add()">
		<view class="content-box">
			<text class="title">设备类型</text>
			<uni-data-select v-model="data.model" :localdata="type"></uni-data-select>

		</view>

		<view class="content-box">
			<text class="title">设备位置</text>
			<uni-data-select v-model="data.location" :localdata="location"></uni-data-select>
		</view>

	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				type: [{
						value: "4",
						text: "空调"
					},
					{
						value: "8",
						text: "新风系统"
					},
					{
						value: "6",
						text: "辐射"
					},
				],
				location: [{
						value: "中厅",
						text: "中厅"
					},
					{
						value: "外廊",
						text: "外廊"
					},
					{
						value: "内厅",
						text: "内厅"
					},
				],
				data: {
					account_objectid: uni.getStorageSync('user').objectid,
					humidity: "70%",
					temperature: "27℃",
					location: "",
					name: "",
					switch: true,
					model: "",
				},
				model: {
					'4': "空调",
					'8': "新风系统",
					'6': "辐射"
				}

			};
		},
		onShow() {

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
				let data = this.data
				if (!data.location || !data.model) {
					uni.showToast({
						title: "请输入",
						icon: "error"
					})
					return
				}
				this.data.name = this.model[this.data.model]

				const res = await this.$request({
					method: 'POST',
					url: 'device/create',
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
						uni.reLaunch({
							url: "/pages/home/index"
						})

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

		/deep/ .uni-select {
			padding: 11px 9px;
			height: 45px;
			font-size: 16px;
		}

		/deep/.uni-select__input-placeholder {
			color: #6a6a6a;
			font-size: 16px;
		}

		/deep/.uni-select__selector-item {
			font-size: 16px;
		}

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
