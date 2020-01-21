import React from 'react';
import {
  HashRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Layout from './containers/Layout';
import Home from './containers/Home';
import Settings from './containers/Settings';
import Direction from './containers/Direction';
import SignIn from './containers/SignIn';

import * as firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";

import { getFirebaseConfig } from './utils';

const Router = () => (
  <FirebaseAuthProvider {...getFirebaseConfig()} firebase={firebase}>
    <HashRouter>
      <FirebaseAuthConsumer>
        {({ isSignedIn, user, providerId }) => {
          console.log(isSignedIn, user);
          if (isSignedIn) {
            return (
              <Layout>
                <Switch>
                  <Route path="/" exact component={Home}/>
                  <Route path="/settings" exact component={Settings}/>
                  <Route path="/:directionId(\d)" exact component={Direction}/>
                </Switch>
              </Layout>
            )
          }
          return (
            <Switch>
              <Route path="/" exact component={SignIn}/>;
            </Switch>
          )
        }}
      </FirebaseAuthConsumer>
    </HashRouter>
  </FirebaseAuthProvider>
);

export default Router;
