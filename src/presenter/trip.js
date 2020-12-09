import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "./point";
import {RenderPosition, render} from "../utils/render";
import TripInfoPresenter from "./trip-info";
import {FilterType} from "../constants";
import {createFilters} from "../utils/point";

export default class Trip {
  constructor(tripInfoContainer, tripContainer) {
    this._tripInfoContainer = tripInfoContainer;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._currentFilter = FilterType.DEFAULT;

    this._noPointComponent = new NoPointView();
    this._pointListComponent = new PointListView();
    this._sortComponent = new SortView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
  }

  init(points, offers, tripInfo) {
    this._points = points.slice();
    this._sourcedPoints = points;
    this._offers = offers;
    this._tripInfo = tripInfo;
    this._filters = createFilters(points);

    this._tripInfoPresenter = new TripInfoPresenter(this._tripInfoContainer, this._handleFilterChange);

    this._renderTripInfo();
    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._updatePoint(updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._offers);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilterChange(filterName) {
    const currentFilter = this._filters.find((filter) => filter.name === filterName);
    this._points = currentFilter.points;

    this._clearPointList();
    this._renderPointList();
  }

  _clearPointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
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
  }

  _renderTripInfo() {
    this._tripInfoPresenter.init(this._tripInfo, this._filters, this._currentFilter);
  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    this._renderPointList();
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
