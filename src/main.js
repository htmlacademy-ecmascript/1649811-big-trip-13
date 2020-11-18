import {createMainTripInfoTemplate} from "./view/main-trip-info";
import {createTripCostTemplate} from "./view/trip-cost";
import {createTripInfoTemplate} from "./view/trip-info";
import {createMenuTemplate} from "./view/menu";
import {createFiltersTemplate} from "./view/filter";
import {createSortTemplate} from "./view/sort";
import {createNewPointTemplate} from "./view/new-point";
import {createContentTemplate} from "./view/content";
import {createEditPointTemplate} from "./view/edit-point";
import {createPointTemplate} from "./view/point";

const POINT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector(`.page-body`);
const siteHeaderElement = bodyElement.querySelector(`.page-header`);
const mainTripElement = siteHeaderElement.querySelector(`.trip-main`);

render(mainTripElement, createMainTripInfoTemplate(), `afterbegin`);

const tripInfoElement = mainTripElement.querySelector(`.trip-main__trip-info`);

render(tripInfoElement, createTripInfoTemplate(), `afterbegin`);
render(tripInfoElement, createTripCostTemplate(), `beforeend`);

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

render(contentElement, createNewPointTemplate(), `beforeend`);
render(contentElement, createEditPointTemplate(), `beforeend`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(contentElement, createPointTemplate(i + 1), `beforeend`);
}
