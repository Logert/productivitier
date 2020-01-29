import React, { useCallback, useState, useEffect } from 'react';
import { Slider, makeStyles, Button, Box, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useSelector, useDispatch } from 'react-redux';

import Header from '../Layout/Header';

import { updateUserSettingsThunk } from '../../store/app/thunk';

const useStyles = makeStyles({
  field: {
    marginBottom: 15,
    textAlign: 'center',
  }
});

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const updateUserSettings = useCallback((...args) => {dispatch(updateUserSettingsThunk(...args))}, [dispatch]);

  useEffect(() => {
    setDays(user.settings.days);
    setCount(user.settings.actionsCount);
  }, [user]);

  const [count, setCount] = useState(3);
  const [days, setDays] = useState(1);
  const onChangeDays = (e, value) => {
    setDays(value);
  };
  const onChangeCount = (e, value) => {
    setCount(value);
  };
  const createSprint = () => {
    updateUserSettings(days, count);
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
