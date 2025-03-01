let player = null;
let currentSong = null;
let pomodoroState = {
    running: false,
    timeLeft: 1500,
    preset: 'classic',
    isWorkSession: true,
    pomodoroCount: 0,
    intervalsCompleted: 0,
    alertVolume: 0.5,
    customWork: 25,
    customShort: 5,
    customLong: 15
};
let timerId = null;
const audio = new Audio('sounds/alert.mp3');

const pages = {
    home: 'home-content.html',
    library: 'library-content.html',
    pomodoro: 'pomodoro-content.html',
    settings: 'settings-content.html'
};

const YT_PLAYER_ID = 'youtube-player';

function runTimer() {
    if (pomodoroState.running) {
        pomodoroState.timeLeft--;
        
        if (pomodoroState.timeLeft <= 0) {
            handleTimerCompletion();
        }
        
        updatePomodoroDisplay();
    }
}

function handleTimerCompletion() {
    playAlert();
    startNextSession();
    pomodoroState.running = true;
}

setInterval(runTimer, 1000);

document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeAPI();
    loadPage('home');
    setupNavigation();
    setupPlayerControls();
    audio.volume = pomodoroState.alertVolume;
});

// Dark/Light Mode
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
  })
  
  document.getElementById('reset-to-system').addEventListener('click', async () => {
    await window.darkMode.system()
    document.getElementById('theme-source').innerHTML = 'System'
  })

async function loadPage(page) {
    const response = await fetch(pages[page]);
    const content = await response.text();
    document.getElementById('content-container').innerHTML = content;
    setupPageSpecificLogic(page);
    if (page === 'pomodoro') setupPomodoroUI();
}

function setupNavigation() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(e.target.dataset.page);
        });
    });
}

function setupPlayerControls() {
    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
        if (!player) return;
        
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
        if (player) player.setVolume(e.target.value * 100);
    });
}

function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function setupPageSpecificLogic(page) {
    if (page === 'library') setupLibrary();
}

function setupLibrary() {
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.dataset.videoId;
            const title = item.querySelector('span').textContent;
            const art = item.querySelector('img').src;

            if (currentSong !== videoId) {
                currentSong = videoId;
                
                // Update player footer
                document.getElementById('now-playing-art').src = art;
                document.getElementById('now-playing-title').textContent = title;
                document.getElementById('player-footer').style.display = 'flex';

                // Initialize or reload player
                if (player) {
                    player.destroy();
                    document.getElementById(YT_PLAYER_ID).remove();
                }

                createYouTubePlayer(videoId);
            }
        });
    });
}

// Add this new function
function createYouTubePlayer(videoId) {
    const playerContainer = document.createElement('div');
    playerContainer.id = YT_PLAYER_ID;
    document.body.appendChild(playerContainer);

    player = new YT.Player(YT_PLAYER_ID, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': (event) => {
                event.target.setVolume(100);
                document.getElementById('playPauseBtn').textContent = 'Pause';
            },
            'onStateChange': (event) => {
                const btn = document.getElementById('playPauseBtn');
                if (event.data === YT.PlayerState.PLAYING) {
                    btn.textContent = 'Pause';
                } else {
                    btn.textContent = 'Play';
                }
            }
        }
    });
}


function initializePlayer(videoId) {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'showinfo': 0
        },
      events: {
        'onReady': (event) => {
          event.target.setVolume(100);
          document.getElementById('player-footer').style.display = 'flex';
        },
        'onStateChange': (event) => {
          const playPauseBtn = document.getElementById('playPauseBtn');
          if (event.data === YT.PlayerState.PLAYING) {
            playPauseBtn.textContent = 'Pause';
          } else {
            playPauseBtn.textContent = 'Play';
          }
        }
      }
    });
}

