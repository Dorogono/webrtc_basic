// 이 파일은 frontend
// 서버와의 연결 socket
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("✅ Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log("GOT MESSAGE FROM SERVER : ", message.data);
});

socket.addEventListener("close", () => {
  console.log("🚫 Disconnected to Server");
});
