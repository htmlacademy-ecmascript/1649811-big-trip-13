import dayjs from "dayjs";
import {DEFAULT_POINT_TYPE, EMPTY_POINT, POINT_TYPES} from "../const";
import Smart from "./smart";
import {generateDestination} from "../mock/destination";
import {parseDate} from "../utils/common";
import {cities} from "../mock/data";

const destinations = generateDestination();

const createOfferItem = (offer, offers, pointType) => {
  const {title, price, id: offerId} = offer;
  const typeName = `event-offer-${pointType.toLowerCase()}`;
  const id = `${typeName}-${offerId}`;
  const checked = offers.includes(offer) ? `checked` : ``;
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${typeName}" ${checked}>
    <label class="event__offer-label" for="${id}" data-offer-id="${offerId}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
   </div>
  `;
};

const createOffersTemplate = (data) => {
  const {availableOffers, offers, pointType} = data;
  const items = availableOffers.map((offer) => createOfferItem(offer, offers, pointType)).join(``);
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
        ${items}
    </div>
  </section>
`;
};

const createEventItem = (eventType, pointType) => {
  const type = eventType.toLowerCase();
  const checked = (eventType === pointType) ? `checked` : ``;
  return `
  <div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${eventType}</label>
  </div>
  `;
};

const createEventTypeTemplate = (pointType = DEFAULT_POINT_TYPE) => {
  const items = POINT_TYPES.map((eventType) => createEventItem(eventType, pointType)).join(``);
  return `
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.toLowerCase()}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${items}
      </fieldset>
    </div>
  </div>
  `;
};

const createDestinationImagesTemplate = (images) => {
  const items = images.map((image) => (
    `<img class="event__photo" src="${image}" alt="Event photo">`)).join(``);
  return `
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${items}
    </div>
  </div>
  `;
};

const createDestinationTemplate = (destination, info) => {
  const {description, images} = info;
  const imageTemplate = (images.length > 0) ? createDestinationImagesTemplate(images) : ``;
  return `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${destination}</h3>
    <p class="event__destination-description">${description}</p>
    ${imageTemplate}
  </section>
  `;
};

const createPointFormTemplate = (data) => {
  const {pointType, price, destination, info, availableOffers} = data;
  const {start: startDate, end: endDate} = data.date;
  const eventTypeBlock = createEventTypeTemplate(pointType);
  const offersBlock = availableOffers
    ? createOffersTemplate(data)
    : ``;
  const destinationInfo = info
    ? createDestinationTemplate(destination, info)
    : ``;
  const destinationList = Object.keys(destinations)
    .map((city) => `<option value="${city}"></option>`).join(``);

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">

        ${eventTypeBlock}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">

            ${pointType}

          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">

            ${destinationList}

          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
          <!-- Offers block -->
          ${offersBlock}

         <!-- Destination Info -->
         ${destinationInfo}

      </section>
    </form>
  </li>`;
};

export default class PointForm extends Smart {
  constructor(point = EMPTY_POINT, offers) {
    super();

    this._offers = offers;
    this._point = point;
    this._data = this._parsePointToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._pointTypeToggleHandler = this._pointTypeToggleHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPointFormTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._parseDataToPoint(this._data));
  }

  _formCloseHandler() {
    this._callback.formClose();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._formCloseHandler);
  }

  _parsePointToData(point) {
    const availableOffers = (point.pointType in this._offers)
      ? this._offers[point.pointType]
      : null;

    const date = {
      start: point.date.start !== null
        ? dayjs(point.date.start).format(`DD/MM/YY HH:mm`)
        : ``,
      end: point.date.end !== null
        ? dayjs(point.date.end).format(`DD/MM/YY HH:mm`)
        : ``,
    };

    return Object.assign(
        {},
        point,
        {
          date,
          availableOffers,
        }
    );

  }

  _parseDataToPoint(data) {
    const date = {
      start: parseDate(data.date.start),
      end: parseDate(data.date.end),
    };


    data = Object.assign({}, data, {date});

    delete data.availableOffers;

    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-wrapper`)
      .addEventListener(`click`, this._pointTypeToggleHandler);

    this.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);

    Object.values(this.getElement().querySelectorAll(`.event__input--time`))
      .forEach((element) => element.addEventListener(`change`, this._dateChangeHandler)
      );

    if (this._data.availableOffers) {
      this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offerChangeHandler);
    }

    this.getElement().querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);
  }

  _offerChangeHandler(evt) {
    const target = evt.target.closest(`label.event__offer-label`);
    if (!target) {
      return;
    }

    const id = +target.dataset.offerId;
    const offers = this._data.offers.slice();
    const index = offers.findIndex((item) => item.id === id);

    if (index !== -1) {
      offers.splice(index, 1);
    } else {
      const offer = this._data.availableOffers
        .find((item) => item.id === id);

      offers.push(offer);
    }

    this.updateData({offers}, true);
  }

  _pointTypeToggleHandler(evt) {
    const target = evt.target.closest(`label.event__type-label`);
    if (!target) {
      return;
    }

    const pointType = target.textContent;

    const availableOffers = pointType in this._offers
      ? this._offers[pointType]
      : null;

    this.updateData({pointType, availableOffers, offers: []});
  }

  _destinationChangeHandler(evt) {
    let city = evt.target.value;
    // в chrome появляется дополнительньй город "b"
    if (!city || !cities.includes(city)) {
      evt.target.value = ``;
      evt.target.placeholder = `Select city`;
      evt.target.focus();
      return;
    }

    this.updateData({destination: city, info: destinations[city].info});
  }

  _dateChangeHandler(evt) {
    const date = Object.assign({}, this._data.date);

    if (evt.target.name === `event-start-time`) {
      date.start = evt.target.value;
    } else {
      date.end = evt.target.value;
    }

    if (date.end < date.start) {
      evt.target.focus();
      return;
    }

    this.updateData({date}, true);
  }

  _priceChangeHandler(evt) {
    const price = Number.parseInt(evt.target.value, 10);
    if (!price) {
      evt.target.value = ``;
      evt.target.placeholder = `NaN`;
      evt.target.focus();
      return;
    }

    this.updateData({price}, true);
  }

  reset(point) {
    this.updateData(this._parsePointToData(point));
  }
}
