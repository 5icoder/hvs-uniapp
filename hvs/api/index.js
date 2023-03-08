// 将api批量导出，方便挂载到全局
const requireApi = require.context('.', false, /.js$/)
let module = {}
requireApi.keys().forEach((key,index)=>{
	if(key==='./index.js'){
		return
	}
	Object.assign(module, requireApi(key))
})

export default module