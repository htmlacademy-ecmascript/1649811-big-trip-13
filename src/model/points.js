import Observer from "./observer";

export default class Points extends Observer {
  constructor() {
    super();

    this._points = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }
}
