document.addEventListener("DOMContentLoaded", function () {
  const gameArea = document.getElementById("gameArea");
  const clickTarget = document.getElementById("clickTarget");
  const scoreDisplay = document.getElementById("score");
  const timeLeftDisplay = document.getElementById("timeLeft");
  const messageDisplay = document.getElementById("mensaje");
  const setGameTimeout = document.getElementById("setGameTimeout");
  const timeoutInput = document.getElementById("timeout");
  const startGame = document.getElementById("startGame");
  //
  const form = document.querySelector("form");
  const selectNivel = document.getElementById("nivel");
  //Niveles.
  const NIVEL_1 = "NIVEL_1";
  const NIVEL_2 = "NIVEL_2";
  const NIVEL_RANDY = "NIVEL_RANDY";

  let refreshIntervalId = null;
  let score = 0;
  let timeLeft = 30;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  setGameTimeout.addEventListener("click", function () {
    let timeout = timeoutInput.value;
    if (timeout) {
      timeLeft = parseInt(timeout);
      timeLeftDisplay.textContent = timeout;
    }
  });

  startGame.addEventListener("click", function () {
    timeoutInput.disabled = true;
    setGameTimeout.disabled = true;
    startGame.disabled = true;

    const NIVEL = selectNivel.value;

    switch (NIVEL) {
      case NIVEL_1:
        clickTarget.style.width = "50px";
        clickTarget.style.height = "50px";
        break;
      case NIVEL_2:
        clickTarget.style.width = "25px";
        clickTarget.style.height = "25px";
        break;

      case NIVEL_RANDY:
        clickTarget.addEventListener("mouseover", moveTarget);
        break;

      default:
        break;
    }

    refreshIntervalId = setInterval(updateTimer, 1000);
  });

  clickTarget.addEventListener("click", () => {
    if (refreshIntervalId != null) {
      score++;
      scoreDisplay.textContent = score;
      moveTarget();
    }
  });

  function moveTarget() {
    const maxX = gameArea.clientWidth - clickTarget.clientWidth;
    const maxY = gameArea.clientHeight - clickTarget.clientHeight;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    clickTarget.style.left = randomX + "px";
    clickTarget.style.top = randomY + "px";
  }

  function updateTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
    } else {
      if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
      }
      timeoutInput.disabled = false;
      setGameTimeout.disabled = false;
      startGame.disabled = false;
      let mensaje = `Tiempo agotado! Tu puntuación final es: ${score}`;
      messageDisplay.textContent = mensaje;
      clickTarget.style.width = "50px";
      clickTarget.style.height = "50px";
      clickTarget.removeEventListener("mouseover", moveTarget);
      alert(mensaje);
    }
  }
});
