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

    for (const destination of destinations) {
      adaptedDestinations[destination.name] = {
        info: {
          description: destination.description,
          images: destination.pictures
        }
      };
    }

    return adaptedDestinations;
  }
}
