import PointModel from "../model/points";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncNeeded = false;
  }

  get isSyncNeeded() {
    return this._isSyncNeeded;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = this._createStoreStructure(points.map(PointModel.adaptToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointModel.adaptToClient));
  }

  getOffers() {
    const key = `${this._store.storeKey}-offers`;

    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = Object.assign({}, offers);
          this._store.setItems(items, key);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems(key));

    return Promise.resolve(storeOffers);

  }

  getDestinations() {
    const key = `${this._store.storeKey}-destinations`;

    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = Object.assign({}, destinations);
          this._store.setItems(items, key);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems(key));
    return Promise.resolve(storeDestinations);
  }

  addPoint(point) {
    if (this._isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    try {
      const nextId = Math.max(
          ...Object.keys(this._store.getItems())
          .map((item) => +item)
      ) + 1;

      const newPoint = Object.assign({}, point, {id: `new-point-${nextId}`});
      this._store.setItem(nextId, PointModel.adaptToServer(newPoint));

      this._isSyncNeeded = true;

      return Promise.resolve(newPoint);
    } catch (err) {
      return Promise.reject(new Error(`Add point failed`));
    }
  }

  updatePoint(point) {
    if (this._isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    const id = point.id.includes(`new-point`)
      ? point.id.slice(point.id.lastIndexOf(`-`) + 1)
      : point.id;

    this._store.setItem(id, PointModel.adaptToServer(Object.assign({}, point)));

    this._isSyncNeeded = true;

    return Promise.resolve(point);
  }

  deletePoint(point) {
    if (this._isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    try {
      this._store.removeItem(point.id);

      this._isSyncNeeded = true;

      return Promise.resolve();
    } catch (err) {
      return Promise.reject(new Error(`Delete point failed`));
    }

  }

  sync() {
    if (this._isOnline()) {
      const storePoints = Object.values(this._store.getItems())
        .map((item) => {
          if (item.id.includes(`new-point`)) {
            delete item.id;
          }
          return item;
        });

      return this._api.sync(storePoints)
        .then((response) => {
          try {
            const createdPoints = response.created;
            const updatedPoints = this._getSyncedPoints(response.updated);

            const points = [...createdPoints, ...updatedPoints];

            const items = this._createStoreStructure(points);
            this._store.setItems(items);

            this._isSyncNeeded = false;

            return points.map(PointModel.adaptToClient);
          } catch (err) {
            return Promise.reject(new Error(`Sync data failed`));
          }
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _getSyncedPoints(items) {
    return items.filter(({success}) => success)
      .map(({payload}) => payload.point);
  }

  _createStoreStructure(items) {
    return items.reduce((acc, current) => {
      return Object.assign({}, acc, {[current.id]: current});
    }, {});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
