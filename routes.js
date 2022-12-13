const passport = require("passport");
const bcrypt = require("bcryptjs");

module.exports = (app, myDataBase, chatDB) => {
  app.get("/", (req, res) => {
    res.render(__dirname + "/views/pug", {
      title: "Login | Chat App",
      showLogin: true,
    });
  });

  app.route("/createNew").get((req, res) => {
    res.render(__dirname + "/views/pug", {
      title: "Create new account | Chat App",
      showSignUp: true,
    });
  });

  app
    .route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/chatApp");
      }
    );

  app.route("/signUp").post(
    (req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, (err, user) => {
        if (err) next(err);
        else if (user) res.redirect("/chatApp");
        else {
          let body = req.body;
          myDataBase.insertOne(
            {
              name: body.name,
              username: body.username,
              password: bcrypt.hashSync(body.password, 12),
              // password: body.password,
              avatar: body.img,
              age: body.age,
            },
            (err, user) => {
              if (err) res.redirect("/");
              else next(null, user.ops[0]);
            }
          );
        }
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/chatApp");
    }
  );

  app.route("/chatApp").get(ensureAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/views/chat.html");
  });

  app.route("/getAvatar/:img").get((req, res) => {
    let imgPath = `/assets/images/${req.params.img}.png`;
    res.sendFile(__dirname + imgPath);
  });

  app.route("/getRecentChats").get(ensureAuthenticated, (req, res) => {
    chatDB.find({ pair: req.user.username }).toArray((err, chats) => {
      res.json(chats);
    });
  });

  app.route("/getUsername").get(ensureAuthenticated, (req, res) => {
    res.json({ username: req.user.username });
  });

  app.route("/getUserDetails/:who").get(ensureAuthenticated, (req, res) => {
    let who = req.params.who;
    myDataBase.findOne({ username: who }, (err, user) => {
      if (user)
        res.json({ name: user.name, avatar: user.avatar, age: user.age });
      else res.json({ name: req.user.username });
    });
  });

  app.route("/getChat/:who").get(ensureAuthenticated, (req, res) => {
    if (req.params.hasOwnProperty("who")) {
      let { who } = req.params;
      chatDB.findOne(
        { pair: { $all: [who, req.user.username] } },
        (err, chats) => {
          if (chats) {
            let message = chats.message;
            res.json(message);
          } else {
            chatDB.insertOne({
              pair: [who, req.user.username],
              message: [],
            });
            res.json([]);
          }
        }
      );
    }
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.use((req, res) => {
    res.status(404).render(__dirname + "/views/pug", {
      title: "Error | Chat App",
      message: "This route: " + req.path + " is not Exists.",
      showError: true,
    });
  });
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
