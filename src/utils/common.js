export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

export const updatePoint = (points, updatedPoint) => {
  const index = points.findIndex((point) => point.id === updatedPoint.id);

  if (index === -1) {
    return points;
  }

  points[index] = updatedPoint;

  return points;
};

export const parseDate = (dateString) => {
  const regex = /(\d{1,2}\/){2}\d{2} \d{2}:\d{2}/;
  if (!regex.test(dateString)) {
    throw new Error(`Invalid date format.`);
  }
  const [date, time] = dateString.split(` `);
  const [day, month, year] = date.split(`/`);
  const [hour, minute] = time.split(`:`);

  return new Date(+`20${year}`, +month - 1, +day, +hour, +minute);
};
