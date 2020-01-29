import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, makeStyles, Toolbar, Typography, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { isLoaded, useFirebaseConnect } from 'react-redux-firebase';

import AuthButton from './AuthButton';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  }
});

const Header = ({ title, onBack, showSprint }) => {
  // const owner = useSelector(state => state.firebase.auth.uid);
  // useFirebaseConnect([{ type: 'once', path: 'sprints', queryParams: ['orderByChild=owner', `equalTo=${owner}`] }]);
  // const sprints = useSelector(state => state.firebase.ordered.sprints) || [];

  // const lastSprintDate = isLoaded(sprints) && sprints.length ? sprints[sprints.length - 1].value.range[0] : '';

  const style = useStyles();
  return (
    <AppBar position="fixed" color="default">
      <Toolbar>
        {onBack && (
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <div className={style.title}>
          <Typography variant="h5">{title}</Typography>
          {/*{showSprint && <Typography variant="subtitle1">Спринт {lastSprintDate}</Typography>}*/}
        </div>
        <AuthButton/>
      </Toolbar>
    </AppBar>
  )
};

export default Header;
