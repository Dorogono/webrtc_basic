// 이 파일은 frontend
// 서버와의 연결 socket
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("✅ Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log("GOT MESSAGE: ", message.data);
});

socket.addEventListener("close", () => {
  // 서버가 꺼지면 실행
  console.log("🚫 Disconnected to Server");
});

setTimeout(() => {
  socket.send("this msg is from browser");
}, 10000);
