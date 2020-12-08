import TripInfoView from "./view/trip-info";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import {generatePoints} from "./mock/point";
import {generateTripInfo} from "./mock/trip";
import {generateOffers} from "./mock/offer";
import {generateFilters} from "./mock/filter";
import {RenderPosition, render} from "./utils/render";
import TripPresenter from "./presenter/trip";

const POINT_COUNT = 5;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);
const tripInfo = generateTripInfo(points);
const filters = generateFilters(points);

const bodyElement = document.querySelector(`.page-body`);
const mainTripElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripEventsElement = bodyElement.querySelector(`.page-main section.trip-events`);

const renderTripMainBlock = (tripMainContainer, info, pageFilters) => {
  // main trip info
  render(tripMainContainer, new TripInfoView(info), RenderPosition.AFTERBEGIN);

  // menu
  const menuHeaderElement = tripMainContainer.querySelector(`h2.visually-hidden`);
  render(menuHeaderElement, new MenuView(), RenderPosition.AFTER);

  // filter
  const filterHeaderElement = tripMainContainer.querySelector(`h2.visually-hidden:last-child`);
  render(filterHeaderElement, new FilterView(pageFilters), RenderPosition.AFTER);
};

// const renderPoint = (pointListContainer, point) => {
//   const pointComponent = new PointView(point, offers);
//   const pointFormComponent = new PointFormView(point, offers);
//
//   const replacePointToForm = () => {
//     replace(pointFormComponent, pointComponent);
//   };
//
//   const replaceFormToPoint = () => {
//     replace(pointComponent, pointFormComponent);
//   };
//
//   const onEscKeyDown = (evt) => {
//     evt.preventDefault();
//     if (evt.key === `Escape` || evt.key === `Esc`) {
//       replaceFormToPoint();
//       document.removeEventListener(`keydown`, onEscKeyDown);
//     }
//   };
//
//   pointComponent.setEditClickHandler(() => {
//     replacePointToForm();
//     document.addEventListener(`keydown`, onEscKeyDown);
//   });
//
//   pointFormComponent.setFormSubmitHandler(() => {
//     replaceFormToPoint();
//     document.removeEventListener(`keydown`, onEscKeyDown);
//   });
//
//   pointFormComponent.setFormCloseHandler(() => {
//     replaceFormToPoint();
//     document.removeEventListener(`keydown`, onEscKeyDown);
//   });
//
//   render(pointListContainer, pointComponent, RenderPosition.BEFOREEND);
// };

// const renderPointList = (tripEventContainer, listPoints) => {
//   // no-point
//   if (points.length === 0) {
//     render(tripEventsElement, new NoPointView(), RenderPosition.BEFOREEND);
//     return;
//   }
//
//   // sort
//   render(tripEventContainer, new SortView(), RenderPosition.BEFOREEND);
//
//   // point list
//   const pointListComponent = new PointListView();
//   render(tripEventsElement, pointListComponent, RenderPosition.BEFOREEND);
//
//   for (let i = 0; i < listPoints.length; i++) {
//     renderPoint(pointListComponent, points[i]);
//   }
// };

renderTripMainBlock(mainTripElement, tripInfo, filters);

const trip = new TripPresenter(tripEventsElement);
trip.init(points, offers);
// renderPointList(tripEventsElement, points);
