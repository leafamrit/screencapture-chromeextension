const btRecord = document.getElementById("dig-bt-rec");
let mediaRecorder = null;
let recordedBlobs = [];

function handleSuccess(stream) {
  btRecord.disabled = true;

  const video = document.getElementById("dig-video-local");
  video.srcObject = stream;
  
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  mediaRecorder.addEventListener("dataavailable", (blob) => {
    console.log("pushing to recordedBlobs");
    recordedBlobs.push(blob.data);
  });
  mediaRecorder.addEventListener("stop", (ev) => {
    video.srcObject = null;
    console.log(`recorded ${recordedBlobs.length}`);
    video.src = window.URL.createObjectURL(new Blob(recordedBlobs, { mimeType: "video/webm" }));
    video.controls = true;
  });
  mediaRecorder.start();
  
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    btRecord.disabled = false;
    mediaRecorder.stop();
  });
}

function handleError(error) {
  console.error(`getDisplayMedia error: ${error.name}`, error);
}

btRecord.addEventListener("click", () => {
  const options = { audio: false, video: true };
  navigator.mediaDevices
    .getDisplayMedia(options)
    .then(handleSuccess, handleError);
});
