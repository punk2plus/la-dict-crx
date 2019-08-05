import Dexie from 'dexie';

function initDb() {
  const db = new Dexie('lldict_db');
  db.version(1).stores({ wordList: 'en,cn,times,createTime,updateTime,flagExport' });
  return db;
}
// 添加数据
exports.query = async (en) => {
  const db = initDb();
  return await db.transaction('rw', db.wordList, async() => {
    const resultArry = await db.wordList.where({ en }).toArray();
    return resultArry[0];
  }).catch((e) => {
    console.log(e);
  });
};

// 添加数据
exports.add = async (data) => {
  const db = initDb();
  return await db.transaction('rw', db.wordList, async() => await db.wordList.add({ en: data.en, cn: data.cn, times: data.times, createTime: new Date().getTime(), updateTime: new Date().getTime(), flagExport: '0' })).catch((e) => {
    console.log(e);
  });
};

  // 更新数据
exports.update = async (en, times) => {
  const db = initDb();
  return await db.wordList.update(en,
    { times: times + 3, updateTime: new Date().getTime() }).then(updated => updated === 1);
};

  // solft delete
exports.softDelete = (en) => {
  const db = new Dexie('lldict_db');
  return db.wordList.update(en,
    { flagExport: 1, updateTime: new Date().getTime() }).then((updated) => {
      console.log(updated);
    });
};

