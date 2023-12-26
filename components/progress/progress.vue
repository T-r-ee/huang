<template>
 	<div class="circle_box">
 		<!-- 内容 -->
 		<div class="circleText">
 			<div class="score">{{ score }}</div>
 			<div class="desc">您本次得分</div>
 		</div>
 		<!-- 进度条 -->
 		<canvas class="circle canvasArcCir" style="z-index: 3;"></canvas>
 		<!-- 大圆环 -->
 		<canvas class="circle canvasCircle" style="z-index: 2;"></canvas>
 	</div>
 </template>

 <script>
 	export default {
 		name: "progress",
 		data() {
 			return {
 				varName: null,
 				score: 80,
 				canvasWidth: 470,
 				canvasHeight: 470,
 				lineWidth: 16
 			};
 		},
 		mounted() {
 			this.drawLine();
 		},
 		beforeDestroy() {
 			this.clearTime();
 		},
 		methods: {
 			//清空定时器
 			clearTime() {
 				if (this.varName) {
 					clearInterval(this.varName);
 				}
 			},
 			drawLine() {
 				//创建并返回绘图上下文context对象。
 				//灰色圆环
 				var el_circle = document.querySelector(".canvasCircle");
 				el_circle.width = this.canvasWidth;
 				el_circle.height = this.canvasWidth;
 				var cxt_arc = el_circle.getContext("2d");
 				//线条宽度
 				cxt_arc.lineWidth = this.lineWidth;
 				//线条颜色
 				cxt_arc.strokeStyle = '#eaeaea';
 				//线段两端为圆角
 				cxt_arc.lineCap = 'round';
 				cxt_arc.beginPath();
 				//cxt_arc.arc(x,y,半径,开始端点,结束端点,顺时针)
 				//arc绘制起点为时钟3点为起点，顺时针转0.8*Math.PI，对应的终点为2.8*Math.PI，需要两端对齐则终点为2.2*Math.PI
 				cxt_arc.arc(this.canvasWidth / 2, this.canvasWidth / 2, this.canvasWidth / 2 - this.lineWidth * 3, 0.8 *
 					Math.PI, 2.2 * Math.PI, false);
 				cxt_arc.stroke();
 				// 这里就是进度条的显示
 				this.drawCirclePg();
 			},
 			drawCirclePg() {
 				//创建并返回绘图上下文context对象。
 				var el_arcCir = document.querySelector(".canvasArcCir");
 				el_arcCir.width = this.canvasWidth;
 				el_arcCir.height = this.canvasWidth;
 				var cxt_arc = el_arcCir.getContext("2d");
 				var value = this.score / 100; //得分占比
 				var count = 0;
 				var animation = () => {
 					count += 0.01;
 					// 清除上次绘画进度条
 					cxt_arc.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
 					cxt_arc.lineWidth = this.lineWidth;

 					// 颜色渐变-横向渐变
 					var my_gradient = cxt_arc.createLinearGradient(0, 0, this.canvasWidth, 0);
 					my_gradient.addColorStop(1, "#FF88CE");
 					my_gradient.addColorStop(0, "orange");
 					cxt_arc.strokeStyle = my_gradient;

 					cxt_arc.lineCap = 'round';
 					cxt_arc.beginPath();
 					cxt_arc.arc(this.canvasWidth / 2, this.canvasWidth / 2, this.canvasWidth / 2 - this.lineWidth * 3,
 						0.8 * Math.PI, count * (1.4 * Math.PI) + 0.8 * Math.PI, false);
 					cxt_arc.stroke();

 					if (count >= value) {
 						this.clearTime();
 					}
 				}
 				this.varName = setInterval(animation, 30);
 			},
 		}
 	};
 </script>

 <style scoped lang='scss'>
 	.circle_box {
 		width: 470px;
 		height: 470px;
 		position: absolute;
 		margin: auto;
 		left: 0;
 		top: 0;
 		right: 0;
 		bottom: 0;
 		box-sizing: border-box;
 	}

 	.circle {
 		position: absolute;
 		left: 0;
 		right: 0;
 		margin: auto;
 		width: 100%;
 		height: 100%;
 	}

 	.circleText {
 		text-align: center;
 		position: absolute;
 		display: flex;
 		flex-direction: column;
 		justify-content: center;
 		align-items: center;
 		margin: auto;
 		width: 100%;
 		height: 100%;
 		left: 0;
 		top: 0;
 		right: 0;
 		bottom: 0;

 		.score {
 			color: #FF7600;
 			font-size: 80px;
 		}

 		.desc {
 			font-size: 30px;
 		}
 	}
 </style>
