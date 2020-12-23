import Observer from "./observer";

export default class Destinations extends Observer {
  constructor() {
    super();
  }

  setDestination(updateType, destinations) {
    this._destinations = this._adaptDestinations(destinations);
    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }

  _adaptDestinations(destinations) {
    const adaptedDestinations = {};

    for (let i = 0; i < destinations.length; i++) {
      const info = {
        description: destinations[i].description,
        images: destinations[i].pictures,
      };

      adaptedDestinations[destinations[i].name] = {info};
    }

    return adaptedDestinations;
  }
}