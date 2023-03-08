'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const formInfo = await db.collection('hvs-form').get()
	
	//返回数据给客户端
	return {
		code: 200,
		msg: "数据请求成功",
		data: formInfo.data
	}
};
