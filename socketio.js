let onlineUsers = [];
module.exports = (io, myDataBase, chatDB) => {
  io.on("connection", (socket) => {
    let name = socket.request.user.name;
    let username = socket.request.user.username;
    let img = socket.request.user.avatar;

    socket.join(username);

    chatDB.findOne({ pair: [username, username] }, (err, doc) => {
      if (!doc) chatDB.insertOne({ pair: [username, username], message: [] });
    });

    onlineUsers.push({ username, avatar: img, name });

    io.emit("user", {
      name,
      username,
      onlineUsers,
      connected: true,
    });

    socket.on("chat-message", (message) => {
      io.in(message.recipant).emit("chat-message", message);

      chatDB.findOne(
        { pair: { $all: [message.recipant, message.sender] } },
        (err, doc) => {
          if (doc) {
            chatDB.updateOne(doc, {
              $push: {
                message: {
                  message: message.message,
                  sender: message.sender,
                  time: message.time,
                },
              },
            });
          } else {
            chatDB.insertOne({
              pair: [message.recipant, message.sender],
              message: [
                {
                  message: message.message,
                  sender: message.sender,
                  time: message.time,
                },
              ],
            });
          }
        }
      );
    });
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((e) => e.username !== username);
      io.emit("user", {
        name,
        username,
        connected: false,
      });
    });
  });
};
