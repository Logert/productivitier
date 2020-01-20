import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducer';
import initialState from './initialState';

const middlewares = [];

function getEnhancer() {
  return composeWithDevTools(applyMiddleware(...middlewares));
}

const persistConfig = {
  key: 'mvp',
  storage,
};

export const store = createStore(
  persistReducer(persistConfig, rootReducer),
  initialState,
  getEnhancer(),
);

export const persistor = persistStore(store);
