
import { fetchQueryWord, addWordBook, saveCustomerToWordBook } from './queryWord'
import { playAudio } from './audio'


export function initChromeEvent() {
  window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== undefined && message.type === "selectText") {
      const queryWord = message.result.queryWord;
      fetchQueryWord(queryWord, sendResponse);
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
      const resultFlag = saveCustomerToWordBook(queryResult);

      if (resultFlag) { sendResponse('自定义添加成功'); } else {
        sendResponse('自定义添加失败');
      }
    }
    return true;
  });
}