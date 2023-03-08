import $http from '../common/http.js'

/**
 * 所有api集中在此统一管理
 */

// 表单信息查询
export const getFormInfo = (data) => {
	return $http({
		url: 'getFormInfo',
		data
	})
}

// 信息上报
export const reportRecord = (data) => {
	return $http({
		url: 'reportRecord',
		data
	})
}

// 检查表单是否已填
export const checkFill = (data) => {
	return $http({
		url: 'checkFill',
		data
	})
}

// 体温记录查询
export const getRecords = (data) => {
	return $http({
		url: 'getRecords',
		data
	})
}

// 查询最近7天的体温记录
export const getHistory = (data) => {
	return $http({
		url: 'getHistory',
		data
	})
}

// 查询最近7天的日志
export const getLog = (data) => {
	return $http({
		url: 'getLog',
		data
	})
}

// 查询最近7天的统计
export const getStatistics = (data) => {
	return $http({
		url: 'getStatistics',
		data
	})
}

// 获取文章列表
export const getArticleList = (data) => {
	return $http({
		url: 'getArticleList',
		data
	})
}

// 获取文章详情
export const getArticleDetail = (data) => {
	return $http({
		url: 'getArticleDetail',
		data
	})
}
