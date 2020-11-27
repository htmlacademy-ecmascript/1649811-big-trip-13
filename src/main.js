import {createTripInfoTemplate} from "./view/trip-info";
import {createMenuTemplate} from "./view/menu";
import {createFiltersTemplate} from "./view/filter";
import {createSortTemplate} from "./view/sort";
import {createContentTemplate} from "./view/content";
import {createPointFormTemplate} from "./view/point-form";
import {createPointTemplate} from "./view/point";
import {generatePoints} from "./mock/point";
import {generateTrip} from "./mock/trip";
import {generateOffers} from "./mock/offer";
import {generateFilters} from "./mock/filter";
// import {defaultPoint} from "./mock/point";

const POINT_COUNT = 15;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);
const trip = generateTrip(points);
const filters = generateFilters(points);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector(`.page-body`);

const siteHeaderElement = bodyElement.querySelector(`.page-header`);
const mainTripElement = siteHeaderElement.querySelector(`.trip-main`);

render(mainTripElement, createTripInfoTemplate(trip), `afterbegin`);

const tripControlsElement = mainTripElement.querySelector(`.trip-main__trip-controls`);

render(tripControlsElement, createMenuTemplate(), `beforeend`);
render(tripControlsElement, createFiltersTemplate(filters), `beforeend`);

const siteMainElement = bodyElement.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createContentTemplate(), `beforeend`);

const contentElement = tripEventsElement.querySelector(`.trip-events__list`);

// render(contentElement, createPointFormTemplate(defaultPoint, offers), `beforeend`);

render(contentElement, createPointFormTemplate(points[0], offers), `beforeend`);
for (let i = 1; i < points.length; i++) {
  render(contentElement, createPointTemplate(points[i]), `beforeend`);
}

