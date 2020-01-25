import React from 'react';
import { IconButton, Menu, MenuItem, Avatar, makeStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

const useStyles = makeStyles({
  avatar: {
    width: 30,
    height: 30,
  }
});

const AuthButton = ({ history }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const firebase = useFirebase();
  const profile = useSelector(state => state.firebase.profile);

  const classes = useStyles();

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    firebase.logout();
  };

  const goToProfile = () => {
    handleClose();
    history.push('/profile');
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
        <Avatar alt={profile.displayName} src={profile.avatarUrl} className={classes.avatar}/>
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
        <MenuItem onClick={goToProfile}>Профиль</MenuItem>
        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
      </Menu>
    </div>
  );
};

export default withRouter(AuthButton);
