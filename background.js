// background.js

let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.action.onClicked.addListener((tab) => {
  console.log(`${tab.url} bg clicked, invoking activeTab`);
  chrome.tabCapture.capture({
    video: true,
    audio: false
  }, handleCapture);
});

function handleCapture(stream) {
  console.log('in bg handleStream');
  console.log(stream);
}
