export const createDirectionMap = (directions = [], actionsCount = 3) => directions.reduce((res, dir) => {
  res[dir.id] = new Array(actionsCount).fill('');
  return res;
}, {});
