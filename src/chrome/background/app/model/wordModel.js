// 添加单词模型
function getAddWordObj (data, times = 1) {
  return {
    cn: data.translation[0],
    en: data.query,
    times: times,
    createTime: new Date().getTime(),
    updateTime: new Date().getTime(),
    flagExport: 0
  };
}

function getPutWordObj (data) {
  data.updateTime = new Date().getTime()
  data.times = data.times + 3
  data.flagExport = 0
  return data
}

function getCusAddWordObj (data, times = 1) {
  return {
    cn: data.cn,
    en: data.cn,
    times: times,
    createTime: new Date().getTime(),
    updateTime: new Date().getTime(),
    flagExport: 0
  };
}