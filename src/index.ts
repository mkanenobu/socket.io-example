import Express from "express";
import * as Http from "http";
import { Server } from "socket.io";
import throttle from "lodash.throttle";

const app = Express();
const server = Http.createServer(app);

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

io.on("connect", (socket) => {
  console.log("a user connected");

  const emit = throttle((text) => {
    // emitting socket except sender
    socket.broadcast.emit("provide-from-server", text);
  }, 1000);

  socket.on("onchange", (text) => {
    emit(text);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
