import Observer from "./observer";

export default class Offers extends Observer {
  constructor() {
    super();
  }

  setOffers(updateType, offers) {
    this._offers = this._adaptOffers(offers);
    this._notify((updateType));
  }

  getOffers() {
    return this._offers;
  }

  _adaptOffers(offers) {
    const adaptedOffers = {};

    for (let i = 0; i < offers.length; i++) {
      const name = offers[i].type[0].toUpperCase() + offers[i].type.slice(1);
      adaptedOffers[name] = offers[i].offers.map((item) => {
        return {
          title: item.title,
          price: item.price,
        };
      });
    }

    return adaptedOffers;
  };
}
