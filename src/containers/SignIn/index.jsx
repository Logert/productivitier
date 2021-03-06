import React from 'react';
import { Avatar, Button, CssBaseline, Typography, makeStyles, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AppleIcon from '@material-ui/icons/Apple';
import AndroidIcon from '@material-ui/icons/Android';
import { useFirebase } from 'react-redux-firebase';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const firebase = useFirebase();

  const handleAuthGoogle = () => {
    firebase.login({
      provider: 'google',
      type: 'popup',
    });
  };

  const handleAuthAnonymously = () => {
    firebase.auth().signInAnonymously();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Авторизация
        </Typography>
        <form className={classes.form} noValidate>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleAuthGoogle}
            startIcon={<AndroidIcon/>}
          >
            Войти с помощью Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="default"
            className={classes.submit}
            onClick={handleAuthAnonymously}
          >
            Анонимный вход
          </Button>
        </form>
      </div>
    </Container>
  );
}
