function startGame() {
  window.location.href = "../ingame/game.html?score=0";
}

function resetGame() {
  localStorage.setItem("bestScore", "0");
  window.location.href = "menu.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const currentScore = urlParams.get("score");

  const scoreDisplay = document.getElementById("scoreDisplay");
  if (currentScore !== null) {
    scoreDisplay.textContent = `Your Last Score is: ${currentScore}`;
  }
});
const bestScore = localStorage.getItem("bestScore");

const bestScoreDisplay = document.querySelector(".best-score");

bestScoreDisplay.textContent = `Best Score: ${bestScore || 0}`;

function toggleAudio() {
  var audio = document.getElementById("backgroundMusic");
  var playButton = document.getElementById("customPlayButton");

  if (audio.paused) {
    audio.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.pause();
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  }
}
function setVolume() {
  var audio = document.getElementById("backgroundMusic");
  var volumeSlider = document.getElementById("volumeSlider");
  audio.volume = volumeSlider.value;
}
let currentTime = 0;
let totalDuration = 0;

function updateMusicDuration() {
  const audio = document.getElementById("backgroundMusic");
  const durationElement = document.querySelector(".music-duration");

  audio.addEventListener("timeupdate", function () {
    currentTime = audio.currentTime;
    totalDuration = audio.duration;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = Math.floor(totalDuration % 60);

    const formattedCurrentTime = `${currentMinutes}:${currentSeconds < 10 ? "0" : ""}${currentSeconds}`;
    const formattedTotalDuration = `${totalMinutes}:${totalSeconds < 10 ? "0" : ""}${totalSeconds}`;

    durationElement.textContent = `Duration: ${formattedCurrentTime} / ${formattedTotalDuration}`;
  });
}

function changeMusic(trackUrl) {
  const audio = document.getElementById("backgroundMusic");
  const musicSource = document.getElementById("musicSource");

  musicSource.src = trackUrl;
  audio.load();
  audio.play();

  updateMusicDuration();
}
