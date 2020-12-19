import dayjs from "dayjs";
import {FilterType} from "../const";

const isPointPast = (endDate) => {
  return dayjs().isAfter(endDate);
};

const isPointFuture = (startDate) => {
  const currentDate = dayjs();
  return currentDate.isSame(startDate)
    || currentDate.isBefore(startDate);
};

export const filter = {
  [FilterType.DEFAULT]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.date.start)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.date.end)),
};
