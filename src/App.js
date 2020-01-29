import React from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { ServiceWorkerProvider } from './serviceWorkerProvider';

import { store, rrfProps } from './store';

import Router from './router';

const App = () => (
  <ServiceWorkerProvider>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Router />
      </ReactReduxFirebaseProvider>
    </Provider>
  </ServiceWorkerProvider>
);

export default App;
