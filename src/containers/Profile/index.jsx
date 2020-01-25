import React from 'react';
import { Box, makeStyles, TextField, Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Header from '../Layout/Header';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
}));

const Profile = props => {
  const profile = useSelector(state => state.firebase.profile);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header onBack={props.history.goBack}/>
      <Box p={3}>
        <Avatar src={profile.photoURL}/>
        <TextField
          fullWidth
          label="uid"
          value={profile.uid}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          fullWidth
          label="displayName"
          value={profile.displayName}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          fullWidth
          label="email"
          value={profile.email}
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
    </div>
  )
};

export default Profile;
