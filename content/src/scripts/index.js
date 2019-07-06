import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';

import App from './components/app/App';

// import WebFont from 'webfontloader';



const proxyStore = new Store({ portName: 'lightningReaderExtension' });


const anchor = document.createElement('div');
anchor.id = 'dh-lightning-reader-anchor';


function renderApp() {

  const lightningAnchor = document.getElementById('dh-lightning-reader-anchor');
  if (lightningAnchor) {
    return;
  }

  document.body.insertBefore(anchor, document.body.childNodes[0]);
  proxyStore.ready().then(() => {
    // WebFont.load({
    //   google: {
    //     families: ['Titillium Web', 'sans-serif', 'VT323', 'Montserrat', 'Lato']
    //   }
    // });
    render(
      <Provider store={proxyStore}>
        <App />
      </Provider>
      , document.getElementById('dh-lightning-reader-anchor'));
  });
}

renderApp();


