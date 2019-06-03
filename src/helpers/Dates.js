import moment from 'moment';

export const timestampToDate = d => {
  const date = moment.unix(d);
  return date.format('DD.MM.YYYY');
};

export const timestampToTime = d => {
  const date = moment.unix(d);
  return date.format('HH:MM');
};

export const timestampToAgoStamp = d => {
  const mDate = moment.unix(d);
  mDate.locale('ru');
  // if (moment().diff(mDate, 'seconds') <= 60) {
  //   return 'just now';
  // }
  // if (moment().diff(mDate, 'hours') < 12) {
  //   return mDate.fromNow(); // 1...60 minutes or 1...12 hours ago
  // }
  if (moment().diff(mDate, 'hours') < 24) {
    return `Сегодня`;
  }
  if (moment().diff(mDate, 'days') < 2) {
    return `Вчера`;
  }
  if (moment().diff(mDate, 'days') < 7) {
    return mDate.format('dddd'); // Понедельник
  }
  return mDate.format('dddd, D MMMM YYYY'); // Понедельник, 3 июня 2019
};

export const dateToAge = d => {
  const birthday = moment(d, 'YYYY-MM-DD');
  return birthday.diff(moment(), 'years') * -1;
};

export const dateToTimestamp = d => {
  const date = moment(d);
  return date.format('X').split('.')[0];
};
