let isPlaying = false;

function playMusic(trackName) {
  document.getElementById('track-name').innerText = `Track: ${trackName}`;
  document.getElementById('artist-name').innerText = `Artist: Unknown`;
  togglePlayPause();
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  const button = document.querySelector('#now-playing button');
  button.innerText = isPlaying ? 'Pause' : 'Play';
  // Simulate music play/pause (this should be linked to actual audio functionality)
  console.log(isPlaying ? 'Music Playing...' : 'Music Paused');
}
