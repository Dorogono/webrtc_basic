// 자동으로 찾을 것임
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("#roomName");
const nameForm = welcome.querySelector("#name");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

const addMsg = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};

const handleMsgSubmit = (e) => {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_msg", value, roomName, () => {
    addMsg(`You: ${value}`);
  });
  input.value = "";
};

const handleNicknameSubmit = (e) => {
  e.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value);
};

const showRoom = () => {
  // welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const msgForm = room.querySelector("#msg");

  msgForm.addEventListener("submit", handleMsgSubmit);
};

const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");

  // Custom Event : 인자는 JSON Objet, Call back fn 가능
  // 단, call back fn은 마지막 값임 (서버 -> 클라이언트로 다 됐다고 알림)
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user, newCount) => {
  console.log(newCount);
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMsg(`${user} Joined!`);
});

socket.on("new_msg", addMsg);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

socket.on("bye", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMsg(`${user} says Good Bye`);
});
