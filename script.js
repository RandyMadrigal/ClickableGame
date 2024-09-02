document.addEventListener("DOMContentLoaded", function () {
  const gameArea = document.getElementById("gameArea");
  const clickTarget = document.getElementById("clickTarget");
  const scoreDisplay = document.getElementById("score");
  const timeLeftDisplay = document.getElementById("timeLeft");
  const messageDisplay = document.getElementById("mensaje");
  const setGameTimeout = document.getElementById("setGameTimeout");
  const timeoutInput = document.getElementById("timeout");
  const startGame = document.getElementById("startGame");

  //Acceder al dom
  const form = document.querySelector("form");
  const selectNivel = document.getElementById("nivel");
  const tbody = document.getElementById("tableBody");
  const btnClear = document.getElementById("clearLocalStorage");

  //Niveles.
  const NIVEL_1 = "NIVEL_1";
  const NIVEL_2 = "NIVEL_2";
  const NIVEL_3 = "NIVEL_3";

  //sound
  const sound = new Audio("./assets/audio/click.wav");

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
    configStartGame(); // Configuracion al iniciar el juego.

    const NIVEL = selectNivel.value;
    //determinar el nivel de dificultad
    switch (NIVEL) {
      case NIVEL_1:
        clickTarget.style.width = "50px";
        clickTarget.style.height = "50px";
        break;
      case NIVEL_2:
        clickTarget.style.width = "25px";
        clickTarget.style.height = "25px";
        break;
      case NIVEL_3:
        clickTarget.addEventListener("mouseover", moveTarget);
        clickTarget.classList.add("image");
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
      sound.play();
      moveTarget();
    }
    sound.currentTime = "0";
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
    const localStorageKey = Math.random(); //key localStorage

    if (timeLeft > 0) {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
    } else {
      if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
      }

      let mensaje = `Tiempo agotado! Tu puntuación final es: ${score}`;
      messageDisplay.textContent = mensaje;

      configEndGame(); //Configuracion cuando el juego se termina.

      addLocalStorage(
        //almacenar data en el localStorage
        `${localStorageKey}`,
        `Puntuacion : ${score} / Dificultad : ${selectNivel.value} `
      );

      getLocalStorage(); //obtener data del localStorage

      score = 0;
      scoreDisplay.textContent = "0";
      alert(mensaje);
    }
  }

  function addLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  function getLocalStorage() {
    if (localStorage.length === 0) tbody.innerHTML = ` <p> No data </p> `;
    if (localStorage.length > 0) tbody.innerHTML = "";

    const keys = Object.keys(localStorage); // acceder a las claves de este objeto

    keys.map((key) => {
      const tr = document.createElement("tr");
      const value = localStorage.getItem(key);
      tr.innerHTML = `
      <th>${value}</th>   
      `;

      tbody.appendChild(tr);
    });
  }

  btnClear.addEventListener("click", () => {
    localStorage.clear();
    tbody.innerHTML = ` <p> No data </p> `;
  });

  function configStartGame() {
    timeoutInput.disabled = true;
    setGameTimeout.disabled = true;
    startGame.disabled = true;
    selectNivel.disabled = true;
  }

  function configEndGame() {
    timeoutInput.disabled = false;
    setGameTimeout.disabled = false;
    startGame.disabled = false;
    clickTarget.style.width = "50px";
    clickTarget.style.height = "50px";
    clickTarget.removeEventListener("mouseover", moveTarget);
    clickTarget.classList.remove("image");
    selectNivel.disabled = false;
  }

  getLocalStorage();
});
