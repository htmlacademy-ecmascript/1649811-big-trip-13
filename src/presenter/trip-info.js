import TripInfoView from "../view/trip-info";
import {render, RenderPosition} from "../utils/render";
import MenuView from "../view/menu";
import FilterView from "../view/filter";

export default class TripInfo {
  constructor(tripInfoContainer, changeFilterHandler) {
    this._tripInfoContainer = tripInfoContainer;
    this._changeFilterHadler = changeFilterHandler;

    this._tripInfoComponent = null;
    this._menuComponent = null;
    this._filterComponent = null;
  }

  init(tripInfo, filters, currentFilter) {
    this._tripInfo = tripInfo;

    this._tripInfoComponent = new TripInfoView(tripInfo);
    this._menuComponent = new MenuView();
    this._filterComponent = new FilterView(filters, currentFilter);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    this._renderMenu();
    this._renderFilter();
  }

  _renderMenu() {
    const menuHeaderElement = this._tripInfoContainer.querySelector(`h2.visually-hidden`);
    render(menuHeaderElement, this._menuComponent, RenderPosition.AFTER);

  }

  _renderFilter() {
    const filterHeaderElement = this._tripInfoContainer.querySelector(`h2.visually-hidden:last-child`);
    render(filterHeaderElement, this._filterComponent, RenderPosition.AFTER);
    this._filterComponent.setChangeHandler(this._changeFilterHadler);
  }

}
