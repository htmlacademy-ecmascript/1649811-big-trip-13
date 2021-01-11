const coverElement = document.createElement(`div`);
coverElement.classList.add(`cover`);

const messageElement = document.createElement(`div`);
messageElement.classList.add(`error-message`);

export const modalWindow = (messageHtml) => {
  messageHtml += `<button class="ok-button">OK</button>`;
  messageElement.innerHTML = messageHtml;

  document.body.append(coverElement);
  document.body.append(messageElement);

  const {width} = messageElement.getBoundingClientRect();
  messageElement.style.top = `20%`;
  messageElement.style.left = `${window.innerWidth / 2 - width / 2}px`;

  const destroy = () => {
    document.removeEventListener(`keydown`, escKeyDownHandler, {capture: true});
    messageElement.removeEventListener(`click`, messageClickHandler);

    coverElement.remove();
    messageElement.remove();
  };

  const escKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      evt.stopPropagation();

      destroy();
    }
  };

  const messageClickHandler = () => {
    destroy();
  };

  document.addEventListener(`keydown`, escKeyDownHandler, {capture: true});
  messageElement.addEventListener(`click`, messageClickHandler);
};
