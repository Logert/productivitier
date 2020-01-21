import React from 'react';
import { Box } from '@material-ui/core';
import * as firebase from "firebase/app";

import Header from '../Layout/Header';

const Profile = props => {
  return (
    <div>
      <Header onBack={props.history.goBack}/>
      <Box p={3}>
        <pre>{JSON.stringify(firebase.auth().currentUser, null, 2)}</pre>
      </Box>
    </div>
  )
};

export default Profile;
