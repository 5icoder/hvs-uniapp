'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		register_id,
		form_id
	} = event
	
	const form = await db.collection("hvs-form").where({
		form_id
	}).get()
	const record = await db.collection("hvs-forms-record").where({
		form_id,
		register_id
	}).get()
	
	if(record.data.length>0){
		return {
			code: 200,
			msg: `${form_id}已填写`,
			data: true
		}
	}
	//返回数据给客户端
	return {
		code: 200,
		msg: `${form_id}未填写`,
		data: false
	}
};
