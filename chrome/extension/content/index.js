import React from 'react';
import { render } from 'react-dom';
import Root from '../../../src/modules/content/Root';

// 初始化dom
window.addEventListener('load', () => {
  const contentDOM = document.createElement('div');
  contentDOM.className = 'content-script-react';
  document.body.appendChild(contentDOM);
  render(<Root />, contentDOM);
});
