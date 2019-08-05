require('shelljs/global');

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'build/utils/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'build/utils/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => cp(task.from, task.to));
};

exports.copyAssets = (fileName, env) => {
  rm('-rf', fileName);
  mkdir(fileName);
  cp(`chrome/manifest.${env}.json`, `${fileName}/manifest.json`);
  cp('-R', 'chrome/assets/*', fileName);
  exec(`pug -O "{ env: '${env}' }" -o ${fileName} chrome/views/`);
};
