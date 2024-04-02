const express = require('express')
const dotenv = require('dotenv')
const chats = require('./data/data')
const app = express()
const connectDB = require('./config/db')
dotenv.config()
const port = process.env.PORT || 3333
const userrouter = require('./routes/userRoutes')
const chatrouter = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')



connectDB() 
app.use(express.json()) // To Accept JSON data
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     next();
//   })
app.use(cors({
    origin:"*",
}))
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/api/chats', (req, res) => {
    res.send(chats)
})

app.use('/user',userrouter)
app.use('/chat',chatrouter)
app.use("/message", messageRoutes);

app.use(notFound)
app.use(errorHandler)

const server = app.listen(port, () => console.log(`Server running on port ${port}`.bgGreen))


const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,

    // "Access-Control-Allow-Origin": "http://localhost:3002"
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});