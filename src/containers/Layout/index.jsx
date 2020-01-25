import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import { BottomNavigation, BottomNavigationAction, Divider, makeStyles } from '@material-ui/core';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import 'moment/locale/ru';
import { isLoaded, useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

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
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  useFirebaseConnect([{ path: `users/${auth.uid}` }]);
  useFirebaseConnect([{ path: 'sprints', queryParams: ['orderByChild=owner', `equalTo=${auth.uid}`] }]);
  useFirebaseConnect([{ path: 'directions', queryParams: ['orderByChild=owner', `equalTo=${auth.uid}`] }]);
  const users = useSelector(state => state.firebase.data.users);
  const sprints = useSelector(state => state.firebase.ordered.sprints);
  const directions = (useSelector(state => state.firebase.ordered.directions) || []).filter(d => d.value.state === 'ACTIVE');

  const defaultUserSettings = {
    days: 1,
    actionsCount: 3
  };

  const initUser = async () => {
    try {
      await firebase.set(`users/${auth.uid}`, {
        ...auth,
        settings: defaultUserSettings
      });
      await firebase.push('sprints', {
        owner: auth.uid,
        range: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const checkSprint = async () => {
    try {
      const lastSprintRange = sprints[sprints.length - 1].value.range;
      if (moment().format('DD.MM.YYYY') !== lastSprintRange[0]) {
        const direction = directions.reduce((res, { key }) => {
          res[key] = new Array(profile.settings.actionsCount).fill('');
          return res;
        }, {});

        await firebase.push('sprints', {
          owner: auth.uid,
          range: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
          direction,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (isLoaded(users) && isLoaded(sprints) && isLoaded(directions)) {
      if (users[auth.uid]) {
        checkSprint();
      } else {
        initUser();
      }
    }
  }, [users, sprints]);

  return (
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
  );
};

export default withRouter(Layout);
