
import { dictSetting } from "../../../../config/dict";

function isNullObj(obj) {
  return Object.keys(obj).length === 0
}

export function initDictConfig() {
  window.chrome.storage.sync.get(null, function (items) {
    //todo
    if (isNullObj(items)) {
      window.chrome.storage.sync.set(dictSetting);
    }
    if (!items) {
      window.chrome.storage.sync.set(dictSetting);
    }
  });

}