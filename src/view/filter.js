import Abstract from "./abstract";

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, points} = filter;
  return `
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-everything">${name} ${points.length}</label>
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

export default class Filter extends Abstract {
  constructor(filters) {
    super();
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
