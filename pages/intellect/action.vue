<template>

	<intellect title="添加执行动作" text='提交' @rightBtn="submit()">
		<view class="content-box">
			<view class="list">
				<picker :range="array" :value="0" @change="bindPlaceChange">
					<view class="list-item item-margin">
						<text>{{data.place}}</text>
						<image src="../../static/right.png"></image>
					</view>
				</picker>
				<picker :range="list" :value="0" @change="bindDeviceChange">
					<view class="list-item">
						<text>{{data.device}}</text>
						<image src="../../static/right.png"></image>
					</view>
				</picker>

				<view class="line  ">
					<image src="../../static/line-black.png"></image>
				</view>


				<picker :range="group" :value="0" @change="bindTemperChange">
					<view class="list-item item-margin">
						<text>温度 </text>
						<image src="../../static/right.png"></image>
					</view>
				</picker>


				<view class="list-item">
					<text>开关</text>
					<view>
						<switch color="rgb(0,139,137)" @change="switchChange()" :checked="check" />
					</view>
				</view>
			</view>
		</view>
	</intellect>


</template>

<script>
	export default {
		data() {
			return {
				data: {
					place: '地点',
					device: "设备类型",
					temper: "",
					check: true,
				},
				check: true,
				group: [],
				array: [],
				list: [],

			};
		},

		mounted() {
			this.load()

		},
		methods: {
			switchChange() {
				this.data.check = !this.data.check
			},
			submit() {


				let data = this.data
				let msg = uni.getStorageSync('perform_action')

				let confirm = false
				if (data.check && !data.temper > 0 || data.place === '地点' || data.device === "设备类型") {
					uni.showToast({
						title: "请选择",
						icon: "error"
					})
					return
				}

				if (msg.length)
					msg.filter((item, index) => {
						if (item.label === data.place + data.device) {
							confirm = true
							if (data.check) {
								msg[index].value = "调整到" + data.temper + "℃"
							} else {
								msg.splice(index, 1)
							}
							uni.setStorageSync('perform_action', msg)
						}
					})

				if (!confirm && data.check) {
					uni.setStorageSync('perform_action',
						[...msg, {
							label: data.place + data.device,
							value: "调整到" + data.temper + "℃"
						}]
					)

				}

				uni.redirectTo({
					url: '/pages/intellect/scene'
				})
			},
			load() {
				this.array = ["一楼客厅", "二楼卧室", "三楼书房", "四楼桌球房"]
				this.list = ["空调", "新风系统", "辐射"]
				for (let i = 16; i <= 30; i++)
					this.group.push(i)
			},
			bindPlaceChange(e) {
				this.data.place = this.array[e.detail.value]
			},
			bindDeviceChange(e) {
				this.data.device = this.list[e.detail.value]
			},
			bindTemperChange(e) {
				this.data.temper = this.group[e.detail.value]
			},


		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		justify-content: space-between;

		.list {
			width: 100%;

			padding: 9px 9px 0px;
			margin-bottom: 10px;

			.line {
				display: flex;
				margin: 17px 0;

				image {
					width: 100%;
					height: 1px;
				}

			}

			.item-margin {
				margin-bottom: 17px;
			}

			.list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;


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
