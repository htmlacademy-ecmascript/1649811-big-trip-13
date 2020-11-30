import TripInfoView from "./view/trip-info";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import SortView from "./view/sort";
import PointListView from "./view/point-list";
import PointFormView from "./view/point-form";
import PointView from "./view/point";
import NoPointView from "./view/no-point";
import {generatePoints} from "./mock/point";
import {generateTrip} from "./mock/trip";
import {generateOffers} from "./mock/offer";
import {generateFilters} from "./mock/filter";
import {renderElement, RenderPosition} from "./utils";
import {DEFAULT_HIDE_FORM_KEY} from "./constants";

const POINT_COUNT = 20;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);
const trip = generateTrip(points);
const filters = generateFilters(points);

const renderTripMainBlock = (tripMainContainer, tripInfo, pageFilters) => {
  // main trip info
  renderElement(tripMainContainer, new TripInfoView(tripInfo).getElement(), RenderPosition.AFTERBEGIN);

  // menu
  const menuHeaderElement = tripMainContainer.querySelector(`h2.visually-hidden`);
  renderElement(menuHeaderElement, new MenuView().getElement(), RenderPosition.AFTER);

  // filter
  const filterHeaderElement = tripMainContainer.querySelector(`h2.visually-hidden:last-child`);
  renderElement(filterHeaderElement, new FilterView(pageFilters).getElement(), RenderPosition.AFTER);
};
const renderPoint = (pointListContainer, point) => {
  const pointComponent = new PointView(point, offers);
  const pointFormComponent = new PointFormView(point, offers);

  const replacePointToForm = () => {
    pointListContainer.replaceChild(pointFormComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointListContainer.replaceChild(pointComponent.getElement(), pointFormComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === DEFAULT_HIDE_FORM_KEY || evt.key === DEFAULT_HIDE_FORM_KEY.slice(0, 3)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  pointFormComponent.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  pointFormComponent.getElement().querySelector(`form`)
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  renderElement(pointListContainer, pointComponent.getElement(), RenderPosition.BEFOREEND);
};
const renderPointList = (tripEventContainer, listPoints) => {
  // no-point
  if (points.length === 0) {
    renderElement(tripEventsElement, new NoPointView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  // sort
  renderElement(tripEventContainer, new SortView().getElement(), RenderPosition.BEFOREEND);

  // point list
  const pointListComponent = new PointListView();
  renderElement(tripEventsElement, pointListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < listPoints.length; i++) {
    renderPoint(pointListComponent.getElement(), points[i]);
  }
};

const bodyElement = document.querySelector(`.page-body`);
const mainTripElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripEventsElement = bodyElement.querySelector(`.page-main section.trip-events`);

renderTripMainBlock(mainTripElement, trip, filters);
renderPointList(tripEventsElement, points);
