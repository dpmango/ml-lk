// Возраст - 18…99 шаг 1
// Вес_1 - 50…140 шаг 10
// Вес_2 - 60…150 шаг 10
// Рост_1 - 140…190 шаг 10
// Рост_2 - 150…200 шаг 10

import range from 'lodash/range';

const arrayToSelect = arr => {
  return arr.map(x => ({
    label: x,
    value: x,
  }));
};

const age = range(18, 100, 1);
const weight_1 = range(50, 150, 10);
const weight_2 = range(60, 160, 10);
const height_1 = range(140, 200, 10);
const height_2 = range(150, 210, 10);

export const ageSelect = arrayToSelect(age);
export const weight1Select = arrayToSelect(weight_1);
export const weight2Select = arrayToSelect(weight_2);
export const height1Select = arrayToSelect(height_1);
export const height2Select = arrayToSelect(height_2);
