import React from 'react';
import { Slider, makeStyles, Button, Box, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';

import { ADD_SPRINT } from '../../store/sprint/action';

import Header from '../Layout/Header';
import moment from 'moment';

const useStyles = makeStyles({
  field: {
    marginBottom: 15,
    textAlign: 'center',
  }
});

const Settings = () => {
  const dispatch = useDispatch();
  const addSprint = React.useCallback(data => {dispatch(ADD_SPRINT(data))});
  const direction = useSelector(state => state.directions);
  const currentSprint = useSelector(state => state.sprint.find(item => moment().isBetween(moment(item.date[0]), moment(item.date[1]))));
  const [count, setCount] = React.useState(3);
  const [days, setDays] = React.useState(1);
  const onChangeDays = (e, value) => {
    setDays(value);
  };
  const onChangeCount = (e, value) => {
    setCount(value);
  };
  const createSprint = () => {
    addSprint({
      date: [moment().startOf('D').valueOf(), moment().add(days - 1, 'days').endOf('D').valueOf()],
      direction,
      actions: count,
    });
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
          disabled={!!currentSprint}
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
          disabled={!!currentSprint}
        />
      </div>
      <div className={styles.field}>
        <Button
          variant="contained"
          startIcon={<AddIcon/>}
          color="primary"
          style={{ marginTop: 30 }}
          onClick={createSprint}
          disabled={!!currentSprint}
        >Создать спринт
        </Button>
      </div>
    </Box>
  );
};

export default Settings;
