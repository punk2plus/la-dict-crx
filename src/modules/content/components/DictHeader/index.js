import React from 'react';
import style from './index.css';

export default class DictHeader extends React.PureComponent {
  render() {
    const { queryWord, addWordBook, palyAudio } = this.props;
    if (!queryWord) return null;

    return (
      <div>
        {queryWord}
        <div className={style.ceBtn} onClick={addWordBook} />
        <div className={style.ceVoiceContainer} onClick={palyAudio} />
      </div>
    );
  }
}

