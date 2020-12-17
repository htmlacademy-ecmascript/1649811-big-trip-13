import {cities, descriptions} from "./data";
import {POINT_TYPES} from "../const";
import dayjs from "dayjs";
import {getRandomInt, shuffle} from "../utils/common";
import {sortByDate} from "../utils/point";

const MIN_COUNT_DESCRIPTIONS = 1;
const MAX_COUNT_DESCRIPTIONS = 5;

const MIN_COUNT_PHOTOS = 0;
const MAX_COUNT_PHOTOS = 5;

const MIN_PRICE = 5;
const MAX_PRICE = 500;

const MAX_DAYS_GAP = 10;
const MIN_MINUTE_GAP = 10;
const MAX_MINUTE_GAP = 60 * 24 * 3;

function makeCounter() {
  let count = 1;
  return function () {
    return count++;
  };
}

export const generateId = makeCounter();

const getRandomPointType = () => {
  return POINT_TYPES[getRandomInt(0, POINT_TYPES.length - 1)];
};

const generateCity = () => {
  return cities[getRandomInt(0, cities.length - 1)];
};

export const generateDescription = () => {
  const count = getRandomInt(MIN_COUNT_DESCRIPTIONS, MAX_COUNT_DESCRIPTIONS);
  return shuffle(descriptions).slice(0, count).join(` `).trim();
};

export const generateImages = () => {
  const count = getRandomInt(MIN_COUNT_PHOTOS, MAX_COUNT_PHOTOS);
  return Array(count).fill([]).map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

export const generatePrice = () => {
  return getRandomInt(MIN_PRICE, MAX_PRICE);
};

const generateDate = () => {
  const daysGap = getRandomInt(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  const minutesGap = getRandomInt(MIN_MINUTE_GAP, MAX_MINUTE_GAP);

  const dateStart = dayjs().add(daysGap, `day`).add(getRandomInt(1, 60 * 24), `minute`);
  const dateEnd = dayjs(dateStart).add(minutesGap, `minute`);
  return {
    start: dateStart,
    end: dateEnd,
  };
};

const generatePointOffers = (offers) => {
  const clone = offers.slice();
  const count = getRandomInt(0, clone.length);

  return shuffle(clone).slice(0, count);
};

export const generatePoint = (offers) => {
  const pointType = getRandomPointType();
  const pointOffers = (pointType in offers)
    ? generatePointOffers(offers[pointType])
    : [];
  return {
    id: generateId(),
    pointType,
    destination: generateCity(),
    offers: pointOffers,
    price: generatePrice(),
    date: generateDate(),
    isFavorite: Boolean(getRandomInt(0, 1)),
    info: {
      description: generateDescription(),
      images: generateImages(),
    },
  };
};

export const generatePoints = (count, offers) => {
  return Array(count).fill({})
    .map(() => generatePoint(offers))
    .sort(sortByDate);
};
