import {cities} from "./data";
import {generateDescription, generateImages} from "./point";

export const generateDestination = () => {
  let destinations = {};
  for (let city of cities) {
    const info = {
      description: generateDescription(),
      images: generateImages(),
    };

    destinations[city] = {info};
  }

  return destinations;
};
