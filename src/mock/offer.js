import {checkInOffers, restaurantOffers, transportOffers} from "./data";
import {POINT_TYPES} from "../constants";
import {getRandomInt} from "../utils/common";

const MIN_PRICE = 5;
const MAX_PRICE = 100;

export const getOffers = (pointType) => {
  switch (pointType) {
    case `Sightseeing`:
      return null;
    case `Check-in`:
      return checkInOffers;
    case `Restaurant`:
      return restaurantOffers;
    default:
      return transportOffers;
  }
};

export const generateOffers = () => {
  const offers = {};
  for (let i = 0; i < POINT_TYPES.length; i++) {
    const pointOffers = getOffers(POINT_TYPES[i]);
    if (!pointOffers) {
      continue;
    }
    offers[POINT_TYPES[i]] = pointOffers
      .sort()
      .map((item, index) => {
        return {
          id: index + 1,
          title: item,
          price: getRandomInt(MIN_PRICE, MAX_PRICE)
        };
      });
  }
  return offers;
};
