'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const {
	getFormatDate
} = require('moment')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		register_id
	} = event

	const form_id = "CODE_FORM_001"

	const statistics = await db.collection("hvs-statistics").where({
		register_id,
		form_id
	}).field({
		_id: true,
		fill_times: true,
		abnormal_number: true,
		statistics_date: true
	}).get()
	
	const dataList = statistics.data.reverse()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: statistics.data
	}
};
