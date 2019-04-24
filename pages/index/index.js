//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
		visible: false,
		name: '这是小程序海报生成示例',
		posterPath: '/pages/images/poster.jpg',
		qrCodePath: '/pages/images/qr.png',
    },
	customData: {
		ctx: null,
	},
    onLoad: function() {
	},

	// 绘制海报
	drawPoster() {
		let _ = this;
		this.customData.ctx = wx.createCanvasContext('firstCanvas');
		// 获取画布的宽高
		wx.createSelectorQuery().select('#canvas').boundingClientRect(function (rect) {
			let canvasWidth = rect.width;
			let canvasHeight = rect.height;

			// 清除画布
			_.customData.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			// 绘制背景
			_.customData.ctx.rect(0, 0, canvasWidth, canvasHeight);
			_.customData.ctx.setFillStyle('white');
			_.customData.ctx.fill();

			// 获取海报图片信息
			wx.getImageInfo({
				src: _.data.posterPath,
				success(res) {
					// 绘制海报
					let posterHeight = canvasHeight - 100;	// 海报高度
					let posterWidth = res.width;
				
					if (posterWidth > canvasWidth) {		// 海报比画布宽
						let offsetX = (posterWidth - canvasWidth) / 2;
						_.customData.ctx.drawImage(_.data.posterPath, offsetX, 0, canvasWidth, posterHeight, 0, 0, canvasWidth, posterHeight);

					}else {
						let offsetX = (canvasWidth - posterWidth) / 2;
						_.customData.ctx.drawImage(_.data.posterPath, 0, 0, posterWidth, posterHeight, offsetX, 0, posterWidth, posterHeight);
					}

					// 绘制文字
					_.customData.ctx.setFillStyle('#31312E');
					_.customData.ctx.setFontSize(14);
					_.customData.ctx.fillText(_.data.name, 15, posterHeight + 56);
					// 绘制二维码
					wx.getImageInfo({
						src: _.data.qrCodePath,
						success(res) {
							_.customData.ctx.drawImage(_.data.qrCodePath, 0, 0, res.width, res.height, canvasWidth - 80 - 10, posterHeight + 10, 80, 80);
							_.customData.ctx.draw();
						}
					});
					// 绘制按钮

				}
			})

		}).exec();
	},

	// 打开海报
	openPoster() {
		this.setData({visible: true});
		this.drawPoster();
	},

	// 关闭海报
	closePoster() {
		this.setData({visible: false});
	},

	// 将海报存入相册
	doSave() {
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			canvasId: 'firstCanvas',
			success(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success(res) {
						wx.showToast({
							title: '保存成功',
						})
					},
					fail(err) {
						wx.showToast({
							title: '请确保您的微信已取得手机相册授权',
							icon: '',
						})
					}
				})
			},
			fail(err) {
				wx.showToast({
					title: '保存失败',
				})
			},
		})
	},

	// 保存海报
	savePoster() {
		let _ = this;
		wx.getSetting({
			success(res) {
				// 查询用户是否授权
				if (res.authSetting['scope.writePhotosAlbum']) {
					_.doSave();
				}else {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							_.doSave();
						},
						fail() {
							wx.navigateTo({
								url: '/pages/logs/logs',
							})
						}
					})
				}
			}
		})
	},

	
})