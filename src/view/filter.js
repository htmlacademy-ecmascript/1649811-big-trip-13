const createFilterItemTemplate = (filter, isChecked) => {
  const {name} = filter;
  return `
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-everything">${name}</label>
  </div>
  `;
};

export const createFiltersTemplate = (filters) => {
  const filterItems = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return `
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
<!--      <div class="trip-filters__filter">-->
<!--        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>-->
<!--        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>-->
<!--      </div>-->

<!--      <div class="trip-filters__filter">-->
<!--        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">-->
<!--        <label class="trip-filters__filter-label" for="filter-future">Future</label>-->
<!--      </div>-->

<!--      <div class="trip-filters__filter">-->
<!--        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">-->
<!--        <label class="trip-filters__filter-label" for="filter-past">Past</label>-->
<!--      </div>-->
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

/*
const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

export const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return `<section class="main__filter filter container">
    ${filterItemsTemplate}
  </section>`;
};
 */
