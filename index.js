function buildOverlay() {
    let overlayDiv = document.createElement("div");
    overlayDiv.id = "stg-overlay";
    overlayDiv.style.position = "fixed";
    overlayDiv.style.height = "100%";
    overlayDiv.style.width = "100%";
    overlayDiv.style.zIndex = 99999999;
    overlayDiv.style.top = 0;
    overlayDiv.style.left = 0;
    overlayDiv.style.backgroundColor = "#0003";
    overlayDiv.style.cursor = "crosshair";

    let areaSelector = document.createElement("div");
    areaSelector.id = "stg-area-selector";
    areaSelector.style.position = "fixed";
    areaSelector.style.height = 0;
    areaSelector.style.width = 0;
    areaSelector.style.zIndex = 99999999;
    areaSelector.style.top = 0;
    areaSelector.style.left = 0;
    areaSelector.style.backgroundColor = "#000a";

    overlayDiv.appendChild(areaSelector);
    document.getElementsByTagName("body")[0].appendChild(overlayDiv);
}

buildOverlay();

let startX, startY, endX, endY, drag;
let divAreaSelector = document.getElementById("stg-area-selector");

// document.addEventListener("mousedown", (e) => {
//     if(e.button === 0) {
//         drag = true;

//         startX = e.offsetX;
//         startY = e.offsetY;
        
//         divAreaSelector.style.top = `${startX}px`;
//         divAreaSelector.style.left = `${startY}px`;
    
//         console.log(`(${startX}, ${startY})`);
//     }
// });

// document.addEventListener("mousemove", (e) => {
//     if(drag) {
//         divAreaSelector.style.width = `${startX + e.offsetX}px`;
//         divAreaSelector.style.height = `${startY + e.offsetY}px`;
//     }

// });

// document.addEventListener("mouseup", (e) => {
//     if(e.button === 0) {
//         drag = false;

//         endX = e.offsetX;
//         endY = e.offsetY;
    
//         console.log(`(${endX}, ${endY})`);
//     }
// });
