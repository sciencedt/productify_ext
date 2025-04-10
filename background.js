let activeTab = null;
let timeData = {};
let currentDate = new Date().toDateString();
let focusSettings = {};

// Load saved data
chrome.storage.local.get(['timeData', 'lastDate', 'focusSettings'], (result) => {
  const savedDate = result.lastDate || currentDate;
  timeData = result.timeData || {};
  focusSettings = result.focusSettings || {};
  
  if (savedDate !== currentDate) {
    timeData = {};
    chrome.storage.local.set({ 
      timeData: timeData,
      lastDate: currentDate 
    });
  }
});

function checkAndBlockTab(tab) {
  if (!tab || !tab.url) return;
  
  const hostname = new URL(tab.url).hostname;
  if (focusSettings[hostname] && focusSettings[hostname].limit) {
    const limit = focusSettings[hostname].limit * 60;
    timeData[hostname] = timeData[hostname] || 0;
    
    if (timeData[hostname] >= limit) {
      chrome.tabs.update(tab.id, { url: 'chrome://newtab/' });
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Time Limit Reached',
        message: `${hostname} is blocked until tomorrow`
      });
    } else if (timeData[hostname] === limit - 60) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Time Limit Warning',
        message: `1 minute until ${hostname} limit is reached!`
      });
    }
  }
}

function updateTime() {
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
      timeData[hostname] += 1;
      chrome.storage.local.set({ 
        timeData: timeData,
        lastDate: currentDate 
      });
      checkAndBlockTab(activeTab); // Check immediately
    }
  }
}

// Block attempts to revisit blocked sites and update active tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    activeTab = tab;
    checkAndBlockTab(tab); // Check immediately on URL change
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    activeTab = tab;
    checkAndBlockTab(tab); // Check immediately on tab activation
  });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeTab = null;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        activeTab = tabs[0];
        checkAndBlockTab(tabs[0]); // Check immediately on window focus
      }
    });
  }
});

setInterval(updateTime, 1000); // Keep for time incrementing