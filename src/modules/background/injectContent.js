function isInjectedContent(tabId) {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: `var injectedContent = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injectedContent;`,
    runAt: 'document_start'
  });
}

function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
    .then(res => res.text())
    .then((fetchRes) => {
      // Load redux-devtools-extension content bundle,
      // because content script and page is in a different context
      const request = new XMLHttpRequest();
      request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js');  // sync
      request.send();
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
        }
      };
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
  }
}

// const arrowURLs = ['^https://github\\.com'];
// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;

//   const result = await isInjectedContent(tabId);
//   if (chrome.runtime.lastError || result[0]) return;

//   loadScript('content', tabId, () => console.log('load content bundle success!'));
// });

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== 'loading') return;
  await isInjectedContent(tabId);
  loadScript('content', tabId, () => console.log('load content bundle success!'));
});
