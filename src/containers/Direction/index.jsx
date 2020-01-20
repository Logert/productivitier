import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, List, ListItem, Tabs, Tab, Divider, TextField, Typography } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment';
import DoneIcon from '@material-ui/icons/Done';

import Header from '../Layout/Header';

import { UPDATE_SPRINT_ACTION } from '../../store/sprint/action';

const Direction = ({ match, history }) => {
  const { directionId } = match.params;
  const directions = useSelector(state => state.directions);
  const sprints = useSelector(state => state.sprint);
  const dispatch = useDispatch();
  const setSprint = React.useCallback(data => {dispatch(UPDATE_SPRINT_ACTION(data))});
  const [value, setValue] = React.useState(+directionId); // TODO directionId get index

  const getSprints = index => sprints.map(sprint => ({
    date: sprint.date,
    actions: sprint.direction[index] || [],
  }));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const handleChangeSprintAction = (sprintIndex, actionIndex) => e => {
    setSprint({
      sprintIndex,
      directionId: value,
      actionIndex,
      actionValue: e.target.value,
    });
  };

  const renderSprint = index => {
    const directionSprints = getSprints(index);
    return (
      <div>
        {directionSprints.map((sprint, sprintIndex) => {
          const format = 'DD.MM.YYYY';
          let title = '';
          let sprintEnd = true;
          const [startDate, endDate] = [moment(sprint.date[0]), moment(sprint.date[1])];
          const isActionsComplete = sprint.actions.every(item => item.length);

          if (moment().isBetween(startDate, endDate)) {
            title = 'Текущий спринт';
            sprintEnd = false;
          } else if (startDate.format(format) === endDate.format(format)) {
            title = `Спринт ${endDate.format(format)}`;
          } else {
            title = `Спринт c ${startDate.format(format)} по ${endDate.format(format)}`;
          }
          return (
            <div key={startDate.valueOf()}>
              <Divider/>
              <ListItem style={{ flexDirection: 'column' }}>
                <Typography color={sprintEnd ? 'textSecondary' : 'primary'} variant="h6">{title} {isActionsComplete && <DoneIcon color="secondary" />}</Typography>
                <List style={{ width: '100%' }}>
                  {sprint.actions.map((text, index) => (
                    <ListItem key={index}>
                      <TextField
                        disabled={sprintEnd}
                        fullWidth
                        value={text}
                        label={`${index + 1} действие`}
                        placeholder="Введите дейтсвие"
                        onChange={handleChangeSprintAction(sprintIndex, index)}
                      />
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            </div>
          )
        })}
      </div>
    )
  };

  return (
    <div>
      <Header onBack={history.goBack}/>
      <AppBar position="static" color="default">
        <Tabs
          variant="scrollable"
          scrollButtons="on"
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          {directions.map(item => (
            <Tab key={item.id} label={item.name} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {directions.map((item) => (
          <div key={item.id}>
            {renderSprint(item.id)}
          </div>
        ))}
      </SwipeableViews>
    </div>
  );
};

export default Direction;
