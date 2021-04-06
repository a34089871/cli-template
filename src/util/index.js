// 参数对象成员变量转 key-value 添加至 FormData
export const Params2Form = (data, form, name) => {
  if (!data) {
    return null
  }
  const prefixName = name == null ? '' : name + '.'
  const formData = form == null ? new FormData() : form
  for (var i in data) {
    if (data[i] instanceof Array) {
      if (data[i][0] instanceof Object) {
        for (var j in data[i]) {
          Params2Form(data[i][j], formData, prefixName + i + '[' + j + ']')
        }
      } else {
        formData.append(prefixName + i, data[i].join(','))
        console.log(prefixName + i + ';' + data[i].join(','))
      }
    } else if (data[i] instanceof File) {
      formData.append(i, data[i])
    } else if (data[i] instanceof Object) {
      Params2Form(data[i], formData, prefixName + i)
    } else {
      formData.append(prefixName + i, data[i])
      console.log(prefixName + i + ';' + data[i])
    }
  }
  return formData

}

export const fieldTypeList = [{
  label: '整型（I）',
  value: 'NUMBER'
}, {
  label: '时间型（T）',
  value: 'TIME'
}, {
  label: '字符型（C）',
  value: 'VARCHAR2'
}, {
  label: '日期型（D）',
  value: 'DATE'
}, {
  label: '时间戳（P）',
  value: 'TIMESTAMP'
}, {
  label: '大字段（M）',
  value: 'CLOB'
}, {
  label: '浮点型（N）',
  value: 'DOUBLE'
}, {
  label: '逻辑型（L）',
  value: 'TINYINT'
}, {
  label: '二进制（X）',
  value: 'BLOB'
}]

