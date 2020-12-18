import {createElement} from "../utils/render";

export default class Abstract {
  constructor() {
    if (new.target === this.constructor.name) {
      throw new Error(`You cannot create an object of an Abstract class`);
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  removeElement() {
    this._element = null;
  }
}
