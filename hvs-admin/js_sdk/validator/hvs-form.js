
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "form_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "表单编号"
  },
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "maxLength": 20
      }
    ],
    "label": "标题"
  },
  "enable": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "启用",
            "value": 0
          },
          {
            "text": "禁用",
            "value": 1
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "表单状态"
  },
  "order": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "排序"
  },
  "fields": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "字段"
  }
}

const enumConverter = {
  "enable_valuetotext": {
    "0": "启用",
    "1": "禁用"
  }
}

export { validator, enumConverter }
