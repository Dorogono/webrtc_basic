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

wss.on("connection", (socket) => {
  // 연결된 브라우저 socket
  console.log("✅ Connected to Browser");
  socket.send("hello");
});

server.listen(3000, handleListen);
