import React from 'react';
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux'
import { isEmpty } from 'react-redux-firebase'
import { Snackbar, Button } from '@material-ui/core';
import preval from 'preval.macro';

import Layout from './containers/Layout';
import Home from './containers/Home';
import Settings from './containers/Settings';
import Direction from './containers/Direction';
import SignIn from './containers/SignIn';
import Profile from './containers/Profile';

import { useServiceWorker } from './serviceWorkerProvider';

const Router = () => {
  const auth = useSelector(state => state.firebase.auth);
  const isLogin = !isEmpty(auth);
  const { assetsUpdateReady, updateAssets } = useServiceWorker();

  return (
    <HashRouter>
      {isLogin && !assetsUpdateReady ? (
        <Layout>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/settings" exact component={Settings}/>
            <Route path="/direction/:dirUid" exact component={Direction}/>
            <Route path="/profile" exact component={Profile}/>
            <Redirect to="/"/>
          </Switch>
        </Layout>
      ) : (
        <Switch>
          <Route path="/" exact component={SignIn}/>
          <Redirect to="/"/>
        </Switch>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={assetsUpdateReady}
        message="Доступна новая версия"
        action={
          <Button color="secondary" size="small" onClick={updateAssets}>
            Обновить
          </Button>
        }
      />
      <p style={{ position: 'fixed', top: 0, right: 70, zIndex: 9999, fontSize: 9 }}>
        Build Date: {preval`module.exports = new Date().toLocaleString();`}.
      </p>
    </HashRouter>
  );
};

export default Router;
