/**** idb 接口封装 *******/
import { openDB } from 'idb/with-async-ittr.js';

async function getDb() {
  const db = await openDB('lldict_db', 1, {
    upgrade(db) {
      const store = db.createObjectStore("wordList", { keyPath: "en" });
      store.createIndex("en", "en", { unique: false });
    },
  })
  return db
}

export async function idbAdd(data) {
  const db = await getDb()
  return await db.add('wordList', data);
}

export async function idbQuery(key) {
  const db = await getDb()
  return await db.get('wordList', key);
}

export async function idbPut(data) {
  const db = await getDb()
  return await db.put('wordList', data);
}
