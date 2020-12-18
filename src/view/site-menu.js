import Abstract from "./abstract";
import {MenuItem} from "../const";

const createMenuTemplate = () => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn" href="#">${MenuItem.STATS}</a>
    </nav>
    `;
};

export default class SiteMenu extends Abstract {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  _menuClickHandler(evt) {
    const target = evt.target.closest(`a`);
    if (!target) {
      return;
    }

    evt.preventDefault();
    if (target.previousElementSibling) {
      target.previousElementSibling.classList.remove(`trip-tabs__btn--active`);
    } else {
      target.nextElementSibling.classList.remove(`trip-tabs__btn--active`);
    }
    target.classList.add(`trip-tabs__btn--active`);


    this._callback.menuClick(target.textContent);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  getTemplate() {
    return createMenuTemplate();
  }
}

/*
export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }
}
 */
