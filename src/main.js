import {createTripInfoTemplate} from "./view/trip-info";
import {createMenuTemplate} from "./view/menu";
import {createFiltersTemplate} from "./view/filter";
import {createSortTemplate} from "./view/sort";
import {createContentTemplate} from "./view/content";
import {createPointFormTemplate} from "./view/point-form";
import {createPointTemplate} from "./view/point";
import {generatePoint} from "./mock/point";
import {generateTrip} from "./mock/trip";
import {point} from "./mock/point";

const POINT_COUNT = 15;

const points = Array(POINT_COUNT).fill({})
  .map(generatePoint)
  .sort((a, b) => {
    return a.date.start - b.date.start;
  });

const trip = generateTrip(points);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = bodyElement.querySelector(`.page-header`);
const mainTripElement = siteHeaderElement.querySelector(`.trip-main`);

render(mainTripElement, createTripInfoTemplate(trip), `afterbegin`);

const tripControlsElement = mainTripElement.querySelector(`.trip-main__trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2.visually-hidden:first-child`);

render(menuHeaderElement, createMenuTemplate(), `afterend`);

const filterHeaderElement = tripControlsElement.querySelector(`h2.visually-hidden:last-child`);

render(filterHeaderElement, createFiltersTemplate(), `afterend`);

const siteMainElement = bodyElement.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createContentTemplate(), `beforeend`);

const contentElement = tripEventsElement.querySelector(`.trip-events__list`);

render(contentElement, createPointFormTemplate(point), `beforeend`);

for (let i = 0; i < POINT_COUNT; i++) {
  // if (i === 0) {
  //   render(contentElement, createPointFormTemplate(points[i]), `beforeend`);
  // }
  render(contentElement, createPointTemplate(points[i]), `beforeend`);
}

