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

	const record = await db.collection("hvs-log").where({
		"pricipal": register_id,
		"create_date": dbCmd.in(getFormatDate('nearly_week'))
	}).field({"pricipal": false}).get()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: record.data
	}
};
