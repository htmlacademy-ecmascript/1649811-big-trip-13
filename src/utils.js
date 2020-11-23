import dayjs from "dayjs";

export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

export const getDuration = (startDate, endDate) => {
  const diffMinutes = dayjs(endDate).diff(startDate, `minute`);

  if (diffMinutes < 60) {
    return `${printTimeUnit(diffMinutes)}M`;
  }

  let hours = Math.floor(diffMinutes / 60);
  if (hours < 24) {
    let minutes = Math.floor(diffMinutes - hours * 60);
    return `${printTimeUnit(hours)}H ${printTimeUnit(minutes)}M`;
  }

  const days = Math.floor(hours / 24);
  hours = Math.floor(hours - days * 24);
  const minutes = Math.floor(diffMinutes - hours * 60 - days * 24 * 60);
  return `${printTimeUnit(days)}D ${printTimeUnit(hours)}H ${printTimeUnit(minutes)}M`;
};

const printTimeUnit = (unit) => {
  return unit > 10 ? unit : `0${unit}`;
};

