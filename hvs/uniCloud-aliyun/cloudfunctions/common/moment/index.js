const moment = require('moment')

/**
 * ['now']：YYYY-MM-DD HH:mm:ss，['today']：YYYY-MM-DD，['nearly_week']：Array['YYYY-MM-DD']
 * @param {String} time_format
 */
function getFormatDate(time_format){
	if(time_format==='now'){
		return moment().format('HH:mm:ss')
	}else if(time_format==='today'){
		return moment().format('YYYY-MM-DD')
	}else if(time_format==='nearly_week'){
		let date_arr = []
		for (let i = 0; i < 7; i++) {
			date_arr.push(moment().subtract(i, 'days').format('YYYY-MM-DD'))
		}
		return date_arr
	}
}

module.exports =  {
	getFormatDate
}
