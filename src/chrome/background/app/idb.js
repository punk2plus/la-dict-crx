/**** idb 接口封装 *******/
import { openDB } from 'idb/with-async-ittr.js';

expoerts.getDb = async () => {
  const db = await openDB('lldict_db', 1, {
    upgrade(db) {
      const store = db.createObjectStore("wordList", { keyPath: "en" });
      store.createIndex("en", "en", { unique: false });
    },
  })
  return db
}

expoerts.idbAdd = async (data) => {
  const db = await getDb()
  return await db.add('wordList', data);
}

expoerts.idbQuery = async (key) => {
  const db = await getDb()
  return await db.get('wordList', key);
}

expoerts.idbPut = async (data) => {
  const db = await getDb()
  return await db.put('wordList', data);
}

// 添加单词模型
expoerts.getAddWordObj = (data, times = 1) =>{
  return {
    cn: data.translation[0],
    en: data.query,
    times: times,
    createTime: new Date().getTime(),
    updateTime: new Date().getTime(),
    flagExport: 0
  };
}

expoerts.getPutWordObj = (data) => {
  data.updateTime = new Date().getTime()
  data.times = data.times + 3
  data.flagExport = 0
  return data
}

expoerts.getCusAddWordObj = (data, times = 1) =>  {
  return {
    cn: data.cn,
    en: data.cn,
    times: times,
    createTime: new Date().getTime(),
    updateTime: new Date().getTime(),
    flagExport: 0
  };
}