import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  Fab,
  GridList,
  GridListTile,
  GridListTileBar,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import ShareIcon from '@material-ui/icons/Share';
import moment from 'moment';

import Header from '../Layout/Header';

import {addDirectionThunk} from '../../store/directions/thunk';
import {getDirectionsMapThunk} from '../../store/app/thunk';

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
  const [actionMap, setActionMap] = useState({});

  const dispatch = useDispatch();
  const getDirectionsMap = useCallback(() => {dispatch(getDirectionsMapThunk());}, [dispatch]);
  const addDirection = useCallback(data => {dispatch(addDirectionThunk(data));}, [dispatch]);

  const directions = useSelector(state => state.directions);
  const directionsMap = useSelector(state => state.app.directionsMap);
  const sprints = useSelector(state => state.sprints);

  useEffect(() => {
    getDirectionsMap();
  }, [directions]);

  useEffect(() => {
    const actionMap = sprints.reduce((res, sprint) => {
      if (moment().isBetween(moment(sprint.range[0], 'DD.MM.YYYY').startOf('D'), moment(sprint.range[1], 'DD.MM.YYYY').endOf('D'))) {
        if (sprint.direction) {
          res = Object.entries(sprint.direction).reduce((dirRes, [key, dir]) => {
            dirRes[key] = dir.filter(a => !a.length).length;
            return dirRes;
          }, {});
        }
      }
      return res;
    }, {});
    setActionMap(actionMap);
  }, [sprints]);

  const toggleDrawer = () => setDrawer(s => !s);
  const getSrc = name => require(`../../assets/img/${name}`);
  const classes = useStyles();
  const badgeClasses = useBadgeStyles();
  const gridClasses = useGridStyles();

  const handleAddDirection = () => {
    const onSuccess = () => {
      toggleDrawer();
      setName('');
      setDescription('');
    };
    addDirection({ img, name, description, onSuccess });
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

  const deleteRemovedDirectionsFromDirectionsMap = () => {
    Object.keys(directionsMap).forEach(key => {
      if ("REMOVED" === directionsMap[key].state) delete directionsMap[key];
    });
  };

  const handleShare = () => {
    const currSprint = sprints.filter(sprint => sprint.range[0] === moment().format('DD.MM.YYYY'))[0];
    let text = '';
    if (currSprint) {
      const sprintDate = currSprint.range[0];
      text = `Спринт ${sprintDate}\n\n`;

      // It is definitely not right thing to do it here but...
      deleteRemovedDirectionsFromDirectionsMap();

      Object.entries(currSprint.direction).forEach(([key, actions]) => {
        const currDir = directionsMap[key];
        text += ` ${currDir ? `${currDir.name}\n` : ''}`;
        if (currDir && actions && actions.length) {
          actions.forEach(t => {
            text += `  - ${t}\n`
          });
        }
        text += '\n';
      });

    }

    navigator.share({
      title: 'Отчет',
      text,
    })
      .then(() => console.log('share success'))
      .catch(() => console.log('share fail'))
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
        <GridList cellHeight={150}>
          {directions.map(direction => {
            const completeActions = actionMap[direction.uid];
            return (
              <GridListTile key={direction.uid} component={Link} to={`/direction/${direction.uid}`} classes={gridClasses}>
                {direction.img ? <img src={getSrc(direction.img)} alt={direction.name}/> : null}
                <GridListTileBar
                  title={completeActions
                    ? <Badge badgeContent={completeActions} color="secondary" classes={badgeClasses}>{direction.name}</Badge>
                    : <>{direction.name} <DoneIcon color="secondary"/></>}
                  subtitle={direction.description}
                />
              </GridListTile>
            )
          })}
        </GridList>
      </div>
      <Fab size="large" color="primary" className={classes.addBtn} onClick={toggleDrawer}>
        <AddIcon/>
      </Fab>
      {directions.length && sprints.length && navigator.share ? (
        <Fab size="large" color="secondary" className={classes.shareBtn} onClick={handleShare}>
          <ShareIcon/>
        </Fab>
      ) : null}
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
