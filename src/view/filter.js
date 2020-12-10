import Abstract from "./abstract";
import {FilterType} from "../constants";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, points} = filter;
  return `
  <div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
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

export default class Filter extends Abstract {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilter = FilterType.DEFAULT;

    this._changeFilterHandler = this._changeFilterHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  _changeFilterHandler(evt) {
    const target = evt.target.closest(`label`);
    if (target === null) {
      return;
    }

    const inputId = target.getAttribute(`for`);
    const inputElements = this.getElement().querySelectorAll(`input`);
    for (let element of inputElements) {
      element.checked = element.id === inputId;
    }

    this._currentFilter = target.dataset.filterType;
    this._callback.filterTypeChange(target.dataset.filterType);
  }

  setChangeFilterHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement()
      .addEventListener(`click`, this._changeFilterHandler);
  }
}
