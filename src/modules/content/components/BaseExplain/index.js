import React from 'react';
import style from './index.css';
export default class BaseExplain extends React.PureComponent {
  render() {
    const { explains } = this.props;
    console.log(explains);
    if (!explains) return null;
    const explainItems = explains.map((item, index) => <div key={index} >{item}</div>);

    return (
      <div className={style.ceExplain} >{ explainItems }</div>
    );
  }
}

