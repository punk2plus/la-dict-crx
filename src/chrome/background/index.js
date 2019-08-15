// 代码来源：https://github.com/xpl/crx-hotreload/edit/master/hot-reload.js

import request from "../../utils/request";
import youdaoConfig from "../../../config/youdao";
import md5 from "md5";

const filesInDirectory = dir =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries =>
      Promise.all(
        entries
          .filter(e => e.name[0] !== ".")
          .map(e =>
            e.isDirectory
              ? filesInDirectory(e)
              : new Promise(resolve => e.file(resolve))
          )
      )
        .then(files => [].concat(...files))
        .then(resolve)
    )
  );

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files =>
    files.map(f => f.name + f.lastModifiedDate).join()
  );

const reload = () => {
  window.chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    tabs => {
      // NB: see https://github.com/xpl/crx-hotreload/issues/5
      if (tabs[0]) {
        window.chrome.tabs.reload(tabs[0].id);
      }
      window.chrome.runtime.reload();
    }
  );
};

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
      reload();
    }
  });
};

window.chrome.management.getSelf(self => {
  if (self.installType === "development") {
    // debugger
    window.chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
  }
});

//监听 content 页面传来的值
window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // debugger
  if (message.type !== undefined && message.type === "selectText") {
    const queryWord = message.result.queryWord;
    fetchQueryWord(queryWord, sendResponse);
  }

  //   if (message.type === 'playAudio') {
  //     const queryWord = message.result.queryWord;
  //     playAudio(queryWord);
  //   }

  //   if (message.type === 'addWordBook') {
  //     const queryResult = message.result.queryResult;
  //     const resultFlag = await saveToWordBook(queryResult);

  //     if (resultFlag) { sendResponse('添加成功'); } else {
  //       sendResponse('添加失败');
  //     }
  //   }
  //   if (message.type === 'addCustomerWordBook') {
  //     const queryResult = message.result.queryResult;
  //     const resultFlag = await saveCustomerToWordBook(queryResult);

  //     if (resultFlag) { sendResponse('添加成功'); } else {
  //       sendResponse('添加失败');
  //     }
  //   }
  return true;
});

function fetchQueryWord(queryWord, sendResponse) {
  // eslint-disable-next-line no-debugger
  debugger;
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

// function getYoudaoVioceUrl(queryWord, type = 1) {
//     // type=1  英音
//     // type=2  美音
//     const BASE_URL = youdaoConfig.voiceUrl
//     return `${BASE_URL}?audio=${queryWord}&type=${type}`
// }