function setupPomodoroUI() {
    const presets = {
        classic: { work: 25, short: 5, long: 15, intervals: 4 },
        extended: { work: 50, short: 10, long: 15, intervals: 4 },
        mini: { work: 15, short: 3, long: 10, intervals: 4 },
        long: { work: 40, short: 10, long: 15, intervals: 4 },
        focus: { work: 60, short: 5, long: 30, intervals: 3 },
        ultra: { work: 90, short: 15, long: 30, intervals: 3 },
        custom: { 
            get work() { return pomodoroState.customWork }, 
            get short() { return pomodoroState.customShort }, 
            get long() { return pomodoroState.customLong }, 
            intervals: 4 
        }
    };

    const timerDisplay = document.getElementById('time');
    const startBtn = document.getElementById('startTimer');
    const resetBtn = document.getElementById('resetTimer');
    const countDisplay = document.getElementById('pomodoroCount');
    const alertVolume = document.getElementById('alertVolume');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const customWork = document.getElementById('customWork');
    const customShort = document.getElementById('customShort');
    const customLong = document.getElementById('customLong');
    const settingsButton = document.getElementById('settingsButton');
    const settingsContent = document.getElementById('settingsContent');

    customWork.value = pomodoroState.customWork;
    customShort.value = pomodoroState.customShort;
    customLong.value = pomodoroState.customLong;
    alertVolume.value = pomodoroState.alertVolume;
    updatePomodoroDisplay();

    settingsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsContent.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!settingsContent.contains(e.target) && e.target !== settingsButton) {
            settingsContent.classList.remove('show');
        }
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            pomodoroState.preset = preset;
            document.querySelector('.preset-btn.active').classList.remove('active');
            btn.classList.add('active');
            loadPreset()
        });
    });

    // Real-time custom input handling
    customWork.addEventListener('input', (e) => {
        const value = Math.abs(parseInt(e.target.value)) || 1;
        pomodoroState.customWork = value;
        if(pomodoroState.preset === 'custom') loadPreset();
    });
    
    customShort.addEventListener('input', (e) => {
        const value = Math.abs(parseInt(e.target.value)) || 1;
        pomodoroState.customShort = value;
        if(pomodoroState.preset === 'custom') loadPreset();
    });
    
    customLong.addEventListener('input', (e) => {
        const value = Math.abs(parseInt(e.target.value)) || 1;
        pomodoroState.customLong = value;
        if(pomodoroState.preset === 'custom') loadPreset();
    });

    alertVolume.addEventListener('input', (e) => {
        pomodoroState.alertVolume = e.target.value;
        audio.volume = e.target.value;
    });

    startBtn.addEventListener('click', () => {
        pomodoroState.running = !pomodoroState.running;
        startBtn.textContent = pomodoroState.running ? 'Pause' : 'Start';
    });

    resetBtn.addEventListener('click', () => {
        pomodoroState.running = false;
        pomodoroState.pomodoroCount = 0;
        pomodoroState.intervalsCompleted = 0;
        pomodoroState.isWorkSession = true;
        loadPreset();
        startBtn.textContent = 'Start';
    });

    function loadPreset() {
        const preset = presets[pomodoroState.preset];
        
        // Always use fresh custom values when selecting custom preset
        if(pomodoroState.preset === 'custom') {
            preset.work = pomodoroState.customWork;
            preset.short = pomodoroState.customShort;
            preset.long = pomodoroState.customLong;
        }
        
        pomodoroState.timeLeft = preset.work * 60;
        updatePomodoroDisplay();
    }
}

function updatePomodoroDisplay() {
    if(document.getElementById('time')) {
        const minutes = Math.floor(pomodoroState.timeLeft / 60);
        const seconds = pomodoroState.timeLeft % 60;
        document.getElementById('time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('pomodoroCount').textContent = 
            `Completed: ${pomodoroState.pomodoroCount}`;
    }
}

function startNextSession() {
    const presets = {
        classic: { work: 25, short: 5, long: 15, intervals: 4 },
        extended: { work: 50, short: 10, long: 15, intervals: 4 },
        mini: { work: 15, short: 3, long: 10, intervals: 4 },
        long: { work: 40, short: 10, long: 15, intervals: 4 },
        focus: { work: 60, short: 5, long: 30, intervals: 3 },
        ultra: { work: 90, short: 15, long: 30, intervals: 3 },
        custom: { 
            work: pomodoroState.customWork, 
            short: pomodoroState.customShort, 
            long: pomodoroState.customLong, 
            intervals: 4 
        }
    };
    
    const preset = presets[pomodoroState.preset];

    if (pomodoroState.isWorkSession) {
        pomodoroState.pomodoroCount++;
        pomodoroState.intervalsCompleted++;
        pomodoroState.timeLeft = (pomodoroState.intervalsCompleted % preset.intervals === 0) 
            ? preset.long * 60 
            : preset.short * 60;
        pomodoroState.isWorkSession = false;
    } else {
        pomodoroState.timeLeft = preset.work * 60;
        pomodoroState.isWorkSession = true;
    }
}

function playAlert() {
    audio.currentTime = 0;
    audio.play().catch(console.error);
}

window.onYouTubeIframeAPIReady = () => {};