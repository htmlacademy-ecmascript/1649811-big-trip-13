import {createElement} from "../utils";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name} = filter;
  return `
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-everything">${name}</label>
  </div>
  `;
};

const createFiltersTemplate = (filters) => {
  const filterItems = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class Filter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
};
