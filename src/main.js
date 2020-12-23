import TripPresenter from "./presenter/trip";
import TripInfoPresenter from "./presenter/trip-info";
import FilterPresenter from "./presenter/filter";
import PointsModel from "./model/points";
import FilterModel from "./model/filter";
import OffersModel from "./model/offers";
import DestinationsModel from "./model/destinations";
import SiteMenuView from "./view/site-menu";
import StatisticsView from "./view/statistics";
import {RenderPosition, render} from "./utils/render";
import {MenuItem, UpdateType} from "./const";
import Api from "./api";

const AUTHORIZATION = `Basic g2oty990ik29834vfr`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const bodyElement = document.querySelector(`.page-body`);
const tripInfoElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripElement = bodyElement.querySelector(`.page-main section.trip-events`);
const menuHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden`);
const filterHeaderElement = tripInfoElement.querySelector(`h2.visually-hidden:last-child`);

const tripInfo = new TripInfoPresenter(tripInfoElement, pointsModel);
const tripPresenter = new TripPresenter(
    tripElement, pointsModel, filterModel, offersModel, destinationsModel, api
);
const filterPresenter = new FilterPresenter(filterHeaderElement, pointsModel, filterModel);
const siteMenuComponent = new SiteMenuView(tripInfoElement);
const statisticsComponent = new StatisticsView();

tripInfo.init();
tripPresenter.init();
tripPresenter.setAddPointButtonEnableHandler(siteMenuComponent.enableAddPointButton);
filterPresenter.init();

render(tripElement, statisticsComponent, RenderPosition.AFTER);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATS:
      tripPresenter.hide();
      statisticsComponent.init(pointsModel.getPoints());
      statisticsComponent.show();
      break;
    case MenuItem.ADD_POINT:
      statisticsComponent.hide();
      tripPresenter.show();
      tripPresenter.createPoint(siteMenuComponent.enableAddPointButton);
      break;
  }
};

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);

    render(menuHeaderElement, siteMenuComponent, RenderPosition.AFTER);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(UpdateType.OFFERS_INIT, offers);
  });

api.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestination(UpdateType.DESTINATIONS_INIT, destinations);
  });
