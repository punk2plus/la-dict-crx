// 代码来源：https://github.com/xpl/crx-hotreload/edit/master/hot-reload.js
import './app/crx-hotreload' // 文件修改刷新页面
import { initChromeEvent } from "./app/chrome";
import { initDictConfig } from "./app/initDictConfig";

// 初始化配置文件
initDictConfig()
// 初始化chrome事件
initChromeEvent()


