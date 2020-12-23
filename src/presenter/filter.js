import {UpdateType} from "../const";
import {filter} from "../utils/filter";
import FilterView from "../view/filter";
import {RenderPosition, render, replace, remove} from "../utils/render";

export default class Filter {
  constructor(filterHeaderElement, pointsModel, filterModel) {
    this._filterHeaderElement = filterHeaderElement;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterHeaderElement, this._filterComponent, RenderPosition.AFTER);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return Object.entries(filter)
      .map(([filterName, filterPoints]) => {
        return {
          name: filterName,
          points: filterPoints(points),
        };
      });
  }
}

