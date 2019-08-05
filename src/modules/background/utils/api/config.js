
const md5 = require('md5');
const youdaoConfig = require('../../../../../config/youdao');

exports.getYoudaoUrl = (queryWord) => {
  const salt = new Date().getTime();
  const BASE_URL = youdaoConfig.baseUrl;
  const appKey = youdaoConfig.appKey;
  const appSecret = youdaoConfig.appSecret;

  const genSecret = appKey + queryWord + salt + appSecret;
  const sign = md5(genSecret);

  return `${BASE_URL}?q=${queryWord}&from=auto&to=auto&appKey=${appKey}&salt=${salt}&sign=${sign}`;
};

exports.getYoudaoVioceUrl = (queryWord, type = 1) => {
  // type=1  英音
  // type=2  美音
  const BASE_URL = youdaoConfig.voiceUrl;
  return `${BASE_URL}?audio=${queryWord}&type=${type}`;
};
