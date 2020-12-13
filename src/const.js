export const POINT_TYPES = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`,
  `Flight`, `Check-in`, `Sightseeing`, `Restaurant`,
];

export const DEFAULT_POINT_TYPE = `Flight`;

export const EMPTY_POINT = {
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


export const FilterType = {
  DEFAULT: `Everything`,
  FUTURE: `Future`,
  PAST: `Past`
};

export const SortType = {
  DEFAULT: `sort-day`,
  PRICE: `sort-price`,
  TIME: `sort-time`
};