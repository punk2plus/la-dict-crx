import React, { Component } from 'react';
import style from './index.css';

export default class DictTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipText: '',
      flag: false
    };
  }

  componentWillReceiveProps(nextPorps) {
    if (nextPorps.tip && nextPorps.tip !== this.props.tip && nextPorps.tip !== this.state.tipText) {
      this.setState({
        flag: true,
        tipText: nextPorps.tip
      });
      this.delayDisappears();
    }
  }

  delayDisappears =() => {
    setTimeout(() => {
      this.setState({
        flag: false,
        tipText: ''
      });
    }, 3000);
  }

  render() {
    const { tip } = this.props;
    const { flag, tipText } = this.state;
    if (!tip || !flag) return null;
    return (<div className={style.ceTip}>{tipText}</div>);
  }
}

