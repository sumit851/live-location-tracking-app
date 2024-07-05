const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const socket = require("socket.io");
const io = socket(http);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send-location", (msg) => {
    io.emit("recieve-location", {
      id: socket.id,
      ...msg,
    });
  });

  socket.on("userDisconnected", () => {
    console.log("A user disconnected");
    io.emit("userDisconnected", socket.id);
  });
});
app.get("/", (req, res) => {
  res.render("index.ejs");
});

http.listen(3000, () => {
  console.log("Server is running on port 3000");
});
