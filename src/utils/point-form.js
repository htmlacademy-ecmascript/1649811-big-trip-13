export const showErrorMessage = (messageHtml, escKeyDownHandler) => {
  let coverDiv = document.createElement(`div`);
  coverDiv.className = `cover`;

  let messageDiv = document.createElement(`div`);
  messageDiv.className = `error-message`;
  messageHtml += `<button class="ok-button">OK</button>`;
  messageDiv.innerHTML = messageHtml;

  document.body.append(messageDiv);
  document.body.append(coverDiv);

  const sizingBox = messageDiv.getBoundingClientRect();
  messageDiv.style.top = `20%`;
  messageDiv.style.left = `${window.innerWidth / 2 - sizingBox.width / 2}px`;

  const removeErrorMessage = () => {
    coverDiv.remove();
    messageDiv.remove();
    coverDiv = null;
    messageDiv = null;
    document.removeEventListener(`click`, clickHandler);
    document.removeEventListener(`click`, newEscKeyDownHandler);
    document.addEventListener(`keydown`, escKeyDownHandler);
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
  document.addEventListener(`click`, clickHandler);
};
