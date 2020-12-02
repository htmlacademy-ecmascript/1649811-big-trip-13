import {createElement} from "../utils";

export default class Abstract {
  constructor() {
    if (new.target === this.constructor.name) {
      throw new Error(`You cannot create an object of an abstract class`);
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method 'getTemplate' not implemented`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
