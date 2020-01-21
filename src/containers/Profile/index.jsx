import React from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Header from '../Layout/Header';

const Profile = props => {
  const profile = useSelector(state => state.firebase.profile);

  return (
    <div>
      <Header onBack={props.history.goBack}/>
      <Box p={3}>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </Box>
    </div>
  )
};

export default Profile;
