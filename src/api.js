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
      .then(Api.toJson);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJson);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJson);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({"Content-Type": `application/json`})
    })
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
