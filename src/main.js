import {generatePoints} from "./mock/point";
import {generateOffers} from "./mock/offer";
import TripPresenter from "./presenter/trip";
import TripInfoPresenter from "./presenter/trip-info";
import FilterPresenter from "./presenter/filter";
import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import MenuView from "./view/menu";
import {RenderPosition, render} from "./utils/render";

const POINT_COUNT = 5;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const bodyElement = document.querySelector(`.page-body`);
const tripInfoElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripPointsElement = bodyElement.querySelector(`.page-main section.trip-events`);

// tripInfo
const tripInfo = new TripInfoPresenter(tripInfoElement, pointsModel);
tripInfo.init();

// trip
const tripPresenter = new TripPresenter(tripPointsElement, pointsModel, filterModel);
tripPresenter.init(offers);

// menu
const menuHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden`);
render(menuHeaderElement, new MenuView(), RenderPosition.AFTER);

// filter
const filterHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden:last-child`);
const filterPresenter = new FilterPresenter(filterHeaderElement, pointsModel, filterModel);
filterPresenter.init();


tripInfoElement.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tripPresenter.createPoint();
  });
