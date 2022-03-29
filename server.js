require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const myDB = require("./connection");
const routes = require("./routes");
const auth = require("./auth");
const socketio = require("./socketio");
const session = require("express-session");

const app = express();
app.set("view engine", "pug");
const http = require("http").createServer(app);

const MongoStore = require("connect-mongo")(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });
const cookieParser = require("cookie-parser");
const io = require("socket.io")(http);
const passportSocketIo = require("passport.socketio");

app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    key: "express.sid",
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: "express.sid",
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
  })
);

myDB(async (client) => {
  const myDataBase = await client.db("database").collection("users");
  const chatDB = await client.db("database").collection("chatMessages");

  routes(app, myDataBase, chatDB);
  auth(app, myDataBase);
  socketio(io, myDataBase, chatDB);

}).catch((e) => { 
  app.route("/").get((req, res) => {
    res.render(__dirname + "/views/pug/index.pug", {
      title: "Unable to login | Chat App",
      message: e,
      showError: true,
    });
  });
  app.use((req, res) => {
    res.status(404).redirect("/");
  });
});

http.listen(3000, () => {
  console.log("app successfully start at port 3000");
});

function onAuthorizeSuccess(data, accept) {
  console.log("successful connection to socket.io");
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log("failed connection to socket.io:", message);
  accept(null, false);
}
