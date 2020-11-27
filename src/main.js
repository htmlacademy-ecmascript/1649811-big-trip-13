import TripInfo from "./view/trip-info";
import Menu from "./view/menu";
import Filter from "./view/filter";
import Sort from "./view/sort";
import {createContentTemplate} from "./view/content";
import {createPointFormTemplate} from "./view/point-form";
import {createPointTemplate} from "./view/point";
import {generatePoints} from "./mock/point";
import {generateTrip} from "./mock/trip";
import {generateOffers} from "./mock/offer";
import {generateFilters} from "./mock/filter";
import {render, renderElement, RenderPosition} from "./utils";
// import {defaultPoint} from "./mock/point";


const POINT_COUNT = 15;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);
const trip = generateTrip(points);
const filters = generateFilters(points);

const bodyElement = document.querySelector(`.page-body`);

// block header
const siteHeaderElement = bodyElement.querySelector(`.page-header`);

const mainTripElement = siteHeaderElement.querySelector(`.trip-main`);

renderElement(mainTripElement, new TripInfo(trip).getElement(), RenderPosition.AFTERBEGIN);

const tripControlsElement = mainTripElement.querySelector(`.trip-main__trip-controls`);

const menuHeaderElement = tripControlsElement.querySelector(`h2.visually-hidden`);
renderElement(menuHeaderElement, new Menu().getElement(), RenderPosition.AFTER);

const filterHeaderElement = tripControlsElement.querySelector(`h2.visually-hidden:last-child`);
renderElement(filterHeaderElement, new Filter(filters).getElement(), RenderPosition.AFTER);

// block main
const siteMainElement = bodyElement.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
// sort
renderElement(tripEventsElement, new Sort().getElement(), RenderPosition.BEFOREEND);
// content
render(tripEventsElement, createContentTemplate(), `beforeend`);

const contentElement = tripEventsElement.querySelector(`.trip-events__list`);

// render(contentElement, createPointFormTemplate(defaultPoint, offers), `beforeend`);

render(contentElement, createPointFormTemplate(points[0], offers), `beforeend`);
for (let i = 1; i < points.length; i++) {
  render(contentElement, createPointTemplate(points[i]), `beforeend`);
}

