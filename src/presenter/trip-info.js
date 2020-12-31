import TripInfoView from "../view/trip-info";
import {render, remove} from "../utils/render";
import {createTripInfo} from "../utils/trip-info";
import {RenderPosition, UpdateType} from "../const";

export default class TripInfo {
  constructor(tripInfoContainer, pointsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._pointsModel = pointsModel;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._tripInfo = createTripInfo(this._pointsModel.getPoints());

    this._tripInfoComponent = new TripInfoView(this._tripInfo);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _handleModelEvent(updateType) {
    if (
      updateType === UpdateType.MINOR ||
      updateType === UpdateType.MAJOR ||
      updateType === UpdateType.INIT
    ) {
      remove(this._tripInfoComponent);
      this.init();
    }
  }
}
