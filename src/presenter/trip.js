import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "./point";
import TripInfoPresenter from "./trip-info";
import {FilterType, SortType} from "../const";
import {RenderPosition, render} from "../utils/render";
import {createFilters, sortByDate, sortByPrice, sortByTime} from "../utils/point";

export default class Trip {
  constructor(tripInfoContainer, tripContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._tripInfoPresenter = null;

    this._currentSortType = SortType.DEFAULT;
    this._currentFilterType = FilterType.DEFAULT;

    this._noPointComponent = new NoPointView();
    this._pointListComponent = new PointListView();
    this._sortComponent = new SortView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points, offers) {
    this._points = points.slice();
    this._sourcedPoints = points;
    this._offers = offers;
    this._filters = createFilters(points);

    this._renderTripInfo();
    this._renderTrip();
  }


  _handlePointChange(updatedPoint) {
    this._updatePoint(updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._offers);

    this._filterPoints(this._currentFilterType);
    this._tripInfoPresenter.update(this._sourcedPoints, this._filters, this._currentFilterType);

    this._sortPoints(this._currentSortType);
    this._clearPointList();
    this._renderPointList();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handleFilterChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._filterPoints(filterType);
    this._sortPoints(this._currentSortType);
    this._clearPointList();
    this._renderPointList();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPointList();
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

  _renderTripInfo() {
    this._tripInfoPresenter = new TripInfoPresenter(this._tripInfoContainer, this._handleFilterChange);
    this._tripInfoPresenter.init(this._points, this._filters, this._currentFilterType);
  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    this._renderPointList();
  }

  _filterPoints(filterType) {
    this._currentFilterType = filterType;
    const currentFilter = this._filters.find((filter) => filter.name === filterType);
    this._points = currentFilter.points;
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
        this._points.sort(sortByDate);
    }

    this._currentSortType = sortType;
  }

  _clearPointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());

    this._pointPresenter = {};
  }

  _updatePoint(updatedPoint) {
    let index = this._points.findIndex((point) => point.id === updatedPoint.id);
    if (index !== -1) {
      this._points[index] = updatedPoint;
    }

    index = this._sourcedPoints.findIndex((point) => point.id === updatedPoint.id);
    if (index !== -1) {
      this._sourcedPoints[index] = updatedPoint;
      this._filters = createFilters(this._sourcedPoints);
    }
  }
}
