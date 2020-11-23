import {getRandomInt, shuffle} from "../utils";
import {cities, descriptions} from "./data";
import {DEFAULT_POINT_TYPE, POINT_TYPES} from "../constants";
import dayjs from "dayjs";
import {generateOffers} from "./offer";

const MIN_COUNT_DESCRIPTIONS = 1;
const MAX_COUNT_DESCRIPTIONS = 5;

const MIN_COUNT_PHOTOS = 1;
const MAX_COUNT_PHOTOS = 5;

const MIN_PRICE = 5;
const MAX_PRICE = 500;

const MAX_DAYS_GAP = 10;
const MIN_MINUTE_GAP = 10;
const MAX_MINUTE_GAP = 60 * 24 * 3;

const generateCity = () => {
  return cities[getRandomInt(0, cities.length - 1)];
};

const getRandomEventType = () => {
  return POINT_TYPES[getRandomInt(0, POINT_TYPES.length - 1)];
};

const generateDescription = () => {
  const count = getRandomInt(MIN_COUNT_DESCRIPTIONS, MAX_COUNT_DESCRIPTIONS);
  return shuffle(descriptions).slice(0, count).join(` `).trim();
};

const generateImages = () => {
  const count = getRandomInt(MIN_COUNT_PHOTOS, MAX_COUNT_PHOTOS);
  return Array(count).fill([]).map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

const generateDate = () => {
  const daysGap = getRandomInt(0, MAX_DAYS_GAP);
  const minutesGap = getRandomInt(MIN_MINUTE_GAP, MAX_MINUTE_GAP);

  const dateStart = dayjs().add(daysGap, `day`).toDate();
  const dateEnd = dayjs(dateStart).add(minutesGap, `minute`).toDate();
  return {
    start: dateStart,
    end: dateEnd,
  };
};

const generatePointOffers = (type) => {
  const offers = generateOffers(type);
  if (offers.length === 0) {
    return [];
  }
  const count = getRandomInt(0, offers.length - 1);

  return shuffle(offers).slice(0, count);
};

export const point = {
  pointType: DEFAULT_POINT_TYPE,
  destination: ``,
  offers: [],
  price: 0,
  date: {
    start: null,
    end: null,
  },
  isFavorite: false,
  info: null,
};

export const generatePoint = () => {
  const pointType = getRandomEventType();
  const offers = generatePointOffers(pointType);

  return {
    pointType,
    destination: generateCity(),
    offers,
    price: getRandomInt(MIN_PRICE, MAX_PRICE),
    date: generateDate(),
    isFavorite: Boolean(getRandomInt(0, 1)),
    info: {
      description: generateDescription(),
      images: generateImages(),
    },
  };
};
