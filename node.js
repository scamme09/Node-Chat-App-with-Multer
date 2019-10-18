const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server, { pingTimeout: 5000 });
var multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

const Components = require("./Components");
const Header = require("./Components/Header");
const Footer = require("./Components/Footer");
const Login = require("./Components/Login");
const Home = require("./Components/Home");
const Error = require("./Components/Error");
const Data = require("./Classes/Data");

//Date Format
let d = new Date();
d.getHours();
d.getMinutes();
d.getSeconds();

//Connection
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat"
});

let file = "";

//Server Port
server.listen(process.env.PORT || 8000);
console.log("Server running...");

//Login Start
let head = new Header();
let foot = new Footer();
let home = new Home();
let error = new Error();
let homePage = new Components(head, home, foot, "");

fs.writeFile(
  path.join(__dirname, "/Views", "home.html"),
  homePage.render(),
  function(err) {
    if (err) {
      console.log(err);
      console.log("Error Rendering Page!");
    }
    console.log("Home Page Rendered!");
    app.use("/home", express.static(__dirname + "/Views/home.html"));
    app.use("/css", express.static(__dirname + "/Assets/style.css"));
    app.use("/script", express.static(__dirname + "/Assets/script.js"));
    app.use("/icon", express.static(__dirname + "/Assets/CodeGeek.png"));
    app.use("/uploads", express.static(__dirname + "/uploads/"));
    app.post("/profile", upload.single("avatar"), function(req, res, next) {
      // req.file is the `avatar` file
      console.log("somebody uploaded something!");
      if (req.file) {
        file = req.file;
        file = file.path;
        console.log(file);
      }
      // req.body will hold the text fields, if there were any
    });
  }
);
//Login End

const users = [];
let rooms = [];
let connectedUsers = {};

//Socket Connection Start
io.sockets.on("connection", function(socket) {
  //Home Start
  socket.on("user login", function(data) {
    let username = data.username;
    let password = data.password;
    let database = new Data(
      "Select",
      "users",
      "*",
      "username='" + username + "' AND password='" + password + "'"
    );
    let sql = database.sql();

    con.query(sql, function(err, result) {
      if (err) {
        throw err;
      }

      if (typeof result !== "undefined" && result.length > 0) {
        data = result[0].user_name;

        if (users.includes(data) == true) {
          users.push(data);
          console.log("Already Connected!");
          socket.emit(
            "Already Connected",
            "User " + data + " is already connected."
          );
          return false;
        } else {
          users.push(data);
          connectedUsers[data] = socket;
          showSockets();
          socket.username = data;
          console.log(socket.username + " connected");
          socket.broadcast.emit(
            "server message",
            socket.username + " connected"
          );

          socket.emit("return home", data, function(data) {
            console.log(data);
          });
        }
      } else {
        console.log("Access Denied!");
        socket.emit("access denied");
      }
    });
  });
  //Home End

  //Messages
  socket.on("send msg", data => {
    console.log(data);
    socket.broadcast.emit("receive msg", {
      sender: socket.username,
      message: data.message,
      room: data.room
    });
  });

  //Disconnect
  socket.on("disconnect", () => {
    users.splice(users.indexOf(socket.username), 1);
    let name = socket.username;
    if (typeof name !== "undefined" && name.length > 0) {
      socket.broadcast.emit("server message", name + " disconnected");
      showSockets();
    } else {
      return false;
    }
  });

  socket.on("join room", data => {
    socket.join(data, () => {
      rooms = Object.keys(socket.rooms);
      console.log(rooms);
      io.to(data).emit("server message", socket.username + " connected");
      socket.emit("open room", data);
    });
    console.log(data);
  });

  socket.on("open pm", data => {
    let room = generate();
    socket.join(room, () => {
      rooms = Object.keys(socket.rooms);
      console.log(rooms);
      socket.emit("pm", {room: room, user: data.room, origin: socket.username});
      connectedUsers[data.room].emit("pm", {room: room, user: data.user, origin: socket.username});
    });
    console.log(data);
  });



  function showSockets(){
    io.sockets.emit(
      "users connected",
      users
    );
  }
});
//Socket Connection End

function generate(){
  let text = "";
	    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for (let i = 0; i < 5; i++)
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text;
}