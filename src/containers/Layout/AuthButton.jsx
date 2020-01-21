import React from 'react';
import { IconButton, Menu, MenuItem, Avatar, makeStyles } from '@material-ui/core';
import * as firebase from "firebase/app";
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
  avatar: {
    width: 30,
    height: 30,
  }
});

const AuthButton = ({ history }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const currentUser = firebase.auth().currentUser;

  const classes = useStyles();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    history.push('/profile');
    setAnchorEl(null);
  };
  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Avatar alt={currentUser.displayName} src={currentUser.photoURL} className={classes.avatar}/>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Профиль</MenuItem>
        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
        <MenuItem onClick={clearStorage}>clear storage</MenuItem>
      </Menu>
    </div>
  );
};

export default withRouter(AuthButton);
