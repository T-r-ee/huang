// const baseUrl = 'https://unidemo.dcloud.net.cn'
// const request = (url = '', date = {}, type = 'GET', header = {}) => {
// 	return new Promise((resolve, reject) => {
// 		uni.request({
// 			method: type,
// 			url: baseUrl + url,
// 			data: date,
// 			header: header,
// 			dataType: 'json',
// 		}).then((response) => {
// 			setTimeout(function() {
// 				uni.hideLoading();
// 			}, 200);
// 			let [error, res] = response;
// 			resolve(res.data);
// 		}).catch(error => {
// 			let [err, res] = error;
// 			reject(err)
// 		})
// 	});
// }
// export default request


const baseUrl = 'https://iot.tillan.cn/v2/api/'
const request = (options) => {
	return new Promise((resolve, reject) => {
		wx.request({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			header: options.header,
			data: options.data || {},
			success: (res) => {
				resolve(res);
			},

			fail: (err) => {
				reject(err)
			}
		})
	});
}
export default request
