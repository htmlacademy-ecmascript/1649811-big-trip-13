import {generatePoints} from "./mock/point";
import {generateOffers} from "./mock/offer";
import TripPresenter from "./presenter/trip";
import TripInfoPresenter from "./presenter/trip-info";
import PointsModel from "./model/points";

import MenuView from "./view/menu";
import FilterView from "./view/filter";

import {RenderPosition, render} from "./utils/render";
import {createFilters} from "./utils/point";

const POINT_COUNT = 5;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);
const filters = createFilters(points);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const bodyElement = document.querySelector(`.page-body`);
const tripInfoElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripPointsElement = bodyElement.querySelector(`.page-main section.trip-events`);

// renderTripMainBlock(mainTripElement, tripInfo, filters);
const tripInfo = new TripInfoPresenter(tripInfoElement, pointsModel);
tripInfo.init();

// trip
const trip = new TripPresenter(tripPointsElement, pointsModel);
trip.init(offers);

// menu
const menuHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden`);
render(menuHeaderElement, new MenuView(), RenderPosition.AFTER);

// filter
const filterHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden:last-child`);
render(filterHeaderElement, new FilterView(filters), RenderPosition.AFTER);
