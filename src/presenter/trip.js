import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "../presenter/point";
import {RenderPosition, render} from "../utils/render";
import {updatePoint} from "../utils/common";
import {SortType} from "../constants";
import {sortByPrice, sortByTime} from "../utils/point";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._noPointComponent = new NoPointView();
    this._pointListComponent = new PointListView();
    this._sortComponent = new SortView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points, offers) {
    this._points = points.slice();
    this._offers = offers;
    this._sourcedPoints = points.slice();

    this._renderTrip();
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPointList();
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updatePoint(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._offers);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point, this._offers);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointList() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    this._renderPointList();
  }
}

