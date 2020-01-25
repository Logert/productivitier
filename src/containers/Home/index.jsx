import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  CircularProgress,
  Select,
  MenuItem,
  Avatar,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import ShareIcon from '@material-ui/icons/Share';
import { useFirebaseConnect, isLoaded, useFirebase, isEmpty } from 'react-redux-firebase';

import Header from '../Layout/Header';
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
  },
  select: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Home = () => {
  const [drawer, setDrawer] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('music.jpg');
  const firebase = useFirebase();
  const owner = useSelector(state => state.firebase.auth.uid);
  useFirebaseConnect([{ path: 'directions', queryParams: ['orderByChild=owner', `equalTo=${owner}`] }]);
  useFirebaseConnect([{ type: 'once', path: 'sprints', queryParams: ['orderByChild=owner', `equalTo=${owner}`] }]);
  const directions = (useSelector(state => state.firebase.ordered.directions) || []).filter(d => d.value.state === 'ACTIVE');
  const directionsData = useSelector(state => state.firebase.data.directions);
  const sprints = useSelector(state => state.firebase.ordered.sprints);
  const actionMap = isLoaded(sprints) && !isEmpty(sprints) ? sprints.reduce((res, { value }) => {
    if (moment().isBetween(moment(value.range[0], 'DD.MM.YYYY').startOf('D'), moment(value.range[1], 'DD.MM.YYYY').endOf('D'))) {
      if (value.direction) {
        res = Object.entries(value.direction).reduce((dirRes, [key, dir]) => {
          dirRes[key] = dir.filter(a => !a.length).length;
          return dirRes;
        }, {});
      }
    }
    return res;
  }, {}) : {};

  const toggleDrawer = () => setDrawer(s => !s);
  const getSrc = name => require(`../../assets/img/${name}`);
  const classes = useStyles();
  const badgeClasses = useBadgeStyles();
  const gridClasses = useGridStyles();

  const handleAddDirection = () => {
    firebase.push('directions', { img, name, description, owner, state: 'ACTIVE' }).then(() => {
      toggleDrawer();
      setName('');
      setDescription('');
    });
  };
  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const onChangeImg = (e) => {
    setImg(e.target.value);
  };
  const handleShare = () => {
    let text = sprints.filter(({ value }) => value.range[0] === new Date().toLocaleDateString()).reduce((res, { value }) => {
      res += `
Спринт ${value.range[0]}
  ${Object.entries(value.direction).reduce((dirRes, [key, actions]) => {
    const currDir = directionsData[key];
    dirRes += `
  ${currDir ? `${currDir.name}\n` : ''}
  ${currDir && actions && actions.length ? actions.map(t => `- ${t};`).join('\n') : ''}`;return dirRes;}, '')}`;
      return res;
      }, '');

    navigator.share({
      title: 'Отчет',
      text,
    })
      .then(() => console.log('share success'))
      .catch(() => console.log('share fail'))
  };

  const testBtn = async () => {

  };

  const defaultDirections = [
    { id: 0, name: 'Музыка', img: 'music.jpg', description: '' },
    { id: 1, name: 'Бизнес', img: 'business.jpg', description: '' },
    { id: 2, name: 'Отношения', img: 'relationship.jpg', description: '' },
    { id: 3, name: 'Связи', img: 'connections.jpg', description: '' },
    { id: 4, name: 'Программирование', img: 'programming.jpg', description: '' },
    { id: 5, name: 'Спорт', img: 'sport.jpg', description: '' },
  ];

  return (
    <div>
      <Header title="Направления" showSprint/>
      <div className={classes.gridList}>
        {isLoaded(directions) ? (
          <GridList cellHeight={150}>
            {isEmpty(directions) ? 'Нет данных' : directions.map(({ key, value }) => {
              const completeActions = actionMap[key];
              return (
                <GridListTile key={key} component={Link} to={`/direction/${key}`} classes={gridClasses}>
                  {value.img ? <img src={getSrc(value.img)} alt={value.name}/> : null}
                  <GridListTileBar
                    title={completeActions
                      ? <Badge badgeContent={completeActions} color="secondary" classes={badgeClasses}>{value.name}</Badge>
                      : <>{value.name} <DoneIcon color="secondary"/></>}
                    subtitle={value.description}
                  />
                </GridListTile>
              )
            })}
          </GridList>
        ) : <CircularProgress />}
      </div>
      <Fab size="large" color="primary" className={classes.addBtn} onClick={toggleDrawer}>
        <AddIcon/>
      </Fab>
      {/*<Fab size="large" color="primary" onClick={testBtn}>*/}
      {/*  <AddIcon/>*/}
      {/*</Fab>*/}
      {isLoaded(directions) && !isEmpty(sprints) && navigator.share && (
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
          <div className={classes.field}>
            <Select
              value={img}
              onChange={onChangeImg}
              fullWidth
              label="Изображение"
              classes={{ select: classes.select }}
            >
              {defaultDirections.map(dir => (
                <MenuItem key={dir.id} value={dir.img}><Avatar src={getSrc(dir.img)}/>{dir.name}</MenuItem>
              ))}
            </Select>
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
