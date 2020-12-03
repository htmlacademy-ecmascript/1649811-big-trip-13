import dayjs from "dayjs";
import {DEFAULT_POINT_TYPE, EMPTY_POINT, POINT_TYPES} from "../constants";
import {cities} from "../mock/data";
import Abstract from "./abstract";

const createOfferItem = (offer, point) => {
  const {title, price} = offer;
  const {pointType, offers: pointOffers} = point;
  const typeName = `event-offer-${pointType.toLowerCase()}`;
  const id = `${typeName}-${offer.id}`;
  const checked = pointOffers.includes(offer) ? `checked` : ``;
  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${typeName}" ${checked}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
   </div>
  `;
};

const createOffersTemplate = (offers, point) => {
  const items = offers.map((offer) => createOfferItem(offer, point)).join(``);
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
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${eventType}</label>
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
  const imageTemplate = (images.length !== 0) ? createDestinationImagesTemplate(images) : ``;
  return `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${destination}</h3>
    <p class="event__destination-description">${description}</p>
    ${imageTemplate}
  </section>
  `;
};

const createPointFormTemplate = (point, offers) => {
  const {pointType, date, price, destination, info} = point;
  const eventTypeBlock = createEventTypeTemplate(pointType);
  const offersBlock = (pointType in offers)
    ? createOffersTemplate(offers[pointType], point)
    : ``;
  const destinationInfo = (info !== null)
    ? createDestinationTemplate(destination, info)
    : ``;
  const citiesList = cities.map((city) => `<option value="${city}"></option>`).join(``);
  const startDate = (date.start !== null)
    ? dayjs(date.start).format(`DD/MM/YY HH:mm`)
    : ``;
  const endDate = (date.end !== null)
    ? dayjs(date.end).format(`DD/MM/YY HH:mm`)
    : ``;
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

            ${citiesList}

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

export default class PointForm extends Abstract {
  constructor(point = EMPTY_POINT, offers) {
    super();
    this._point = point;
    this._offers = offers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
  }

  getTemplate() {
    return createPointFormTemplate(this._point, this._offers);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
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
}
