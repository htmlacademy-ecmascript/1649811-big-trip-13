import AbstractView from "./abstract";

const createFilterItemTemplate = (filterType, points, isChecked) => {
  const disabled = points.length === 0 ? `disabled` : ``;
  return `
  <div class="trip-filters__filter">
    <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${isChecked ? `checked` : ``} ${disabled}>
    <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
  </div>
  `;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filterItems = Object.keys(filters)
    .map((filterType) => createFilterItemTemplate(filterType, filters[filterType], filterType === currentFilterType))
    .join(``);

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    const target = evt.target.closest(`input`);
    if (!target) {
      return;
    }
    this._callback.filterTypeChange(evt.target.value);
  }
}
