'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		id
	} = event
	
	const detail = await uniCloud.database().collection('hvs-article').doc(id).get()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: detail.data[0]
	}
};
