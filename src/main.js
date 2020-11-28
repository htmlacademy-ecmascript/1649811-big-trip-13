import TripInfoView from "./view/trip-info";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import SortView from "./view/sort";
import PointListView from "./view/point-list";
import PointFormView from "./view/point-form";
import PointView from "./view/point";
import {defaultPoint, generatePoints} from "./mock/point";
import {generateTrip} from "./mock/trip";
import {generateOffers} from "./mock/offer";
import {generateFilters} from "./mock/filter";
import {renderElement, RenderPosition} from "./utils";

const POINT_COUNT = 20;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);
const trip = generateTrip(points);
const filters = generateFilters(points);

let newPointFormComponent = null;

const bodyElement = document.querySelector(`.page-body`);

// ******** block header
const mainTripElement = bodyElement.querySelector(`.page-header .trip-main`);

renderElement(mainTripElement, new TripInfoView(trip).getElement(), RenderPosition.AFTERBEGIN);

const tripControlsElement = mainTripElement.querySelector(`.trip-main__trip-controls`);
// menu
const menuHeaderElement = tripControlsElement.querySelector(`h2.visually-hidden`);
renderElement(menuHeaderElement, new MenuView().getElement(), RenderPosition.AFTER);
// filter
const filterHeaderElement = tripControlsElement.querySelector(`h2.visually-hidden:last-child`);
renderElement(filterHeaderElement, new FilterView(filters).getElement(), RenderPosition.AFTER);

// *********** block main
const siteMainElement = bodyElement.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

// sort
renderElement(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

// point list
const pointListComponent = new PointListView();
renderElement(tripEventsElement, pointListComponent.getElement(), RenderPosition.BEFOREEND);

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point, offers);
  const pointFormComponent = new PointFormView(point, offers);

  const replacePointToForm = () => {
    pointListElement.replaceChild(pointFormComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointFormComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replacePointToForm();
    });

  pointFormComponent.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replaceFormToPoint();
    });

  pointFormComponent.getElement().querySelector(`form`)
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
    });

  renderElement(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < points.length; i++) {
  renderPoint(pointListComponent.getElement(), points[i]);
}

// add point
const addPointButton = mainTripElement.querySelector(`.trip-main__event-add-btn`);
addPointButton.addEventListener(`click`, () => {
  if (!newPointFormComponent) {
    newPointFormComponent = new PointFormView(defaultPoint, offers);
    renderElement(pointListComponent.getElement(), newPointFormComponent.getElement(), RenderPosition.AFTERBEGIN);

    newPointFormComponent.getElement().querySelector(`form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        newPointFormComponent.getElement().remove();
        newPointFormComponent = null;
      });

    newPointFormComponent.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        newPointFormComponent.getElement().remove();
        newPointFormComponent = null;
      });
  }
});
