import {checkInOffers, restaurantOffers, transportOffers} from "./data";
import {POINT_TYPES} from "../constants";
import {getRandomInt} from "../utils";

const MIN_PRICE = 5;
const MAX_PRICE = 100;

export const getOffers = (pointType) => {
  let pointOffers;
  switch (pointType) {
    case `Sightseeing`:
      return null;
    case `Check-in`:
      pointOffers = checkInOffers;
      break;
    case `Restaurant`:
      pointOffers = restaurantOffers;
      break;
    default:
      pointOffers = transportOffers;
      break;
  }

  return pointOffers;
};

export const generateOffers = () => {
  const offers = new Map();
  for (let i = 0; i < POINT_TYPES.length; i++) {
    const pointOffers = getOffers(POINT_TYPES[i]);
    if (!pointOffers) {
      continue;
    }
    const generatedOffers = pointOffers
      .sort()
      .map((item, index) => {
        return {
          id: index + 1,
          title: item,
          price: getRandomInt(MIN_PRICE, MAX_PRICE)
        };
      });

    offers.set(POINT_TYPES[i], generatedOffers);
  }
  return offers;
};
