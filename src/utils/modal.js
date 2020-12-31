const coverElement = document.createElement(`div`);
coverElement.classList.add(`cover`);

const messageElement = document.createElement(`div`);
messageElement.classList.add(`error-message`);

export const modal = (messageHtml, escKeyDownHandler) => {
  messageHtml += `<button class="ok-button">OK</button>`;
  messageElement.innerHTML = messageHtml;

  document.body.append(coverElement);
  document.body.append(messageElement);

  const {width} = messageElement.getBoundingClientRect();
  messageElement.style.top = `20%`;
  messageElement.style.left = `${window.innerWidth / 2 - width / 2}px`;

  const destroy = () => {
    messageElement.removeEventListener(`click`, messageClickHandler);
    document.removeEventListener(`click`, newEscKeyDownHandler);
    document.addEventListener(`keydown`, escKeyDownHandler);
    coverElement.remove();
    messageElement.remove();
  };

  const newEscKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      destroy();
    }
  };

  const messageClickHandler = () => {
    destroy();
  };

  document.removeEventListener(`keydown`, escKeyDownHandler);
  document.addEventListener(`keydown`, newEscKeyDownHandler);
  messageElement.addEventListener(`click`, messageClickHandler);
};
