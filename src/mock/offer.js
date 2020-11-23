import {checkInOffers, restaurantOffers, transportOffers} from "./data";
import {getRandomInt} from "../utils";

const MIN_PRICE = 5;
const MAX_PRICE = 100;

// const offer = {
//   id: 1,
//   title: ``,
//   price: ``,
// };

export const getOffers = (type) => {
  let offers;
  switch (type) {
    case `Sightseeing`:
      return [];
    case `Check-in`:
      offers = checkInOffers;
      break;
    case `Restaurant`:
      offers = restaurantOffers;
      break;
    default:
      offers = transportOffers;
      break;
  }

  return offers;
};

export const generateOffers = (type) => {
  const offers = getOffers(type);
  if (offers.length === 0) {
    return [];
  }

  return Array(offers.length).fill({}).map((item, index) => {
    return {
      title: offers[index],
      price: getRandomInt(MIN_PRICE, MAX_PRICE),
    };
  });
};
