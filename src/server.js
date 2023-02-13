import http from "http";
import WebSocket from "ws";
import express from "express";

// express = http
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views/");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`SERVER IS ON: http://localhost:3000`);

const server = http.createServer(app);
// wss = web socket server
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  // 연결된 브라우저 socket
  console.log("✅ Connected to Browser");
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "msg":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}: ${message.data.toString()}`);
        });
      case "nickname":
        socket["nickname"] = message.data;
    }
  });
  // 브라우저가 꺼지면 실행
  socket.on("close", () => console.log("🚫 Disconnected from the Browser"));
});

server.listen(3000, handleListen);
