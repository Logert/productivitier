import React from 'react';
import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom';

import Layout from './containers/Layout';
import Home from './containers/Home';
import Settings from './containers/Settings';
import Direction from './containers/Direction';

const Router = () => (
  <HashRouter>
    <Layout>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/settings" exact component={Settings}/>
        <Route path="/:directionId(\d)" exact component={Direction}/>
      </Switch>
    </Layout>
  </HashRouter>
);

export default Router;
