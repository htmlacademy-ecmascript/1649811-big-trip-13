import Abstract from "./abstract";

export const createPointListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class PointList extends Abstract {
  getTemplate() {
    return createPointListTemplate();
  }
}
