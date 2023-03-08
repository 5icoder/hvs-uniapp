'use strict';
// 获取集合的引用
const db = uniCloud.database()
const dbCmd = db.command
// 导入moment模块，用于处理时间相关逻辑
const {getFormatDate} = require('moment')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		register_id,
		form_id,
		temp
	} = event

  // 获取今日时间
	const create_date = getFormatDate('today')
	// 当前用户健康状况，如果存在异常则写入日志
	const status = temp >= 37.5 ? 1 : 0

	// 查询当前用户信息
	const userInfo = await db.collection('uni-id-users').where({
		register_id
	}).get()
	const user = userInfo.data[0]

	// 存在异常则写入日志
	if (status) {
		let desc =  `${getFormatDate('now') + ' ' + user.username+ '上报体温异常'}`
		await db.collection('hvs-log').add({
			create_date,
			type: 0,
			desc,
			register_id,
			pricipal: user.pricipal
		})
	}

	// 查询数据库中是否有今日该表单的统计记录
	const fillStatistics = await db.collection('hvs-statistics').where({
		form_id,
		statistics_date: create_date,
		register_id: user.pricipal
	}).get()
	
	// 字段默认值
	let fill_times = 1			 // 填报人数
	let abnormal_number = 1  // 异常人数
	let filled_ids = []      // 已填报的用户id
	let abnormal_ids = []    // 异常的用户id
	
	
	// 如果当日统计记录存在，则更新统计记录，否则新增一条统计记录
	if (fillStatistics.data.length > 0) {
		// 判断该用户是否已经被统计到填报记录，如果没有填表人数加1并记录在已填报记录
		filled_ids = fillStatistics.data[0].filled_ids
		fill_times = fillStatistics.data[0].fill_times
		if(!filled_ids.includes(register_id)){
			fill_times++
			filled_ids.push(register_id)
		}
		// 再判断用户是否被统计到异常记录，如果没有异常人数加1并记录在异常记录
		abnormal_ids = fillStatistics.data[0].abnormal_ids
		abnormal_number = fillStatistics.data[0].abnormal_number
		if(status && !abnormal_ids.includes(register_id)){
			abnormal_number++
			abnormal_ids.push(register_id)
		}
		// 更新统计数据
		await db.collection('hvs-statistics').where({
			form_id,
			statistics_date: create_date,
			register_id: user.pricipal
		}).update({
			fill_times,
			abnormal_number,
			filled_ids,
			abnormal_ids
		})
	} else {
		filled_ids.push(register_id)
		// 判断用户是否被统计到异常记录
		if(status){
			abnormal_ids.push(register_id)
		}
		// 新增一条统计数据
		await db.collection('hvs-statistics').add({
			form_id,
			statistics_date: create_date,
			register_id: user.pricipal,
			fill_times,
			abnormal_number,
			filled_ids,
			abnormal_ids
		})
	}

	// 查询数据库中该用户是否已经存在当前表单今天的记录
	const record = await db.collection('hvs-forms-record').where({
		form_id,
		register_id,
		'record.create_date': create_date
	}).get()

	// 如果存在体温记录则更新体温，如果不存在则新增一条数据
	if (record.data.length > 0) {
		let record_status = record.data[0].record.status?record.data[0].record.status:status
		await db.collection('hvs-forms-record').where({
			form_id,
			register_id,
			'record.create_date': create_date
		}).update({
			record: {
				data: dbCmd.push(temp),
				status : record_status
			}
		})
	} else {
		await db.collection('hvs-forms-record').add({
			form_id,
			register_id,
			record: {
				data: [temp],
				create_date,
				status
			}
		})
	}

	// 返回数据给客户端
	return {
		code: 200,
		msg: '上报成功'
	}
};
