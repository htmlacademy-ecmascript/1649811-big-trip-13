import Observer from "./observer";
import {capitalizeFirstLetter} from "../utils/common";

export default class Offers extends Observer {
  constructor() {
    super();
  }

  getOffers() {
    return this._offers;
  }

  setOffers(updateType, offers) {
    this._offers = this._adaptOffers(offers);
    this._notify((updateType));
  }

  _adaptOffers(offers) {
    const adaptedOffers = {};

    for (const offer of offers) {
      const name = capitalizeFirstLetter(offer.type);

      adaptedOffers[name] = offer.offers.map((item) => ({
        title: item.title,
        price: item.price,
      }));
    }

    return adaptedOffers;
  }
}
