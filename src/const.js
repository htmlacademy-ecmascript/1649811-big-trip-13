export const DEFAULT_POINT_TYPE = `Flight`;

export const EMPTY_POINT = {
  pointType: DEFAULT_POINT_TYPE,
  destination: ``,
  offers: [],
  price: ``,
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

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  OFFERS_INIT: `OFFERS_INIT`,
  DESTINATIONS_INIT: `DESTINATIONS_INIT`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
  ADD_POINT: `New event`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const EMPTY_TRIP_INFO = {
  title: `No travel`,
  price: 0,
  date: ``,
};

export const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

export const SuccessHttpStatusRange = {
  MIN: 200,
  MAX: 299
};
