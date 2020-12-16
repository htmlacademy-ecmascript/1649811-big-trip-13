import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "./point";
import {SortType, UpdateType, UserAction} from "../const";
import {RenderPosition, render, remove} from "../utils/render";
import {sortByDate, sortByPrice, sortByTime} from "../utils/point";

export default class Trip {
  constructor(tripContainer, pointsModel) {
    this._pointsModel = pointsModel;

    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._noPointComponent = null;
    this._pointListComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init(offers) {
    this._offers = offers;

    this._renderTrip();
  }

  _handleViewAction(actionType, updateType, update) {

    console.log(actionType, updateType, update);

    switch(actionType) {
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
    console.log(updateType, data);

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

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortByTime);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortByPrice);
      default:
        return this._pointsModel.getPoints().slice().sort(sortByDate);
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

    remove(this._sortComponent);
    remove(this._noPointComponent);
    remove(this._pointListComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
