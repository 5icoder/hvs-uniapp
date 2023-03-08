'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const {getFormatDate} = require('moment')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		register_id
	} = event

	const form_id = "CODE_FORM_001"
	
	const record = await db.collection("hvs-forms-record").where({
		form_id,
		register_id,
		"record.create_date": dbCmd.in(getFormatDate('nearly_week'))
	}).get()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: record.data
	}
};
