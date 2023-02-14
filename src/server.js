import http from "http";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views/");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`SERVER IS ON: http://localhost:3000`);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    Credential: true,
  },
});

instrument(io, {
  auth: false,
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  // 모든 socket Event 감지
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    // 유저는 자기 ID로 된 방에 이미 들어가 있음
    // 특정 방으로 들어가기
    socket.join(roomName);
    done();
    // 본인 제외 나머지 사람들에게 보냄
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_msg", (msg, roomName, done) => {
    socket.to(roomName).emit("new_msg", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
});

server.listen(3000, handleListen);
