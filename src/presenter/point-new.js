import PointEditView from "../view/point-edit";
import {EMPTY_POINT, UpdateType, UserAction} from "../const";
import {remove, render, RenderPosition} from "../utils/render";
import {generateId} from "../mock/point";

export default class PointNew {
  constructor(pointListContainer, changeData, offers) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._offers = offers;

    this._pointEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;
    this._pointEditComponent = new PointEditView(EMPTY_POINT, this._offers);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setFormCloseHandler(this._handleFormClose);
    this._pointEditComponent.setFormDeleteHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        Object.assign({id: generateId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormClose() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  destroy() {
    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
