import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import { BottomNavigation, BottomNavigationAction, Divider, makeStyles } from '@material-ui/core';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'moment/locale/ru';

moment.locale('ru');

const useStyles = makeStyles({
  content: {
    height: 'calc(100% - 64px)',
    overflow: 'auto',
  },
  container: {
    height: 'calc(100vh - 57px)',
    marginTop: '57px',
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

  return (
    <div className={classes.container}>
      <MuiPickersUtilsProvider utils={MomentUtils} locale="">
        <div className={classes.content}>
          {children}
        </div>
      </MuiPickersUtilsProvider>
      <Divider/>
      <BottomNavigation value={getBtnValue(props.location.pathname)} showLabels>
        <BottomNavigationAction value="settings" icon={<SettingsOutlinedIcon />} component={Link} to="/settings" />
        <BottomNavigationAction value="home" icon={<HomeOutlinedIcon />} component={Link} to="/" />
      </BottomNavigation>
    </div>
  );
};

export default withRouter(Layout);
