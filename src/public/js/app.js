// 자동으로 찾을 것임
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");

  // Custom Event : 인자는 JSON Objet, Call back fn 가능
  socket.emit(
    "enter_room",
    { payload: input.value },
    { data: "두 번째 데이터" },
    () => {
      console.log("SERVER is Done");
    }
  );

  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
