import moment from 'moment';

export const timestampToDate = d => {
  const date = moment.unix(d);
  return date.format('DD.MM.YYYY');
};

export const timestampToTime = d => {
  const date = moment.unix(d);
  return date.format('HH:MM');
};

export const dateToAge = d => {
  const birthday = moment(d, 'YYYY-MM-DD');
  return birthday.diff(moment(), 'years') * -1;
};

export const dateToTimestamp = d => {
  const date = moment(d);
  return date.format('X').split('.')[0];
};
