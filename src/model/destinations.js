import Observer from "./observer";

export default class Destinations extends Observer {
  constructor() {
    super();
  }

  getDestinations() {
    return this._destinations;
  }

  setDestination(updateType, destinations) {
    this._destinations = this._adaptDestinations(destinations);
    this._notify(updateType);
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
