const { Server } = require("socket.io");
let io;

module.exports = {
  createSocket: (server) => {
    io = new Server(server, {
      cors: {
        origin: '*'
      }
    });
    io.on('connection', (socket) => {
      socket.on('join', (room) => {
        socket.join(room);
      })
    })
    return io;
  },

  io: () => io
}
