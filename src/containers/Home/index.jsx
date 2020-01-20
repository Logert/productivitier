import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Typography,
  Fab,
  Drawer,
  TextField,
  GridList,
  GridListTile,
  GridListTileBar,
  Badge,
  makeStyles,
  Button,
  Box,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import ShareIcon from '@material-ui/icons/Share';

import Header from '../Layout/Header';

import { ADD_DIRECTION } from '../../store/directions/action';
import { UPDATE_DIRECTIONS_SPRINT } from '../../store/sprint/action';
import moment from 'moment';

const useBadgeStyles = makeStyles({
  badge: {
    top: 12,
    right: -15,
  }
});

const useGridStyles = makeStyles({
  tile: {
    cursor: 'pointer',
    '&:hover': {
      opacity: '.7'
    }
  }
});

const useStyles = makeStyles({
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  addBtn: {
    position: 'fixed',
    left: 10,
    bottom: 75,
  },
  shareBtn: {
    position: 'fixed',
    right: 10,
    bottom: 75,
  },
  field: {
    marginBottom: 15,
  }
});

const Home = () => {
  const directions = useSelector(state => state.directions);
  const currentSprint = useSelector(state => state.sprint.find(item => moment().isBetween(moment(item.date[0]), moment(item.date[1]))));
  const dispatch = useDispatch();
  const addDirection = React.useCallback(data => {dispatch(ADD_DIRECTION(data))});
  const updateDirectionSprint = React.useCallback(data => {dispatch(UPDATE_DIRECTIONS_SPRINT(data))});
  const [drawer, setDrawer] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const toggleDrawer = () => setDrawer(s => !s);
  const getSrc = name => require(`../../assets/img/${name}`);
  const classes = useStyles();
  const badgeClasses = useBadgeStyles();
  const gridClasses = useGridStyles();

  const handleAddDirection = () => {
    // TODO validate
    addDirection({
      name,
      description,
    });
    updateDirectionSprint();
    toggleDrawer();
  };
  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const getActionCount = directionId => {
    if (currentSprint) {
      return currentSprint.direction[directionId].filter(a => !a.length).length;
    }
    return 0;
  };
  const handleShare = () => {
    navigator.share({
      title: 'Отчет',
      text: 'результат отчета',
    })
      .then(() => console.log('share success'))
      .catch(() => console.log('share fail'))
  };

  return (
    <div>
      <Header title="Направления" showSprint/>
      <div className={classes.gridList}>
        <GridList cellHeight={150}>
          {directions.map(item => {
            const completeActions = getActionCount(item.id);
            return (
              <GridListTile key={item.id} component={Link} to={`/${item.id}`} classes={gridClasses}>
                {item.img ? <img src={getSrc(item.img)} alt={item.name}/> : null}
                <GridListTileBar
                  title={completeActions
                    ? <Badge badgeContent={completeActions} color="secondary" classes={badgeClasses}>{item.name}</Badge>
                    : <>{item.name} <DoneIcon color="secondary"/></>}
                  subtitle={item.description}
                />
              </GridListTile>
            )
          })}
        </GridList>
      </div>
      <Fab size="large" color="primary" className={classes.addBtn} onClick={toggleDrawer}>
        <AddIcon/>
      </Fab>
      {navigator.share && (
        <Fab size="large" color="secondary" className={classes.shareBtn} onClick={handleShare}>
          <ShareIcon/>
        </Fab>
      )}
      <Drawer
        anchor="bottom"
        open={drawer}
        onClose={toggleDrawer}
      >
        <Box p={3} style={{ textAlign: 'center' }}>
          <div className={classes.field}>
            <Typography variant="h5">Добавить направление</Typography>
          </div>
          <div className={classes.field}>
            <TextField value={name} onChange={onChangeName} fullWidth label="Название"/>
          </div>
          <div className={classes.field}>
            <TextField value={description} onChange={onChangeDescription} fullWidth label="Почему это важно для меня?"/>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon/>}
            color="primary"
            style={{ marginTop: 30 }}
            onClick={handleAddDirection}
          >Добавить
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default Home;
