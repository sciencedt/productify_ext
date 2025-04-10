let activeTab = null;
let timeData = {};
let currentDate = new Date().toDateString();

// Load saved data when extension starts
chrome.storage.local.get(['timeData', 'lastDate'], (result) => {
  const savedDate = result.lastDate || currentDate;
  timeData = result.timeData || {};
  
  // Reset if new day
  if (savedDate !== currentDate) {
    timeData = {};
    chrome.storage.local.set({ 
      timeData: timeData,
      lastDate: currentDate 
    });
  }
});

function updateTime() {
  // Check if date changed
  const newDate = new Date().toDateString();
  if (newDate !== currentDate) {
    currentDate = newDate;
    timeData = {};
    chrome.storage.local.set({ 
      timeData: timeData,
      lastDate: currentDate 
    });
  }

  if (activeTab) {
    const hostname = new URL(activeTab.url).hostname;
    if (hostname) {
      timeData[hostname] = timeData[hostname] || 0;
      timeData[hostname] += 1; // Increment by 1 second
      
      // Save to storage
      chrome.storage.local.set({ 
        timeData: timeData,
        lastDate: currentDate 
      });
    }
  }
}

// Check active tab every second
setInterval(updateTime, 1000);

// Listen for tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    activeTab = tab;
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    activeTab = tab;
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeTab = null;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        activeTab = tabs[0];
      }
    });
  }
});