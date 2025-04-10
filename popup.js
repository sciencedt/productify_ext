function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }
  
  function displayTimeData() {
    chrome.storage.local.get(['timeData'], (result) => {
      const timeData = result.timeData || {};
      const timeList = document.getElementById('timeList');
      timeList.innerHTML = '';
  
      // Sort by time spent (descending)
      const sortedSites = Object.entries(timeData)
        .sort(([, a], [, b]) => b - a);
  
      sortedSites.forEach(([site, seconds]) => {
        const div = document.createElement('div');
        div.className = 'site-entry';
        div.textContent = `${site}: ${formatTime(seconds)}`;
        timeList.appendChild(div);
      });
    });
  }
  
  // Initial display
  displayTimeData();
  
  // Refresh every second
  setInterval(displayTimeData, 1000);