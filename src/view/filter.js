import {FilterType} from "../const";
import AbstractView from "./abstract";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, points} = filter;
  const disabled = points.length === 0 ? `disabled` : ``;
  return `
  <div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``} ${disabled}>
    <label class="trip-filters__filter-label" for="filter-${name}" data-filter-type="${name}">${name} ${points.length}</label>
  </div>
  `;
};

const createFiltersTemplate = (filters, currentFilter) => {
  const filterItems = filters
    .map((filter) => createFilterItemTemplate(filter, filter.name === currentFilter))
    .join(``);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType = null) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType ? currentFilterType : FilterType.DEFAULT;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    const target = evt.target.closest(`input`);
    if (!target) {
      return;
    }
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
