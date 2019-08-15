module.exports =  {
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
  ],
  "globals": {
    "chrome": true
  },
  "rules": {
    "no-console": 0,
    'indent': [2, 2, { 'SwitchCase': 1 }],
  },
  "parserOptions": {
    "parser": "babel-eslint"
  }
}