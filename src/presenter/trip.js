import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "./point";
import PointNewPresenter from "./point-new";
import {FilterType, SortType, UpdateType, UserAction} from "../const";
import {RenderPosition, render, remove} from "../utils/render";
import {sortByDate, sortByPrice, sortByTime} from "../utils/point";
import {filter} from "../utils/filter";

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._pointPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._noPointComponent = null;
    this._pointListComponent = null;
    this._pointNewPresenter = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(offers) {
    this._offers = Object.assign({}, offers);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(
        this._tripContainer, this._handleViewAction, this._offers
    );

    this._renderTrip();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data, this._offers);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
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
    this._clearPointList();
    this._renderPointList();
  }

  destroy() {
    this._clearTrip();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  show(resetSort = false) {
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
    this._pointNewPresenter.init(callback);
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

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._offers);

    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointList() {
    this._pointListComponent = new PointListView();
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
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointList();
  }

  _clearPointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }

  _clearTrip(resetSortType = false) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
    this._pointNewPresenter.destroy();

    remove(this._sortComponent);
    remove(this._noPointComponent);
    remove(this._pointListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
