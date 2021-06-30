export const sortNumerically = (order = false, array, key) =>
  array.sort((a, b) => (!order ? a[key] - b[key] : b[key] - a[key]));

export const sortAphabetically = (order = false, array, key) =>
  !order
    ? array.sort((a, b) => (a[key] < b[key] ? -1 : 0))
    : array.sort((a, b) => (a[key] > b[key] ? -1 : 0));

export const convertCMToFeet = value => Math.floor(value * 0.0328084);

export const convertFeetFractionToInches = (value) =>
  (((value * 0.0328084) % 1) * 12).toFixed(2);