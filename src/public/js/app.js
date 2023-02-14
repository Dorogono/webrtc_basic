const socket = io();

const call = document.getElementById("call");
const welcome = document.getElementById("welcome");

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const videoBtn = document.getElementById("video");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;
let roomName = "";

call.hidden = true;

const getCameras = async () => {
  try {
    // 기기에 있는 전체 미디어 기기 불러오기
    const devices = await navigator.mediaDevices.enumerateDevices();
    // 오디오 인풋 아웃풋, 비디오 인풋 아웃풋 전부 있음
    const cameras = devices.filter((device) => device.kind === "videoinput");
    // 현재 적용된 기본 카메라
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
};

const getMedia = async (deviceId) => {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
};

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
};
const handleVideoClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    videoBtn.innerText = "Cam Off";
    cameraOff = false;
  } else {
    videoBtn.innerText = "Cam On";
    cameraOff = true;
  }
};

const handleCameraChange = () => {
  getMedia(cameraSelect.value);
};

muteBtn.addEventListener("click", handleMuteClick);
videoBtn.addEventListener("click", handleVideoClick);
cameraSelect.addEventListener("input", handleCameraChange);

const welcomeForm = welcome.querySelector("form");

const startMedia = () => {
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
};

const handleWelcomeSubmit = (e) => {
  e.preventDefault();
  const input = welcomeForm.querySelector("input");
  const value = input.value;
  socket.emit("join_room", value, startMedia);
  roomName = value;
  input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

socket.on("welcome", () => {
  console.log("someone joined");
});
