const btRecord = document.getElementById("dig-bt-rec");

function handleSuccess(stream) {
  const video = document.getElementById("dig-video-local");
  video.srcObject = stream;
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
