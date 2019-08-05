import React from 'react';
import style from './index.css';

export default class WebExplain extends React.PureComponent {
  render() {
    const { web } = this.props;
    if (!web) return null;
    // 网络释义
    const webExplainItems = web.map((item, index) => {
      const arry = item.value ? item.value.join(',') : null;
      return (<div key={index}>{item.key} :{arry} </div>);
    });

    return (
      <div>
        <div className={style.cediv}>网络释义</div>
        {webExplainItems}
      </div>
    );
  }
}

