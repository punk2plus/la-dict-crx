import React, { Component } from 'react';
import style from './App.css';
import Phonogram from './components/Phonogram';
import CusInputContent from './components/CusInputContent';
import DictTip from './components/DictTip';
import WebExplain from './components/WebExplain';
import BaseExplain from './components/BaseExplain';
import DictHeader from './components/DictHeader';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryWord: '',
      queryResult: null,
      timer: null,
      tip: '',
      inputWordEn: '',
      inputWordCn: '',
      showInput: false
    };
  }

  componentDidMount() {
    document.documentElement.addEventListener('mouseup', (event) => {
      if (event.type === 'selectstart') return;
      // 获取选中内容
      const selection = window.getSelection && window.getSelection();
      // 过来为空的情况
      if (!selection && selection.rangeCount === 0) return;
      const selectText = selection.toString().trim();
      if (!selectText) return;

      if (this.state.timer) {
        return;
      }

      const timer = setTimeout(() => {
        chrome.runtime.sendMessage({
          type: 'selectText',
          result: {
            queryWord: selectText
          }
        }, (data) => {
          console.log('===data=>>>', data);
          this.setState({
            queryResult: data,
            queryWord: selectText,
            timer: null
          });
        });
      }, 50);

      this.setState({
        timer
      });
    });

    this.listernerKeydown();
  }
  listernerKeydown = () => {
    document.documentElement.addEventListener('keydown', (event) => {
      const S_KEYCODE = 83;
      const D_KEYCODE = 68;
      const C_KEYCODE = 67;
      const V_KEYCODE = 86;
      const X_KEYCODE = 88;
      const B_KEYCODE = 66;
      console.log(event.keyCode);


      if (event.keyCode === S_KEYCODE && event.altKey) {
        return this.setState({
          tip: 'unable'
        });
      }
      if (event.keyCode === D_KEYCODE && event.altKey) {
        return this.setState({
          tip: 'enable'
        });
      }
      if (event.keyCode === C_KEYCODE && event.altKey) {
        // save
        return this.addWordBook();
      }
      if (event.keyCode === V_KEYCODE && event.altKey) {
        return this.palyAudio();
      }
      if (event.keyCode === B_KEYCODE && event.altKey) {
        return this.setState({
          showInput: !this.state.showInput,
          inputWordEn: this.state.queryWord
        });
      }

      if (event.keyCode === X_KEYCODE && event.altKey) {
        // 保存自定义输入
        this.addCustomerWordBook();
        return false;
      }
    });
  }

  palyAudio = () => {
    chrome.runtime.sendMessage({
      type: 'playAudio',
      result: {
        queryWord: this.state.queryWord
      }
    });
  }

  addWordBook = () => {
    chrome.runtime.sendMessage({
      type: 'addWordBook',
      result: {
        queryResult: this.state.queryResult
      }
    }, (text) => {
      this.setState({
        tip: text
      });
    });
  }

  addCustomerWordBook = () => {
    const { inputWordEn, inputWordCn } = this.state;

    if (!inputWordCn) {
      return;
    }

    const queryResult = {
      en: inputWordEn,
      cn: inputWordCn
    };
    chrome.runtime.sendMessage({
      type: 'addCustomerWordBook',
      result: {
        queryResult
      }
    }, (text) => {
      this.setState({
        tip: text
      });

      setTimeout(() => {
        this.setState({
          showInput: false,
          inputWordEn: '',
          inputWordCn: ''
        });
      }, 5000);
    });
  }

  handelChangeEn = (e) => {
    if (e.target.value.match('≈') || e.target.value.match('√')) return false;
    this.setState({
      inputWordEn: e.target.value
    });
  };

  handelChangeCn = (e) => {
    if (e.target.value.match('≈') || e.target.value.match('√')) return false;
    this.setState({
      inputWordCn: e.target.value
    });
  };

  render() {
    const { queryResult, queryWord, tip, showInput, inputWordEn, inputWordCn } = this.state;
    if (!queryResult || !queryWord) return null;
    const { basic, web } = queryResult;
    const explains = basic ? basic.explains : [];
    const cn = queryResult.translation[0];
    const ukPhonetic = basic ? basic['uk-phonetic'] : '';
    const usPhonetic = basic ? basic['us-phonetic'] : '';

    return (
      <div className={style.ceContent}>
        {/* 查询header */}
        <DictHeader
          queryWord={queryWord}
          addWordBook={this.addWordBook}
          palyAudio={this.palyAudio}
        />
        {/* 中文含义 */}
        <div className={style.ceCn}>{cn}</div>
        {/* 音标 */}
        <Phonogram ukPhonetic={ukPhonetic} usPhonetic={usPhonetic} />
        {/* 基本释义 */}
        <BaseExplain explains={explains} />
        {/* 网络释义 */}
        <WebExplain web={web} />
        {/* 自定义输入框 */}
        <CusInputContent
          showInput={showInput}
          handelChangeEn={this.handelChangeEn}
          handelChangeCn={this.handelChangeCn}
          inputWordEn={inputWordEn}
          inputWordCn={inputWordCn}
        />
        {/* toast */}
        <DictTip tip={tip} />
      </div>
    );
  }
}

