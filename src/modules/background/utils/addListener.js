
const request = require('../../../utils/request');
const dbWorldList = require('./indexedDB/dbHelper');
const { getYoudaoUrl, getYoudaoVioceUrl } = require('./api/config');

const voice = new Audio();

function fetchQueryWord(queryWord, sendResponse) {
  request({
    url: getYoudaoUrl(queryWord),
    method: 'get',
    data: {}
  }).then((data) => {
    sendResponse(data);
  }).catch((error) => {
    console.log(error);
  });
}

async function saveToWordBook(result) {
  const data = await dbWorldList.query(result.query);
  if (!data) {
    const item = {
      cn: result.translation[0],
      en: result.query,
      times: 1
    };
    if (await dbWorldList.add(item)) return true;
    return false;
  }
  return await dbWorldList.update(data.en, data.times);
}

async function saveCustomerToWordBook(result) {
  const data = await dbWorldList.query(result.en);
  if (!data) {
    const item = {
      cn: result.cn,
      en: result.en,
      times: 1
    };
    if (await dbWorldList.add(item)) return true;
    return false;
  }
  return await dbWorldList.update(data.en, data.times);
}

function playAudio(queryWord) {
  if (voice.src && !voice.ended) {
    voice.load();
  }
  voice.src = getYoudaoVioceUrl(queryWord, 1);
  voice.play();
}


exports.addListener = async (message, sendResponse) => {
  if (message.type !== undefined && message.type === 'selectText') {
    const queryWord = message.result.queryWord;
    fetchQueryWord(queryWord, sendResponse);
  }

  if (message.type === 'playAudio') {
    const queryWord = message.result.queryWord;
    playAudio(queryWord);
  }

  if (message.type === 'addWordBook') {
    const queryResult = message.result.queryResult;
    const resultFlag = await saveToWordBook(queryResult);

    if (resultFlag) { sendResponse('添加成功'); } else {
      sendResponse('添加失败');
    }
  }
  if (message.type === 'addCustomerWordBook') {
    const queryResult = message.result.queryResult;
    const resultFlag = await saveCustomerToWordBook(queryResult);

    if (resultFlag) { sendResponse('添加成功'); } else {
      sendResponse('添加失败');
    }
  }
};

