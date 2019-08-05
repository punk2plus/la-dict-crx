import React from 'react';
import style from './index.css';

export default class CusInputContent extends React.PureComponent {
  render() {
    const { showInput, inputWordEn, inputWordCn, handelChangeEn, handelChangeCn } = this.props;
    if (!showInput || !inputWordEn) return null;

    return (
      <div className={style.ceInputContent} >
        <div><input className={style.ceInput} type="text" value={inputWordEn} onChange={handelChangeEn} defaultValue={inputWordEn} /></div>
        <div><input className={style.ceInput} type="text" value={inputWordCn} onChange={handelChangeCn} /></div>
      </div>
    );
  }
}

