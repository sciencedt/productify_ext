function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }
  
  function displayTimeData() {
    chrome.storage.local.get(['timeData', 'focusSettings'], (result) => {
      const timeData = result.timeData || {};
      const focusSettings = result.focusSettings || {};
      const timeList = document.getElementById('timeList');
      timeList.innerHTML = '';
  
      const sortedSites = Object.entries(timeData)
        .sort(([, a], [, b]) => b - a);
  
      sortedSites.forEach(([site, seconds]) => {
        const div = document.createElement('div');
        div.className = 'site-entry';
        const isBlocked = focusSettings[site] && seconds >= focusSettings[site].limit * 60;
        div.innerHTML = `<span>${site}${isBlocked ? ' (Blocked)' : ''}</span><span>${formatTime(seconds)}</span>`;
        timeList.appendChild(div);
      });
    });
  }
  
  function displayFocusSettings() {
    chrome.storage.local.get(['focusSettings'], (result) => {
      const focusSettings = result.focusSettings || {};
      const focusList = document.getElementById('focusList');
      focusList.innerHTML = '';
  
      Object.entries(focusSettings).forEach(([site, settings]) => {
        const div = document.createElement('div');
        div.className = 'site-entry';
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeFocusSite(site);
        div.innerHTML = `<span>${site}</span><span>${settings.limit} min</span>`;
        div.appendChild(removeBtn);
        focusList.appendChild(div);
      });
    });
  }
  
  function removeFocusSite(site) {
    chrome.storage.local.get(['focusSettings'], (result) => {
      const focusSettings = result.focusSettings || {};
      delete focusSettings[site];
      chrome.storage.local.set({ focusSettings }, () => {
        displayFocusSettings();
        displayTimeData(); // Update time list to remove "Blocked" status
      });
    });
  }
  
  document.getElementById('addFocus').addEventListener('click', () => {
    const site = document.getElementById('focusSite').value.trim();
    const limit = parseInt(document.getElementById('focusLimit').value);
    
    if (site && limit > 0) {
      chrome.storage.local.get(['focusSettings'], (result) => {
        const focusSettings = result.focusSettings || {};
        focusSettings[site] = { limit: limit };
        chrome.storage.local.set({ focusSettings }, () => {
          displayFocusSettings();
          document.getElementById('focusSite').value = '';
          document.getElementById('focusLimit').value = '';
        });
      });
    }
  });
  
  // Initial display
  displayTimeData();
  displayFocusSettings();
  
  // Refresh every second
  setInterval(() => {
    displayTimeData();
    displayFocusSettings();
  }, 1000);