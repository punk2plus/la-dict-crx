
import md5 from "md5";
import request from "../../../utils/request";
import youdaoConfig from "../../../../config/youdao";

export async function addWordBook (message, sender, sendResponse) {
  const queryResult = message.result.queryResult;
  const resultFlag = await saveToWordBook(queryResult.query);
  if (resultFlag) { 
    sendResponse('添加成功'); 
  } else {
    sendResponse('添加失败');
  }
}

export async function saveCustomerToWordBook  (message, sender, sendResponse)  {
  const en = message.result.en;
  const resultFlag = await saveToWordBook(en);
  if (resultFlag) { 
    sendResponse('添加成功'); 
  } else {
    sendResponse('添加失败');
  }
}

export async function saveCusToWordBook (en)  {
  const data = await idbQuery(en)
  if (data) {
    // 更新逻辑
    const item = getPutWordObj(data)
    return await idbPut(item);
  } else {
    // 添加逻辑
    const item = getCusAddWordObj(result)
    return await idbAdd(item)
  }
} 

export async function fetchQueryWord   (queryWord, sendResponse)  {
  request({
    url: getYoudaoUrl(queryWord),
    method: "get",
    data: {}
  })
    .then(data => {
      sendResponse(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function getYoudaoUrl(queryWord) {
  const salt = new Date().getTime();
  const BASE_URL = youdaoConfig.baseUrl;
  const appKey = youdaoConfig.appKey;
  const appSecret = youdaoConfig.appSecret;

  const genSecret = appKey + queryWord + salt + appSecret;
  const sign = md5(genSecret);

  return `${BASE_URL}?q=${queryWord}&from=auto&to=auto&appKey=${appKey}&salt=${salt}&sign=${sign}`;
}




export async function  saveToWordBook(en) {
  const data = await idbQuery(en)
  if (data) {
    // 更新逻辑
    const item = getPutWordObj(data)
    return await idbPut(item);
  } else {
    // 添加逻辑
    const item = getAddWordObj(result)
    return await idbAdd(item)
  }
}




