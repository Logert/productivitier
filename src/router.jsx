import React from 'react';
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'

import Layout from './containers/Layout';
import Home from './containers/Home';
import Settings from './containers/Settings';
import Direction from './containers/Direction';
import SignIn from './containers/SignIn';
import Profile from './containers/Profile';

const Router = () => {
  const auth = useSelector(state => state.firebase.auth);
  const isLogin = !isEmpty(auth);

  return (
    <HashRouter>
      {isLogin ? (
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
    </HashRouter>
  );
};

export default Router;
