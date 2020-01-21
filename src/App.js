import React from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

import { store, rrfProps } from './store';

import Router from './router';

const App = () => (
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router />
    </ReactReduxFirebaseProvider>
  </Provider>
);

export default App;
