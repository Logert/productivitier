import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { AppBar, makeStyles, Toolbar, Typography, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import AuthButton from './AuthButton';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  }
});

const Header = ({ title, onBack, showSprint }) => {
  const sprint = useSelector(state => state.sprint.find(item => moment().isBetween(moment(item.date[0]), moment(item.date[1]))));
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
          {showSprint && <Typography variant="subtitle1">{sprint ? <span>Спринт {moment(sprint.date[1]).format('DD.MM.YYYY')}</span> : 'Создайте спринт в настройках'}</Typography>}
        </div>
        <AuthButton/>
      </Toolbar>
    </AppBar>
  )
};

export default Header;
