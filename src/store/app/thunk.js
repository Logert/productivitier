import moment from 'moment';

import {SET_DIRECTIONS_MAP, SET_USER} from './action';

import {getSprintsThunk} from '../sprints/thunk';
import {getDirectionsThunk} from '../directions/thunk';

export const getUserThunk = () => async (dispatch, getState, getFirebase) => {
  const state = getState();
  const auth = state.firebase.auth;
  const userSnapshot = await getFirebase()
    .ref(`/users/${auth.uid}`)
    .once('value');

  const currUser = userSnapshot.val();
  dispatch(SET_USER(currUser));
};

export const checkUserThunk = () => async (dispatch, getState, getFirebase) => {
  try {
    const auth = getState().firebase.auth;
    await dispatch(getUserThunk());
    const currUser = getState().app.user;

    if (currUser) {
      dispatch(SET_USER(currUser));
      await dispatch(getSprintsThunk());
      await dispatch(getDirectionsThunk());
      const { sprints, directions } = getState();

      const lastSprintRange = sprints[sprints.length - 1].range;
      if (moment().format('DD.MM.YYYY') !== lastSprintRange[0]) {
        const direction = directions.reduce((res, item) => {
          res[item.uid] = new Array(currUser.settings.actionsCount).fill('');
          return res;
        }, {});

        await getFirebase().ref('/sprints').push({
          owner: auth.uid,
          range: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
          direction,
        });

        dispatch(getSprintsThunk());
      }

    } else {
      const defaultUserSettings = {
        days: 1,
        actionsCount: 3
      };

      const err = await getFirebase()
        .ref(`/users/${auth.uid}`)
        .set({
          ...auth,
          settings: defaultUserSettings
        });
      if (!err) {
        const user = await getFirebase()
          .ref(`/users/${auth.uid}`)
          .once('value');

        dispatch(SET_USER(user.val()));

        await getFirebase().ref('/sprints').push({
          owner: auth.uid,
          range: [moment().format('DD.MM.YYYY'), moment().format('DD.MM.YYYY')],
        });
        dispatch(getSprintsThunk());
      }
    }
  } catch (e) {
    throw new Error('Ошибка инициализации пользователя!');
  }
};


export const updateUserSettingsThunk = (days, count) => async (dispatch, getState, getFirebase) => {
  try {
    const user = getState().app.user;
    await getFirebase().ref(`users/${user.uid}/settings`).update({
      days: 1,
      actionsCount: count
    });
    dispatch(getUserThunk());
  } catch (e) {
    throw new Error('Ошибка обновления настроек пользователя');
  }
};

export const getDirectionsMapThunk = () => async (dispatch, getState, getFirebase) => {
  const state = getState();
  const auth = state.firebase.auth;
  const snapshot = await getFirebase()
    .ref('/directions')
    .orderByChild('owner')
    .equalTo(auth.uid)
    .once('value');

  dispatch(SET_DIRECTIONS_MAP(snapshot.val()));
};
