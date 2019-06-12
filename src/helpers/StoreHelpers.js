export const toggleObjectKey = (arr, tId, tKey) => {
  const tEl = arr.find(x => x.ID === tId);
  const tInd = arr.indexOf(tEl);
  tEl[tKey] = tEl[tKey] === '1' ? '0' : '1';
  arr[tInd] = tEl;

  return arr;
};

export const smthElse = () => {};
