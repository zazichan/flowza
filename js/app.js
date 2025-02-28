// This will be loaded on every page
document.addEventListener('DOMContentLoaded', function() {
    // Ensuring that the navigation is working (active states, etc.)
    initNavigation();
  
    // Example of global settings: music preferences or user session
    loadUserSettings();
  });
  
  // Page navigation logic (could be reused across all pages)
  function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop().split('.').shift();
    const navLinks = document.querySelectorAll('nav ul li a');
  
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.href.includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }
  
  // Function to load user settings (e.g., music preferences or saved session)
  function loadUserSettings() {
    // Example: Get the last played music or user theme preferences from localStorage
    const lastPlayedTrack = localStorage.getItem('lastPlayedTrack');
    if (lastPlayedTrack) {
      console.log(`Last played track: ${lastPlayedTrack}`);
    }
  
    const userTheme = localStorage.getItem('theme');
    if (userTheme) {
      document.body.classList.add(userTheme); // Apply saved theme to body class
    }
  }
  
  // Example: Function to save the current track the user is playing (on 'Now Playing' page)
  function saveCurrentTrack(trackName) {
    localStorage.setItem('lastPlayedTrack', trackName);
  }
  