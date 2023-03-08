'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
exports.main = async (event, context) => {
	const list = await db.collection('hvs-article')
		.aggregate()
		.group({
			_id: '$category',
			list: $.push({
				_id: '$_id',
				title: '$title',
				author: '$author',
				create_date: '$create_date',
				cover: '$cover'
			})
		})
		.end()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
