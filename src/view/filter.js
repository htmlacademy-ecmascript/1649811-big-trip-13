import {FilterType} from "../const";
import Smart from "./smart";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, points} = filter;
  return `
  <div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}" data-filter-type="${name}">${name} ${points.length}</label>
  </div>
  `;
};

const createFiltersTemplate = (data) => {
  const {availableFilters, currentFilter} = data;
  const filterItems = availableFilters
    .map((filter) => createFilterItemTemplate(filter, filter.name === currentFilter))
    .join(``);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class Filter extends Smart {
  constructor(filters, currentFilter = null) {
    super();
    this._data = this._parseFiltersToData(filters, currentFilter);

    this._handleFilterChange = this._handleFilterChange.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._data);
  }

  _parseFiltersToData(availableFilters, filter) {
    if (filter === null) {
      filter = FilterType.DEFAULT;
    }
    return Object.assign({}, {currentFilter: filter, availableFilters});
  }

  _handleFilterChange(evt) {
    const target = evt.target.closest(`label`);
    if (target === null) {
      return;
    }

    const filterType = target.dataset.filterType;
    this.updateData({currentFilter: filterType});
    this._callback.filterTypeChange(target.dataset.filterType);
  }

  setChangeFilterHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement()
      .addEventListener(`click`, this._handleFilterChange);
  }

  restoreHandlers() {
    this.getElement()
      .addEventListener(`click`, this._handleFilterChange);
  }
}
