import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  List,
  ListItem,
  Tabs,
  Tab,
  Divider,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import SwipeableViews from 'react-swipeable-views';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { set, clone } from 'lodash';

import Header from '../Layout/Header';

import { getDirectionsMapThunk } from '../../store/app/thunk';
import { removeDirectionThunk, updateDirectionThunk } from '../../store/directions/thunk';
import { updateSprintActionThunk } from '../../store/sprints/thunk';

const useStyles = makeStyles({
  speedDial: {
    position: 'fixed',
    right: 10,
    bottom: 75,
  },
});

const Direction = ({ match, history }) => {
  const { dirUid } = match.params;

  const dispatch = useDispatch();
  const getDirectionsMap = useCallback(() => {dispatch(getDirectionsMapThunk());}, [dispatch]);
  const removeDirection = useCallback(uid => {dispatch(removeDirectionThunk(uid));}, [dispatch]);
  const updateDirection = useCallback((uid, data, onSuccess) => {dispatch(updateDirectionThunk(uid, data, onSuccess));}, [dispatch]);
  const updateSprintAction = useCallback((...args) => {dispatch(updateSprintActionThunk(...args));}, [dispatch]);

  const directions = useSelector(state => state.directions);
  const directionsMap = useSelector(state => state.app.directionsMap);
  const fbSprints = useSelector(state => state.sprints);

  const dirKeys = directions.map(dir => dir.uid);

  const [tabIndex, setTabIndex] = useState(dirKeys.indexOf(dirUid) || 0);
  const [selectedDir, setSelectedDir] = useState(dirUid);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [sprints, setSprints] = useState(fbSprints);
  const [dirName, setDirName] = useState(directionsMap[selectedDir].name);

  const classes = useStyles();

  useEffect(() => {
    getDirectionsMap();
  }, [directions]);

  useEffect(() => {
    setSprints(fbSprints);
  }, [fbSprints]);

  useEffect(() => {
    setDirName(directionsMap[selectedDir].name);
  }, [selectedDir]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    setSelectedDir(dirKeys[newValue]);
  };

  const toggleDialog = () => setDialogOpen(s => !s);
  const toggleSpeedDial = () => setSpeedDialOpen(s => !s);

  const handleChangeIndex = index => {
    setTabIndex(index);
    setSelectedDir(dirKeys[index]);
  };

  const updateDirectionName = () => {
    updateDirection(selectedDir, { name: dirName }, toggleDialog);
  };

  const fbUpdateDebounced = AwesomeDebouncePromise(updateSprintAction, 1000);

  const onFieldTextChange = async (sprintIndex, sprintKey, directionKey, actionIndex, value) => {
    setSprints(set(clone(sprints), [sprintIndex, 'direction', directionKey, actionIndex], value));
    await fbUpdateDebounced(sprintKey, directionKey, actionIndex, value);
  };

  const handleChangeDir = e => {
    setDirName(e.target.value);
  };

  return (
    <div>
      <Header onBack={history.goBack}/>
      <AppBar position="sticky" color="default">
        <Tabs
          variant="scrollable"
          scrollButtons="on"
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          {directions.map(direction => (
            <Tab key={direction.uid} label={direction.name}/>
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        index={tabIndex}
        onChangeIndex={handleChangeIndex}
      >
        {directions.map(direction => (
          <div key={direction.uid}>
            {sprints.map((sprint, sprintIndex) => {
              const date = new Date().toLocaleDateString();
              let title = '';
              let sprintEnd = true;
              const [startDate, endDate] = [sprint.range[0], sprint.range[1]];
              const sprintDirs = sprint.direction && sprint.direction[direction.uid] || [];
              const isActionsComplete = sprintDirs.every(item => item.length);

              if (startDate === endDate && startDate === date) {
                title = 'Текущий спринт';
                sprintEnd = false;
              } else if (startDate === endDate) {
                title = `Спринт ${endDate}`;
              } else {
                title = `Спринт c ${startDate} по ${endDate}`;
              }
              return (
                <div key={sprint.uid}>
                  <Divider/>
                  <ListItem style={{ flexDirection: 'column' }}>
                    <Typography color={sprintEnd ? 'textSecondary' : 'primary'}
                                variant="h6">{title} {isActionsComplete &&
                    <DoneIcon color="secondary"/>}</Typography>
                    <List style={{ width: '100%' }}>
                      {sprint.direction && sprint.direction[direction.uid] ? sprint.direction[direction.uid].map((text, index) => (
                        <ListItem key={index}>
                          <TextField
                            fullWidth
                            value={text}
                            label={`${index + 1} действие`}
                            placeholder="Введите дейтсвие"
                            onChange={e => onFieldTextChange(sprintIndex, sprint.uid, direction.uid, index, e.target.value)}
                          />
                        </ListItem>
                      )) : <Typography style={{ textAlign: 'center' }}>Нет данных</Typography>}
                    </List>
                  </ListItem>
                </div>
              )
            })}
          </div>
        ))}
      </SwipeableViews>
      <SpeedDial
        ariaLabel="speedDial"
        open={speedDialOpen}
        className={classes.speedDial}
        icon={<MoreHorizIcon />}
        direction="up"
        onClose={toggleSpeedDial}
        onOpen={toggleSpeedDial}
        color="secondary"
      >
        <SpeedDialAction
          title="Редактировать"
          icon={<EditIcon/>}
          onClick={toggleDialog}
        />
        <SpeedDialAction
          title="Удалить"
          icon={<DeleteIcon/>}
          onClick={() => removeDirection(selectedDir)}
        />
      </SpeedDial>
      <Dialog open={dialogOpen} onClose={toggleDialog}>
        <DialogTitle>Редактировать</DialogTitle>
        <DialogContent>
          <TextField fullWidth value={dirName} onChange={handleChangeDir}/>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={updateDirectionName}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Direction;
