
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "create_date": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "日期"
  },
  "type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "体温异常",
            "value": 0
          },
          {
            "text": "高风险地区返校",
            "value": 1
          },
          {
            "text": "接触感染者",
            "value": 2
          }
        ]
      }
    ],
    "label": "类型"
  },
  "desc": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "maxLength": 100
      }
    ],
    "label": "描述"
  },
  "register_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "用户编号"
  },
  "pricipal": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "责任人编号"
  }
}

const enumConverter = {
  "type_valuetotext": {
    "0": "体温异常",
    "1": "高风险地区返校",
    "2": "接触感染者"
  }
}

export { validator, enumConverter }
