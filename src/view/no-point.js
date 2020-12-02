import Abstract from "./abstract";

const createNoPointTemplate = () => {
  return `
  <p class="trip-events__msg">Click New Event to create your first point</p>
  `;
};

export default class NoPoint extends Abstract {
  getTemplate() {
    return createNoPointTemplate();
  }
}
