<template>

	<intellect :title="title+'环境'" text='提交' @rightBtn="submit()">
		<view class="content-box">
			<view class="list">
				<view class="list-item" v-for="item of list" @click="goto(item.src)" :key="item">
					<text>{{item.name}}</text>
					<image src="../../static/right.png"></image>
				</view>
			</view>
		</view>
	</intellect>


</template>

<script>
	export default {

		data() {
			return {
				list: [{
					name: '温度',
					src: 'temper'
				}, {
					name: '湿度',
					src: 'humidity'
				}, {
					name: 'PM2.5',
					src: 'pm'
				}],
				title: "",
				query:{}
			};
		},
		onLoad(options) {
		 
			this.title =  options ? ( options.title === 'in' ? '室内' : "室外") : ""
		},
 
		methods: {
			submit() {

				let msg = uni.getStorageSync("parameter")
				let temp = uni.getStorageSync("trigger_condition")

				msg.temper ? msg.temper = {
					label: this.title + "温度",
					value: msg.temper + "℃"
				} : ""
				msg.humidity ? msg.humidity = {
					label: this.title + "湿度",
					value: msg.humidity + "%"
				} : ""
				msg.pm ? msg.pm = {
					label: this.title + "PM2.5",
					value: msg.pm
				} : ""
				if (this.title === "室内") {
					uni.setStorageSync("trigger_condition", {
						...temp,
						indoor: msg
					})
				} else {
					uni.setStorageSync("trigger_condition", {
						...temp,
						outdoor: msg
					})
				}
				uni.redirectTo({
					url: '/pages/intellect/scene'
				})
			},

			 

			goto(mess) {
				uni.navigateTo({
					url: '/pages/intellect/' + mess
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		justify-content: space-between;

		.list {
			width: 100%;

			padding: 9px 5px 0px;
			margin-bottom: 10px;

			.list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 17px;

				image {
					width: 8px;
					height: 14px;
					margin: 3px 0;
				}
			}

		}



	}
</style>
