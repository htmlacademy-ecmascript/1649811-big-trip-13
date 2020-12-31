import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "./point";
import PointNewPresenter from "./point-new";
import LoadingView from "../view/loading";
import {FilterType, SortType, UpdateType, UserAction, State} from "../const";
import {RenderPosition, render, remove} from "../utils/render";
import {sortByDate, sortByPrice, sortByTime} from "../utils/point";
import {filter} from "../utils/filter";

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;

    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._isOffersLoad = false;
    this._isDestinationLoad = false;
    this._callback = {};

    this._loadingComponent = new LoadingView();
    this._sortComponent = null;
    this._noPointComponent = null;
    this._pointListComponent = new PointListView();
    this._pointNewPresenter = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(
        this._pointListComponent, this._handleViewAction
    );

    this._renderTrip();
  }

  setAddPointButtonEnableHandler(callback) {
    this._callback.enableAddPointButton = callback;
  }

  show(resetSort = true) {
    this._tripContainer.classList.remove(`visually-hidden`);

    if (resetSort) {
      this._clearTrip(true);
      this._renderTrip();
    }
  }

  hide() {
    this._tripContainer.classList.add(`visually-hidden`);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);

    if (this._getPoints().length === 0) {
      remove(this._noPointComponent);
      render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);
    }

    this._pointNewPresenter.init(
        callback,
        this._offersModel.getOffers(),
        this._destinationsModel.getDestinations()
    );
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        return filteredPoints.sort(sortByDate);
    }
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const offers = Object.assign({}, this._offersModel.getOffers());
    const destinations = Object.assign({}, this._destinationsModel.getDestinations());

    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    const isDataLoaded = this._isOffersLoad && this._isDestinationLoad;
    pointPresenter.init(point, offers, destinations, isDataLoaded);

    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointList() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    const points = this._getPoints();
    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    this._noPointComponent = new NoPointView();
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointList();
  }

  _clearTrip(resetSortType = false) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
    this._pointNewPresenter.destroy();

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._noPointComponent);
    remove(this._pointListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        const justDataUpdating = updateType === UpdateType.PATCH;
        this._pointPresenter[update.id].setViewState(State.SAVING, justDataUpdating);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(State.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(
            data,
            Object.assign({}, this._offersModel.getOffers()),
            Object.assign({}, this._destinationsModel.getDestinations())
        );
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
      case UpdateType.OFFERS_INIT:
        this._isOffersLoad = true;
        if (this._isDestinationLoad) {
          this._clearTrip();
          this._renderTrip();
        }
        break;
      case UpdateType.DESTINATIONS_INIT:
        this._isDestinationLoad = true;
        if (this._isOffersLoad) {
          this._clearTrip();
          this._renderTrip();
        }
        break;
    }
    if (this._isOffersLoad && this._isDestinationLoad) {
      this._callback.enableAddPointButton();
      Object
        .values(this._pointPresenter)
        .forEach((presenter) => presenter.enableEdit());
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
