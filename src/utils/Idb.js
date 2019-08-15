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
  await db.add('wordList',data);
}

async function idbQuery(key) {
  const db = await getDb()
  return await db.get('wordList', key);
}