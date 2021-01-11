import dayjs from "dayjs";

export const getLabels = (points) => {
  const labels = points.map((point) => point.pointType.toUpperCase());
  return [...new Set(labels)];
};

const getDays = (minutes) => {
  return Math.ceil(minutes / 1440);
};

export const getData = (labels, points) => {

  const moneys = [];
  const countTypes = [];
  const countDays = [];

  labels.forEach((label) => {
    let price = 0;
    let count = 0;
    let minutes = 0;

    points
      .filter((point) => point.pointType.toUpperCase() === label)
      .forEach((point) => {
        price += point.price;
        count++;
        minutes += dayjs(point.date.end).diff(point.date.start, `minute`);
      });

    moneys.push(price);
    countTypes.push(count);
    countDays.push(getDays(minutes));
  });

  return [moneys, countTypes, countDays];
};
