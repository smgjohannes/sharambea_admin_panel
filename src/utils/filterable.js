import { sortByFinishTime } from './sortable';

export const filterByCategory = (array, value) => {
  const { name, range } = value;

  return sortByFinishTime(array.filter((r) => (r.category ? r.category === name : r.category === range)));
};

export const filterByDistance = (array, value) => {
  return sortByFinishTime(array.filter((r) => r.distance.toLowerCase() === value.toLowerCase()));
};

export const filterByGender = (array, value) => {
  return sortByFinishTime(array.filter((r) => r.participant.gender.toLowerCase() === value.toLowerCase()));
};
