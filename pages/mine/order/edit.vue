<template>

	<intellect title="工单详情" :hide='true'>
		<view class="content-box" v-for="(item,index) of data" :key="index">
			<text class="name">{{item.name}}:</text>
			<text class="value">
				{{item.value}}
			</text>
		</view>
		<view class="content-box">
			<text class="name">工单分类:</text>
			<view class="value">
				<uni-data-checkbox selectedColor="rgb(0,139,137)" v-model="order.model" :localdata="tag">
				</uni-data-checkbox>
			</view>
		</view>
		<view class="content-box">
			<text class="name">问题描述:</text>
			<view class="value">
				<!-- {{problem_desc||'暂无'}} -->
				<input class="input" v-model="order.problem_desc" />
			</view>
		</view>
		<view class="content-box">
			<text class="name">图片:</text>
			<view class="value">
				<image v-for="(item ) in 3" :key="item" v-if="order.desc_img&&order.desc_img
[item-1]" :src=" 
order.desc_img
[item-1]"></image>

			</view>
		</view>
		<view>
			<text>工单记录</text>
			<view class="order">
				<uni-steps :options="list" active-color="rgb(0,139,137)" :active="active" direction="column" />
				<view class="order-line"></view>
				<view class="content-box" v-if="active>=1" v-for="(msg,index) of item" :key="index"
					:style="{   'margin-bottom': index===item.length-1? '0px'  :'20px' }">
					<text class="name">{{msg.name}}:</text>
					<text class="value">
						{{msg.value}}
					</text>
				</view>
			</view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="error" cancelText="取消" confirmText="确定" title="警告" content="确定删除?"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>


			<view class="foot">
				<view class="foot-box">
					<button class="delete" @click="orderDelete()">删除</button>
					<button class="edit" @click="orderEdit()">修改</button>
				</view>

			</view>
		</view>
	</intellect>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				list: [{
					title: '已派单',

				}, {
					title: '已接单',

				}, {
					title: '执行中',

				}, {
					title: '已完结',

				}, {
					title: '已回访	',

				}],
				activeIndex: {
					'已派单': 0,
					'已接单': 1,
					'执行中': 2,
					'已完结': 3,
					'已回访': 4,
				},
				status: 'inspect',
				tag: [{
						text: '保养',
						value: 'inspect'
					},
					{
						text: '故障',
						value: 'break'
					}
				],


				item: [{
						name: '施工工人',
						value: '张三'
					},
					{
						name: '联系方式',
						value: '13778888888'
					},
					{
						name: '故障原因',
						value: '固件未升级'
					},
					{
						name: '处理办法',
						value: '升级固件'
					}
				],
				data: [{
						name: '提交时间',
						value: '2023-09-09 10:00'
					},
					{
						name: '设备',
						value: '主卧的新风'
					},
					{
						name: '联系方式',
						value: '13778888888'
					},
					{
						name: '预约时间',
						value: '2023-08-09 10:00'
					}

				],
				objectid: '',
				problem_desc: '',
				order: [],
				device: []

			};
		},
		onLoad(options) {
			this.objectid = options.objectid
			this.load()
		},
		mounted() {


		},
		methods: {
			async dialogConfirm() {
				const res = await this.$request({
					method: 'POST',
					url: 'workorder/delete',
					data: {
						objectid: this.objectid
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "删除成功！"
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)

				} else {

					uni.showToast({
						title: "删除失败！"
					})
				}
			},
			dialogClose() {},
			orderDelete() {
				this.$refs.alertDialog.open()
			},
			async load() {

				const res = await this.$request({
					method: 'POST',
					url: 'workorder/search',
					data: {
						objectid: this.objectid
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.data) {
					this.order = res.data.data
					this.active = this.activeIndex[this.order.status] || 0
					this.item[0].value = this.order.worker
					this.item[1].value = this.order.worker_phone
					this.item[2].value = this.order.failure_cause
					this.item[3].value = this.order.treatment_method
					this.data[0].value = this.getDate(this.order.created)
					this.data[2].value = this.order.phone
					this.data[3].value = this.order.appointment_time || "无"

					// this.status = this.order.model
					// this.problem_desc = this.order.problem_desc

					const device = await this.$request({
						method: 'POST',
						url: 'device/search',
						data: {
							objectid: this.order.device_id
						},
						header: {
							'Authorization': `Bearer ${uni.getStorageSync('token')}`,
						}
					})
					if (device.data.data) {
						this.device = device.data.data
						this.data[1].value = this.device.name
					}
				}
			},
			getDate(timestamp) {
				var date = new Date(timestamp * 1000); // 将秒数转换为毫秒数
				var year = date.getFullYear();
				var month = date.getMonth() + 1; // 月份是从0开始计数的，所以要加1
				var day = date.getDate();
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();

				return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + ' ' + (hours <
					10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' :
					'') + seconds;
			},
			async orderEdit() {
				const res = await this.$request({
					method: 'POST',
					url: 'workorder/update',
					data: {
						objectid: this.objectid,
						data: this.order
					},
					header: {
						'Authorization': `Bearer ${uni.getStorageSync('token')}`,
					}
				})
				if (res.data.code === 200) {
					uni.showToast({
						title: "修改成功！"
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}
			}



		}
	}
</script>

<style lang="scss" scoped>
	.content-box {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24px;
		font-size: 14px;


		.name {
			display: flex;
			align-items: center;

			overflow-wrap: break-word;
			color: rgba(153, 153, 153, 1);
			line-height: 20px;

		}

		.value {
			display: flex;
			align-items: center;

			.input {
				text-align: right;
			}

			/deep/ .checklist-box {
				// margin-right: 10px;
			}

			image {
				width: 80px;
				height: 80px;
				margin-right: 10px;
			}

		}

	}

	.order {
		background-color: rgba(249, 249, 249, 1);
		border-radius: 5px;
		position: relative;
		margin: 12px 2px 40px 0;
		padding: 20px 10px 12px 10px;

		/deep/ .uni-steps__column-text {
			border: none
		}

		.order-line {
			width: 100%;
			height: 1px;
			background: rgb(221, 221, 221);
			margin: 10px 0;
		}
	}

	.foot {
		display: flex;
		justify-content: flex-end;

		.foot-box {
			display: flex;
			align-items: center;

			.delete {
				border-radius: 22px;
				padding: 11px 39px 11px 39px;
				color: rgba(0, 139, 137, 1);
				font-size: 16px;
				background: none;
				line-height: 22px;
			}

			.delete::after {
				border: none;
			}

			.edit {
				background-color: rgba(0, 139, 137, 1);
				border-radius: 22px;
				padding: 11px 39px 11px 39px;
				color: rgba(255, 255, 255, 1);
				font-size: 16px;
				line-height: 22px;
			}
		}

	}
</style>
