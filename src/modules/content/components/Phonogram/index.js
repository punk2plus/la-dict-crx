import React from 'react';
import style from './index.css';

export default class Phonogram extends React.PureComponent {
  render() {
    const { usPhonetic, ukPhonetic } = this.props;
    if (!usPhonetic) return null;
    return (
      <div className={style.cePhonogram}>
        英 <span className={style.ceSpan}> [{ukPhonetic}] </span>
        美 <span className={style.ceSpan}> [{usPhonetic}] </span>
      </div>
    );
  }
}

