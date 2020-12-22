import AbstractView from "./abstract";
import {MenuItem} from "../const";

const createMenuTemplate = () => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn" href="#">${MenuItem.STATS}</a>
    </nav>
    `;
};

export default class SiteMenu extends AbstractView {
  constructor(tripInfoElement) {
    super();

    this._addPointButton = tripInfoElement.querySelector(`.trip-main__event-add-btn`);
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this.enableAddPointButton = this.enableAddPointButton.bind(this);
  }

  _menuClickHandler(evt) {
    let target = evt.target.closest(`button`);
    if (target) {
      evt.preventDefault();
      this._addPointButton.disabled = true;
      this._setMenuItemTable();
      this._callback.menuClick(target.textContent);
      return;
    }

    target = evt.target.closest(`a`);
    if (!target) {
      return;
    }

    evt.preventDefault();
    this._setMenuItem(target);
    this._callback.menuClick(target.textContent);
  }

  enableAddPointButton() {
    this._addPointButton.disabled = false;
  }

  _setMenuItemTable() {
    const menuItemTable = this.getElement().querySelector(`a`);
    menuItemTable.classList.add(`trip-tabs__btn--active`);
    menuItemTable.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
  }

  _setMenuItem(element) {
    if (element.previousElementSibling) {
      element.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
    } else {
      element.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
    }
    element.classList.add(`trip-tabs__btn--active`);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
    this._addPointButton.addEventListener(`click`, this._menuClickHandler);
  }

  getTemplate() {
    return createMenuTemplate();
  }
}
