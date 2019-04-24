//logs.js
const util = require('../../utils/util.js')

Page({
    data: {},
    onLoad: function() {

    },
    callback() {
		wx.openSetting({
			success() {
			},
		})
    },
})