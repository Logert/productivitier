import moment from 'moment';

import { createDirectionMap } from '../utils';

const defaultDirections = [
  { id: 0, name: 'Музыка', img: 'music.jpg', description: '' },
  { id: 1, name: 'Бизнес', img: 'business.jpg', description: '' },
  { id: 2, name: 'Отношения', img: 'relationship.jpg', description: '' },
  { id: 3, name: 'Связи', img: 'connections.jpg', description: '' },
  { id: 4, name: 'Программир...', img: 'programming.jpg', description: '' },
  { id: 5, name: 'Спорт', img: 'sport.jpg', description: '' },
];

export default {
  auth: {},
  sprint: [
    {
      date: [moment().subtract(2, 'days').startOf('D').valueOf(), moment().subtract(2, 'days').endOf('D').valueOf()],
      direction: createDirectionMap(defaultDirections),
    },
    {
      date: [moment().subtract(1, 'days').startOf('D').valueOf(), moment().subtract(1, 'days').endOf('D').valueOf()],
      direction: createDirectionMap(defaultDirections),
    },
  ],
  directions: defaultDirections,
};
