import dayjs from "dayjs";
import {sortByDate} from "./point";

const EMPTY_TRIP_INFO = {
  title: `No travel`,
  price: 0,
  date: ``,
};

const createTitle = (points) => {
  const length = points.length;
  switch (length) {
    case 1:
      return `${points[0].destination}`;
    case 2:
      return `${points[0].destination} — ${points[1].destination}`;
    case 3:
      return `${points[0].destination} — ${points[1].destination} — ${points[2].destination}`;
    default:
      return `${points[0].destination} — ... — ${points[length - 1].destination}`;
  }
};

const createPrice = (points) => {
  return points.reduce((sum, item) => {
    const offersPrice = item.offers
      ? item.offers.reduce((offersSum, offer) => (offersSum + offer.price), 0)
      : 0;
    return sum + item.price + offersPrice;
  }, 0);
};

const createDate = (points) => {
  const start = points[0].date.start;
  const end = points[points.length - 1].date.end;

  return `${dayjs(start).format(`DD MMM`)} — ${dayjs(end).format(`DD MMM`)}`;
};

export const createTripInfo = (points) => {
  if (points.length === 0) {
    return EMPTY_TRIP_INFO;
  }

  const sortedPoints = points.slice().sort(sortByDate);

  return {
    title: createTitle(sortedPoints),
    price: createPrice(sortedPoints),
    date: createDate(sortedPoints)
  };
};
