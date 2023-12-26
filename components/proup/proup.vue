<template>
	<view>
		<uni-popup ref="popup" type="bottom" @maskClick="maskClick()">
			<view class="popup">

				<view class="topic">
					<text>{{title}}</text>

				</view>
				<view class="middle">
					<slot name="content"></slot>
				</view>
				<view class="run">
					<slot name="foot"></slot>
				</view>


			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "proup",
		props: ['title'],
		data() {
			return {

			};
		},
		methods: {
			open() {

				this.$refs.popup.open()
			},
			close() {

				this.$refs.popup.close()
			},
			maskClick() {
				this.$emit('maskClick')
			}
		}
	}
</script>

<style lang="scss">
	.popup {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 5px 5px 0px 0px;



		.topic {

			font-size: 14px;
			line-height: 20px;
			display: flex;
			justify-content: center;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			padding: 15px;


		}

		.middle {
			display: flex;
			flex-direction: column;
			// padding: 30px 0 10px 0;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);

			.select {
				margin-bottom: 30px;
			}

			/deep/ .uni-select__input-placeholder {
				font-size: 16px;
				color: rgba(51, 51, 51, 1);
			}

			/deep/ .uni-select {
				border: none;
			}

			/deep/ .uni-select__input-box {
				font-size: 16px;
			}

			/deep/ .uni-select__input-text {
				margin-right: 10px
			}

			.name {
				width: 50%;
				padding: 60px 0px;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.value {
				text-align: center;
				width: 50%;
				padding: 60px 0px;
			}
		}

		.run {
			display: flex;
			justify-content: center;
			margin: 10px 0px;

			text {
				width: 50%;
				text-align: center;
				line-height: 22px;
				padding: 10px 0;
				font-size: 16px
			}

			.share {
				color: rgba(0, 139, 137, 1);
			}
		}
	}
</style>
