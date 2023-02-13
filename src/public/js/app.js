// 이 파일은 frontend
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
// 서버와의 연결 socket
const socket = new WebSocket(`ws://${window.location.host}`);

const makeMsg = (type, data) => {
  const msg = { type, data };
  return JSON.stringify(msg);
};

socket.addEventListener("open", () => {
  console.log("✅ Connected to Server");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  msgList.append(li);
});

socket.addEventListener("close", () => {
  // 서버가 꺼지면 실행
  console.log("🚫 Disconnected to Server");
});

const handleSubmit = (evt) => {
  evt.preventDefault();
  const input = msgForm.querySelector("input");
  socket.send(makeMsg("msg", input.value));
  input.value = "";
};

const handleNickSubmit = (evt) => {
  evt.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMsg("nickname", input.value));
};

msgForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
