import {UpdateType, FilterType} from "../const";
import {filter} from "../utils/filter";
import FilterView from "../view/filter";
import {RenderPosition, render, replace, remove} from "../utils/render";

export default class Filter {
  constructor(filterHeaderElement, pointsModel, filterModel) {
    this._filterHeaderElement = filterHeaderElement;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._currentFilter = this._filterModel.getFilter();
    this._filters = this._getFilters();

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(this._filters, this._currentFilterType);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterHeaderElement, this._filterComponent, RenderPosition.AFTER);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return Object.keys(filter).reduce((acc, key) => {
      return Object.assign({}, acc, {[key]: filter[key](points)});
    }, {});
  }

  _handleModelEvent() {
    this._currentFilterType = this._filterModel.getFilter();
    this._filters = this._getFilters();

    if (this._currentFilterType !== FilterType.DEFAULT
      && this._filters[this._currentFilterType].length === 0) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
      return;
    }

    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}

