import PointModel from "./model/points";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHttpStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(Api.toJson)
      .then((points) => points.map(PointModel.adaptToClient));
  }

  addPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(PointModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJson)
      .then((newPoint) => PointModel.adaptToClient(newPoint));
  }

  updatePoint(point) {
    return this._load({
      url: `points1/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJson)
      .then((updatedPoint) => PointModel.adaptToClient(updatedPoint));
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJson);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJson);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHttpStatusRange.MIN ||
      response.status > SuccessHttpStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJson(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
