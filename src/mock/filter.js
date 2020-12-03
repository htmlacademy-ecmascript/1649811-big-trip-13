import {isPointFuture, isPointPast} from "../utils/point";

const pointsToFilter = {
  Everything: (points) => points,
  Future: (points) => points.filter((point) => isPointFuture(point.date.start)),
  Past: (points) => points.filter((point) => isPointPast(point.date.end)),
};

export const generateFilters = (points) => {
  return Object.entries(pointsToFilter).map(([filterName, filterPoints]) => {
    return {
      name: filterName,
      points: filterPoints(points),
    };
  });
};
