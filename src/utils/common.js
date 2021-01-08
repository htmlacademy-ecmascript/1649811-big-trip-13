export const capitalizeFirstLetter = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const isOnline = () => {
  return window.navigator.onLine;
};
