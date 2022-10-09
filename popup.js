/**
 * TEMPLATE CODE PRETTY MUCH
 * KEEPING NOW FOR EXPERIMENTS
 */

let extDOM = document;
let btAction = extDOM.getElementById("action");

function handleCapture(stream) {
  console.log('in handleStream');
  console.log(stream);
}

chrome.storage.sync.get("color", ({ color }) => {
  btAction.style.backgroundColor = color;
});

btAction.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(`${tab.url} before clicked, invoking activeTab`);

  chrome.action.onClicked.addListener((tab) => {
    console.log(`${tab.url} clicked, invoking activeTab`);
    chrome.tabCapture.capture({
      video: true,
      audio: false
    }, handleCapture);
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBgColor,
  });
});

function setPageBgColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    let pageDOM = document;
    
    pageDOM.body.style.backgroundColor = color;
    color = `#${Math.round(Math.random() * 255).toString(16)}${Math.round(
      Math.random() * 255
    ).toString(16)}${Math.round(Math.random() * 255).toString(16)}`;
    chrome.storage.sync.set({ color });
  });
}

// /**
//  * TEMPLATE CODE ENDS
//  */

// let btSelectArea = extDOM.getElementById("select-area");

// /**
//  * on click, this should create an overlay on tab and allow user to select area from screen to capture
//  */
// btSelectArea.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: buildOverlay
//     });
// });

// function buildOverlay() {
//     let pageDOM = document;

//     let overlayDiv = pageDOM.createElement("div");
//     overlayDiv.id = "stg-overlay";
//     overlayDiv.style.position = "fixed";
//     overlayDiv.style.height = "100%";
//     overlayDiv.style.width = "100%";
//     overlayDiv.style.zIndex = 99999999;
//     overlayDiv.style.top = 0;
//     overlayDiv.style.left = 0;
//     overlayDiv.style.backgroundColor = "#0003";
//     overlayDiv.style.cursor = "crosshair";

//     document.getElementsByTagName("body")[0].appendChild(overlayDiv);
// }