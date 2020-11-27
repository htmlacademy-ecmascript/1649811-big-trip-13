const pointsToFilter = {
  Everything: (points) => points.length,
  Future: (points) => points.filter((point) => point.date.start.getTime() > Date.now()),
  Past: (points) => points.filter((point) => point.date.start.getTime() < Date.now()),
};

export const generateFilters = (points) => {
  return Object.entries(pointsToFilter).map(([filterName, filterPoints]) => {
    return {
      name: filterName,
      points: filterPoints(points),
    };
  });
};
