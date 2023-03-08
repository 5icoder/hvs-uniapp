
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "register_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "用户编号"
  },
  "form_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "表单编号"
  },
  "record": {
    "rules": [
      {
        "format": "object"
      }
    ]
  }
}

const enumConverter = {}

export { validator, enumConverter }
