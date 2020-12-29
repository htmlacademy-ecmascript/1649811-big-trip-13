const coverDiv = document.createElement(`div`);
coverDiv.className = `cover`;

const messageDiv = document.createElement(`div`);
messageDiv.className = `error-message`;

export const modal = (messageHtml, escKeyDownHandler) => {
  messageHtml += `<button class="ok-button">OK</button>`;
  messageDiv.innerHTML = messageHtml;

  document.body.append(coverDiv);
  document.body.append(messageDiv);

  const {width} = messageDiv.getBoundingClientRect();
  messageDiv.style.top = `20%`;
  messageDiv.style.left = `${window.innerWidth / 2 - width / 2}px`;

  const removeErrorMessage = () => {
    messageDiv.removeEventListener(`click`, clickHandler);
    document.removeEventListener(`click`, newEscKeyDownHandler);
    document.addEventListener(`keydown`, escKeyDownHandler);
    coverDiv.remove();
    messageDiv.remove();
  };

  const newEscKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      removeErrorMessage();
    }
  };

  const clickHandler = () => {
    removeErrorMessage();
  };

  document.removeEventListener(`keydown`, escKeyDownHandler);
  document.addEventListener(`keydown`, newEscKeyDownHandler);
  messageDiv.addEventListener(`click`, clickHandler);
};
