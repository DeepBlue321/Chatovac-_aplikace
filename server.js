const PORT = process.env.PORT || 3000;

var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

const users = {};
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("novy-uzivatel", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("uzivatel-prihlasen", name);
  });
  socket.on("poslal-zpravu", (message) => {
    socket.broadcast.emit("zprava", {
      message: message,
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("uzivatel-odhlasen", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(PORT, () => {
  console.log("Poslouchám na portu 3000");
});
