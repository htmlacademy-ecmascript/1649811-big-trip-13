import dayjs from "dayjs";
import {FilterType} from "../constants";

const printTimeUnit = (unit) => {
  return unit < 10 ? `0${unit}` : unit;
};

export const getDuration = (startDate, endDate) => {
  const diffMinutes = dayjs(endDate).diff(startDate, `minute`);

  if (diffMinutes < 60) {
    return `${printTimeUnit(diffMinutes)}M`;
  }

  let hours = Math.floor(diffMinutes / 60);
  if (hours < 24) {
    const minutes = Math.floor(diffMinutes - hours * 60);
    return `${printTimeUnit(hours)}H ${printTimeUnit(minutes)}M`;
  }

  const days = Math.floor(hours / 24);
  hours = Math.floor(hours - days * 24);
  const minutes = Math.floor(diffMinutes - hours * 60 - days * 24 * 60);

  return `${printTimeUnit(days)}D ${printTimeUnit(hours)}H ${printTimeUnit(minutes)}M`;
};

export const isPointPast = (endDate) => {
  return dayjs().isAfter(endDate, `date`);
};

export const isPointFuture = (startDate) => {
  const currentDate = dayjs();
  return currentDate.isSame(startDate, `date`)
    || currentDate.isBefore(startDate, `date`);
};

const pointsToFilter = {
  [FilterType.DEFAULT]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.date.start)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.date.end)),
};

export const createFilters = (points) => {
  return Object.entries(pointsToFilter).map(([filterName, filterPoints]) => {
    return {
      name: filterName,
      points: filterPoints(points),
    };
  });
};
