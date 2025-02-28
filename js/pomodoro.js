let pomodoroTime = 25 * 60; // 25 minutes in seconds
let pomodoroProgress = 0;
let timerInterval;

function startPomodoro() {
  document.getElementById('start-timer').disabled = true;
  timerInterval = setInterval(updatePomodoroTimer, 1000);
}

function updatePomodoroTimer() {
  if (pomodoroTime > 0) {
    pomodoroTime--;
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    document.getElementById('timer-display').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    pomodoroProgress = ((25 * 60 - pomodoroTime) / (25 * 60)) * 100;
    document.querySelector('#pomodoro-progress div').style.width = `${pomodoroProgress}%`;
  } else {
    clearInterval(timerInterval);
    alert('Pomodoro session complete! Take a break.');
    document.getElementById('start-timer').disabled = false;
  }
}
