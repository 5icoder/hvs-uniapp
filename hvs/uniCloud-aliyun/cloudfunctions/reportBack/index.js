'use strict';
const db = uniCloud.database()
const $ = db.command
const {
	getFormatDate
} = require('moment')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		register_id,
		form_id,
		form
	} = event

	// 查询当前用户信息
	const userInfo = await db.collection('uni-id-users').where({
		register_id
	}).get()
	const user = userInfo.data[0]
	
	// 获取今日日期
	const create_date = getFormatDate('today')

	// 判断当前用户健康状况
	let status = 0
	if (form.abnormal === '1' || form.caseContact === '1') {
		status = 1
	}
	
	// 如果存在异常则写入日志
	if(status){
		let desc = '', type = ''
		if (form.abnormal === '1' && form.caseContact === '1') {
			desc = `${getFormatDate('now') + ' ' + user.username + '接触感染者，体温异常'}`
			type = 2
		}else if (form.abnormal === '1') {
			desc = `${getFormatDate('now') + ' ' + user.username + '上报体温异常'}`
			type = 0
		}else if(form.caseContact === '1'){
			desc = `${getFormatDate('now') + ' ' +  user.username + '接触感染者'}`
			type = 2
		}
		await db.collection('hvs-log').add({
			create_date: create_date,
			type,
			desc,
			register_id,
			pricipal: user.pricipal
		})
	}

	// 查询数据库中该用户是否已经存在当前表单今天的记录
	const record = await db.collection("hvs-forms-record").where({
		form_id,
		register_id,
		"record.create_date": create_date
	}).get()

	// 如果存在记录则更新体温，如果不存在则新增一条数据
	if (record.data.length > 0) {
		await db.collection("hvs-forms-record").where({
			form_id,
			register_id,
			"record.create_date": create_date
		}).update({
			record: {
				data: form,
				status
			}
		})
	} else {
		await db.collection("hvs-forms-record").add({
			form_id,
			register_id,
			record: {
				data: form,
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
