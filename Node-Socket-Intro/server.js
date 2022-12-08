const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// SocketID : username
const users = {};

io.on("connection", (socket) => {
  socket.on("new-connection", (username) => {
    users[socket.id] = username;
    io.emit("count-online", Object.keys(users).length);
  });

  socket.on("send-message", (message) => {
    const username = users[socket.id];
    message = `${username}: ${message}`;
    io.emit("received-message", message);
  });

  socket.on("user-typing", () => {
    io.emit("user-typing", users[socket.id]);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("count-online", Object.keys(users).length);
  });
});

const port = 4000;
server.listen(port, () => {
  console.log("Server is running on port: " + port);
});
