import {generatePoints} from "./mock/point";
import {generateOffers} from "./mock/offer";
import TripPresenter from "./presenter/trip";
import TripInfoPresenter from "./presenter/trip-info";
import FilterPresenter from "./presenter/filter";
import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import SiteMenuView from "./view/site-menu";
import StatisticsView from "./view/statistics";
import {RenderPosition, render, remove} from "./utils/render";
import {FilterType, MenuItem, UpdateType} from "./const";

const POINT_COUNT = 5;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const bodyElement = document.querySelector(`.page-body`);
const tripInfoElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripElement = bodyElement.querySelector(`.page-main section.trip-events`);

// tripInfo
const tripInfo = new TripInfoPresenter(tripInfoElement, pointsModel);
tripInfo.init();

// trip
const tripPresenter = new TripPresenter(tripElement, pointsModel, filterModel);
tripPresenter.init(offers);

// menu
const siteMenuComponent = new SiteMenuView(tripInfoElement);
const menuHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden`);
render(menuHeaderElement, siteMenuComponent, RenderPosition.AFTER);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripPresenter.init(offers);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripElement, statisticsComponent, RenderPosition.AFTER);
      break;
    case MenuItem.ADD_POINT:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
      tripPresenter.init(offers);
      tripPresenter.createPoint(siteMenuComponent.enableAddPointButton);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

// filter
const filterHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden:last-child`);
const filterPresenter = new FilterPresenter(filterHeaderElement, pointsModel, filterModel);
filterPresenter.init();
