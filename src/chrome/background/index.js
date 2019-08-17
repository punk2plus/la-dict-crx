// 代码来源：https://github.com/xpl/crx-hotreload/edit/master/hot-reload.js

import './app/crx-hotreload'
import request from "../../utils/request";
import youdaoConfig from "../../../config/youdao";
import settings from "../../../config/dict";

import md5 from "md5";
import { openDB } from 'idb/with-async-ittr.js';

const voice = new Audio();
//监听 content 页面传来的值
window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== undefined && message.type === "selectText") {
    const queryWord = message.result.queryWord;
    fetchQueryWord(queryWord, sendResponse);
    dictSetting()
  }

  if (message.type === 'playAudio') {
    const queryWord = message.result.queryWord;
    playAudio(queryWord);
  }

  if (message.type === 'addWordBook') {
    addWordBook(message, sender, sendResponse)
  }

  if (message.type === 'addCustomerWordBook') {
    const queryResult = message.result.queryResult;
    const resultFlag =  saveCustomerToWordBook(queryResult);

    if (resultFlag) { sendResponse('添加成功'); } else {
      sendResponse('添加失败');
    }
  }
  return true;
});

async function  addWordBook (message, sender, sendResponse) {
  const queryResult = message.result.queryResult;
  const resultFlag = await saveToWordBook(queryResult.query);
  if (resultFlag) { 
    sendResponse('添加成功'); 
  } else {
    sendResponse('添加失败');
  }
}

async function saveCustomerToWordBook(message, sender, sendResponse) {
  const en = message.result.en;
  const resultFlag = await saveToWordBook(en);
  if (resultFlag) { 
    sendResponse('添加成功'); 
  } else {
    sendResponse('添加失败');
  }
}

async function saveCusToWordBook(en) {
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

function fetchQueryWord(queryWord, sendResponse) {
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

function getYoudaoVioceUrl(queryWord, type = 1) {
  // type=1  英音
  // type=2  美音
  const BASE_URL = youdaoConfig.voiceUrl
  return `${BASE_URL}?audio=${queryWord}&type=${type}`
}

function playAudio(queryWord) {
  if (voice.src && !voice.ended) {
    voice.load();
  }
  voice.src = getYoudaoVioceUrl(queryWord, 1);
  voice.play();
}

async function saveToWordBook(en) {
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

/**** idb 接口封装 *******/
async function getDb() {
  const db = await openDB('lldict_db', 1, {
    upgrade(db) {
      const store = db.createObjectStore("wordList", { keyPath: "en" });
      store.createIndex("en", "en", { unique: false });
    },
  })
  return db
}

async function idbAdd(data) {
  const db = await getDb()
  return await db.add('wordList',data);
}

async function idbQuery(key) {
  const db = await getDb()
  return await db.get('wordList', key);
}


async function idbPut(data) {
  const db = await getDb()
  return await db.put('wordList',data);
}

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


function dictSetting () {
  window.chrome.storage.sync.get(null,function (items) {
    //todo
  });
  
}


