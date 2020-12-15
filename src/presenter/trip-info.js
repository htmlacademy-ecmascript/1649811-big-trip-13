import TripInfoView from "../view/trip-info";
import {render, RenderPosition} from "../utils/render";
import {createTripInfo} from "../utils/trip-info";

export default class TripInfo {
  constructor(tripInfoContainer, pointsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;
  }

  init() {
    this._tripInfo = createTripInfo(this._pointsModel.getPoints());

    this._tripInfoComponent = new TripInfoView(this._tripInfo);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

}
