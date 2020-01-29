import React, { useCallback, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import { BottomNavigation, BottomNavigationAction, Divider, makeStyles } from '@material-ui/core';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import 'moment/locale/ru';
import { useDispatch } from 'react-redux';

import { checkUserThunk } from '../../store/app/thunk';

import ErrorBoundary from './ErrorBoundary';

moment.locale('ru');

const useStyles = makeStyles({
  content: {
    height: 'calc(100% - 64px)',
    overflow: 'auto',
  },
  container: {
    height: 'calc(100vh - 64px)',
    marginTop: '64px',
  },
});

const getBtnValue = pathname => {
  if (pathname.includes('/settings')) {
    return 'settings';
  }
  return 'home';
};

const Layout = ({ children, ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const checkUser = useCallback(() => {dispatch(checkUserThunk());}, [dispatch]);

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        <div className={classes.content}>
          {children}
        </div>
        <Divider/>
        <BottomNavigation value={getBtnValue(props.location.pathname)} showLabels>
          <BottomNavigationAction value="settings" icon={<SettingsOutlinedIcon />} component={Link} to="/settings" />
          <BottomNavigationAction value="home" icon={<HomeOutlinedIcon />} component={Link} to="/" />
        </BottomNavigation>
      </div>
    </ErrorBoundary>
  );
};

export default withRouter(Layout);
