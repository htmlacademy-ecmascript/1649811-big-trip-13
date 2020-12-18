import {generatePoints} from "./mock/point";
import {generateOffers} from "./mock/offer";
import TripPresenter from "./presenter/trip";
import TripInfoPresenter from "./presenter/trip-info";
import FilterPresenter from "./presenter/filter";
import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import SiteMenuView from "./view/site-menu";
import StatisticsView from "./view/statistics";
import {RenderPosition, render} from "./utils/render";
import {MenuItem} from "./const";

const POINT_COUNT = 15;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const bodyElement = document.querySelector(`.page-body`);
const tripInfoElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripElement = bodyElement.querySelector(`.page-main section.trip-events`);
const addPointButton = tripInfoElement.querySelector(`.trip-main__event-add-btn`);

// tripInfo
const tripInfo = new TripInfoPresenter(tripInfoElement, pointsModel);
tripInfo.init();

// trip
const tripPresenter = new TripPresenter(tripElement, pointsModel, filterModel, addPointButton);
tripPresenter.init(offers);

// menu
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.show();
      addPointButton.disabled = false;
      statsComponent.hide();
      break;
    case MenuItem.STATS:
      tripPresenter.hide();
      addPointButton.disabled = true;
      statsComponent.show();
      break;
  }
};
const siteMenuComponent = new SiteMenuView();
siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

const menuHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden`);
render(menuHeaderElement, siteMenuComponent, RenderPosition.AFTER);

// filter
const filterHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden:last-child`);
const filterPresenter = new FilterPresenter(filterHeaderElement, pointsModel, filterModel);
filterPresenter.init();

addPointButton
  .addEventListener(`click`, (evt) => {
    addPointButton.disabled = true;
    evt.preventDefault();
    tripPresenter.createPoint();
  });

// statistics
const statsComponent = new StatisticsView(points);
render(tripElement, statsComponent, RenderPosition.AFTER);
