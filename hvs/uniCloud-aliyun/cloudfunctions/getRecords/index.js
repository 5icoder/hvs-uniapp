'use strict';
const db = uniCloud.database()
const {
	getFormatDate
} = require('moment')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		form_id,
		register_id
	} = event
	
	// 获取今日时间
	const create_date = getFormatDate('today')
	
	const record = await db.collection("hvs-forms-record").where({
		form_id,
		register_id,
		"record.create_date": create_date
	}).get()

	const image = [
		"//vkceyugu.cdn.bspapp.com/VKCEYUGU-a0ff070e-a200-4659-9bd1-b211b31246e1/9696d9e2-dca2-498d-bcc8-4650d5c845d2.png",
		"//vkceyugu.cdn.bspapp.com/VKCEYUGU-a0ff070e-a200-4659-9bd1-b211b31246e1/47c30f49-82fb-4470-be2a-b43327d0ea17.png"
	]
	let res_data = {}
	if (record.data.length===0) {
		res_data = {
			records: [],
			image: image[0]
		}
	} else {
		if (record.data[0].record.status === 0) {
			res_data = {
				records: record.data[0].record.data,
				image: image[0]
			}
		} else {
			res_data = {
				records: record.data[0].record.data,
				image: image[1]
			}
		}
	}
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: res_data
	}
};
