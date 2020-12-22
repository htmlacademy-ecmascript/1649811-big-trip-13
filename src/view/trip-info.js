import AbstractView from "./abstract";

const createTripInfoTemplate = (trip) => {
  const {title, date, price} = trip;
  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${date}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>
`;
};

export default class TripInfo extends AbstractView {
  constructor(trip) {
    super();
    this._trip = trip;
  }

  getTemplate() {
    return createTripInfoTemplate(this._trip);
  }
}
