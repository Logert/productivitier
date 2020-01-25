import React from 'react';
import { Slider, makeStyles, Button, Box, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import Header from '../Layout/Header';

const useStyles = makeStyles({
  field: {
    marginBottom: 15,
    textAlign: 'center',
  }
});

const Settings = () => {
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  const users = useSelector(state => state.firebase.data.users);
  useFirebaseConnect([{ type: 'once', path: `users/${auth.uid}/settings` }]);

  React.useEffect(() => {
    setDays(users[auth.uid].settings.days);
    setCount(users[auth.uid].settings.actionsCount);
  }, [users, auth]);

  const [count, setCount] = React.useState(3);
  const [days, setDays] = React.useState(1);
  const onChangeDays = (e, value) => {
    setDays(value);
  };
  const onChangeCount = (e, value) => {
    setCount(value);
  };
  const createSprint = () => {
    firebase.set(`users/${auth.uid}/settings`, {
      days: 1,
      actionsCount: count
    })
  };

  const styles = useStyles();

  return (
    <Box p={3}>
      <Header title="Настройки"/>
      <div className={styles.field}>
        <Typography gutterBottom>
          Длительность спринта в днях
        </Typography>
        <Slider
          value={days}
          step={1}
          marks
          min={1}
          max={10}
          onChange={onChangeDays}
          valueLabelDisplay="on"
        />
      </div>
      <div className={styles.field}>
        <Typography gutterBottom>
          Количество простых действий
        </Typography>
        <Slider
          value={count}
          step={1}
          marks
          min={1}
          max={10}
          onChange={onChangeCount}
          valueLabelDisplay="on"
        />
      </div>
      <div className={styles.field}>
        <Button
          variant="contained"
          startIcon={<AddIcon/>}
          color="primary"
          style={{ marginTop: 30 }}
          onClick={createSprint}
        >Сохранить
        </Button>
      </div>
    </Box>
  );
};

export default Settings;
