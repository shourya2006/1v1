const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve("./public")));
const io = socket(server);





io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);
  
    socket.on('createRoom', (data) => {
      const { handle, roomName, difficulty } = data;
      socket.join(roomName);
      console.log(`Room "${roomName}" created by ${handle} with difficulty ${difficulty}`);
      socket.emit('roomCreated', {
        roomKey: roomName,
        message: `Room "${roomName}" created successfully!`
      });
    });
  
    // Listen for joinRoom event
    socket.on('joinRoom', (data) => {
      const { handle, roomKey } = data;
      socket.join(roomKey);
      console.log(`User ${handle} joined room "${roomKey}"`);
      // Notify the joining user with the room key
      socket.emit('roomJoined', {
        roomKey,
        message: `You have joined room "${roomKey}"`
      });
      socket.to(roomKey).emit('userJoined', {
        handle,
        message: `${handle} has joined the room.`
      });
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected: ' + socket.id);
    });
  });


problemNames = {};
const fetchQuestion = async (rating) => {
  try {
    response = await fetch(
      `https://codeforces.com/api/user.status?handle=Kraven&from=1&count=10000`
    );
    if (!response.ok) {
      console.log("unable to Fetch");
    }
    data = await response.json();
    for (let i of data.result) {
      if (i.verdict === "OK") {
        problemNames[i.problem.name] = i.problem.rating;
      }

      // console.log(problemNames);
      res = await fetch(
        `https://codeforces.com/api/problemset.problems?rating=${rating}`
      );
      question = await res.json();
      lst = [];
      for (let i of question.result.problems) {
        if ((!problemNames[i.name]) & (i.rating === rating)) {
          lst.push({
            name: i.name,
            rating: i.rating,
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};
fetchQuestion(2000);
app.get("/", (res, rej) => {
  return res.sendFile("public/index.html");
});

app.get("/about", (req, res) => {
  return res.sendFile(path.resolve("public/about.html"));
});

app.get("/howitworks", (req, res) => {
  return res.sendFile(path.resolve("public/howitworks.html"));
});

app.get("/joinroom", (req, res) => {
  return res.sendFile(path.resolve("public/joinroom.html"));
});
app.get("/createroom", (req, res) => {
  return res.sendFile(path.resolve("public/creatroom.html"));
});

server.listen(5001, () => {
  console.log(`Server is listening at Port 5001`);
});
