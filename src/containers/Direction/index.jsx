import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  AppBar,
  List,
  ListItem,
  Tabs,
  Tab,
  Divider,
  TextField,
  Typography,
  CircularProgress,
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
import { useFirebase, useFirebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { set, clone } from 'lodash';

import Header from '../Layout/Header';

const useStyles = makeStyles({
  speedDial: {
    position: 'fixed',
    right: 10,
    bottom: 75,
  },
});

const Direction = ({ match, history }) => {
  const { dirUid } = match.params;
  const firebase = useFirebase();
  const owner = useSelector(state => state.firebase.auth.uid);
  useFirebaseConnect([{ path: 'directions', queryParams: ['orderByChild=owner', `equalTo=${owner}`] }]);
  useFirebaseConnect([{ type: 'once', path: 'sprints', queryParams: ['orderByChild=owner', `equalTo=${owner}`] }]);
  const directions = (useSelector(state => state.firebase.ordered.directions) || []).filter(d => d.value.state === 'ACTIVE');
  const directionsMap = useSelector(state => state.firebase.data.directions);
  const fbSprints = useSelector(state => state.firebase.ordered.sprints);
  const dirKeys = directions.map(dir => dir.key);
  const [tabIndex, setTabIndex] = useState(dirKeys.indexOf(dirUid) || 0);
  const [selectedDir, setSelectedDir] = useState(dirUid);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [sprints, setSprints] = useState(fbSprints);
  const [dirName, setDirName] = useState(directionsMap[selectedDir].name);

  const classes = useStyles();

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

  const removeDirection = () => {
    firebase.update(`directions/${selectedDir}`, { state: 'REMOVED' });
  };

  const updateDirectionName = () => {
    firebase.update(`directions/${selectedDir}`, { name: dirName }).then(toggleDialog);
  };

  const fbUpdateAction = (sprintKey, directionKey, actionIndex, value) =>
    firebase.update(`/sprints/${sprintKey}/direction/${directionKey}`, {
        [actionIndex]: value,
      }
    );

  const fbUpdateDebounced = AwesomeDebouncePromise(fbUpdateAction, 1000);

  const onFieldTextChange = async (sprintIndex, sprintKey, directionKey, actionIndex, value) => {
    setSprints(set(clone(sprints), [sprintIndex, 'value', 'direction', directionKey, actionIndex], value));
    await fbUpdateDebounced(sprintKey, directionKey, actionIndex, value);
  };

  const handleChangeDir = e => {
    setDirName(e.target.value);
  };

  return (
    <div>
      <Header onBack={history.goBack}/>
      {isLoaded(directions) && isLoaded(sprints) ? (
        <>
          <AppBar position="sticky" color="default">
            <Tabs
              variant="scrollable"
              scrollButtons="on"
              value={tabIndex}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
              {isEmpty(directions) ? 'Нет данных' : directions.map(({ key, value }) => (
                <Tab key={key} label={value.name}/>
              ))}
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={tabIndex}
            onChangeIndex={handleChangeIndex}
          >
            {isEmpty(directions) ? 'Нет данных' : directions.map(direction => (
              <div key={direction.key}>
                {isEmpty(fbSprints) ? 'Нет данных' : sprints.map((sprint, sprintIndex) => {
                  const { value } = sprint;
                  const date = new Date().toLocaleDateString();
                  let title = '';
                  let sprintEnd = true;
                  const [startDate, endDate] = [value.range[0], value.range[1]];
                  const sprintDirs = value.direction && value.direction[direction.key] || [];
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
                    <div key={sprint.key}>
                      <Divider/>
                      <ListItem style={{ flexDirection: 'column' }}>
                        <Typography color={sprintEnd ? 'textSecondary' : 'primary'}
                                    variant="h6">{title} {isActionsComplete &&
                        <DoneIcon color="secondary"/>}</Typography>
                        <List style={{ width: '100%' }}>
                          {value.direction && value.direction[direction.key] ? value.direction[direction.key].map((text, index) => (
                            <ListItem key={index}>
                              <TextField
                                fullWidth
                                value={text}
                                label={`${index + 1} действие`}
                                placeholder="Введите дейтсвие"
                                onChange={e => onFieldTextChange(sprintIndex, sprint.key, direction.key, index, e.target.value)}
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
        </>
      ) : <CircularProgress/>}
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
          onClick={removeDirection}
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
