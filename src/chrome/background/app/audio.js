
import youdaoConfig from "config/youdao";

const voice = new Audio();

function getYoudaoVioceUrl(queryWord, type = 1) {
  // type=1  英音
  // type=2  美音
  const BASE_URL = youdaoConfig.voiceUrl
  return `${BASE_URL}?audio=${queryWord}&type=${type}`
}

export function playAudio(queryWord) {
  if (voice.src && !voice.ended) {
    voice.load();
  }
  voice.src = getYoudaoVioceUrl(queryWord, 1);
  voice.play();
}
