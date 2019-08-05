const bluebird = require('bluebird');
const chromeUtils = require('./utils/addListener');
// const dict = require('../../../config/dict');


global.Promise = bluebird;
function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
  'contextMenus'
]);

promisifyAll(chrome.storage, [
  'local',
]);

//监听 content 页面传来的值
chrome.runtime.onMessage.addListener(
(message, sender, sendResponse) => {
  chromeUtils.addListener(message, sendResponse);
  return true;
});

require('./contextMenus');
require('./injectContent');
require('./badge');
