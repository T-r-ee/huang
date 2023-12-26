<template>
	<view class="main">
		<view class="head" :style="{'padding-top':position.top+'px' }">

			<view :class="['head-title',locate?'leftFont':'']" :style="{ 'height':position.height+'px'}">
				<view class="back" @click="back()">

					<image src="../../static/leftp.png"></image>

				</view>

				{{title}}
			</view>
		</view>

		<view class="content">
			<slot></slot>

		</view>

		<view class="foot">
			<button v-if="show" class="left" @click="leftBtn()">{{text2}}</button>
			<button v-if="!hide" class="right" @click="rightBtn()">{{text}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['title', 'text', 'hide', 'locate', 'show', 'text2'],
		data() {
			return {
				time: '12:01',
				position: {
					top: '',
					height: ''
				}
			};
		},

		mounted() {
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			if (menuButtonInfo) {
				this.position.top = menuButtonInfo.top
				this.position.height = menuButtonInfo.height
				// this.position.right = menuButtonInfo.width
			}
			console.log(menuButtonInfo);

		},
		methods: {
			back() {
				uni.navigateBack();
				// this.$emit('back')
			},
			leftBtn() {
				this.$emit('leftBtn')
			},
			rightBtn() {
				this.$emit('rightBtn')
			},
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
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		background: url("../../static/homeBack.png") 100% no-repeat;
		background-size: 100% 100%;
		position: relative;

		.head {
			padding: 0 10px 17px;
			font-size: 16px;



			.head-title {

				display: flex;
				justify-content: center;
				align-items: center;

				color: rgba(51, 51, 51, 1);
				font-size: 18px;
				font-weight: 600;



				.back {
					position: absolute;
					left: 0;
					padding: 0 10px;

					image {
						width: 8px;
						height: 14px;
					}
				}
			}

			.leftFont {
				display: flex;
				justify-content: left;
				margin-left: 20px;
			}
		}

		.content {
			height: 100%;
			//background: white;
			background-color: white;
			overflow: scroll;
			border-radius: 30px 30px 0px 0px;
			box-sizing: border-box;
			padding: 20px 14px 8px 14px;

			.content-box {
				display: flex;
				justify-content: space-between;

				.title {
					display: flex;
					align-items: center;
					color: rgba(153, 153, 153, 1);
					line-height: 20px;
					font-size: 14px;
					margin-bottom: 20px
				}

				.picker {
					display: flex;
					align-items: center;

					.icon {
						width: 8px;
						height: 14px;
						margin-left: 10px;
					}



				}

			}

		}

		.foot {
			position: fixed;
			bottom: 10px;
			right: 10px;
			display: flex;
			align-items: center;

			.left {
				color: rgba(0, 139, 137, 1);
				font-size: 16px;
				line-height: 22px;
				background: transparent;
			}

			.left::after {
				border: none;
			}

			.right {
				background-color: rgba(0, 139, 137, 1);
				border-radius: 22px;
				padding: 11px 0;
				width: 110px;
				color: rgba(255, 255, 255, 1);
				font-size: 16px;
				line-height: 22px;
			}
		}
	}
</style>
