import Observer from "./observer";

export default class Points extends Observer {
  constructor() {
    super();

    this._points = [];
  }

  setPoints(UpdateType, points) {
    this._points = points.slice();

    this._notify(UpdateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {

    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const clone = Object.assign({}, point);

    return {
      id: clone.id,
      pointType: clone.type[0].toUpperCase() + clone.type.slice(1),
      destination: clone.destination.name,
      offers: clone.offers,
      price: clone.base_price,
      date: {
        start: clone.date_from,
        end: clone.date_to,
      },
      isFavorite: clone.is_favorite,
      info: {
        description: clone.destination.description,
        images: clone.destination.pictures,
      }
    };
  }

  static adaptToServer(point) {
    const clone = Object.assign({}, point);

    return {
      "id": clone.id,
      "type": clone.pointType.toLowerCase(),
      "date_from": clone.date.start,
      "date_to": clone.date.end,
      "destination": {
        "name": clone.destination,
        "description": clone.info.description,
        "pictures": clone.info.images
      },
      "base_price": clone.price,
      "is_favorite": clone.isFavorite,
      "offers": clone.offers.map((item) => {
        delete item.id;
        return item;
      }),
    };
  }
}
