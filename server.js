const app = require('express')();
const server = require('http').createServer(app);
const path = require('path');

const io = require('socket.io')(server);

const port = process.env.PORT || 8080;

const options = {
    root: path.join(__dirname)
};
app.get('/', function(req, res) {
  res.sendFile('./index.html', options);
});




const gamestate = {
  founds: []
};



io.on('connection', (socket) => {
  console.log('user connected');  

  // pass gamestate
  socket.emit("gamestate", gamestate);

  // TODO: validate index
  // TODO: check if index previously found
  socket.on("foundMatch", (index) => {
    console.log("foundMatch: ", gamestate)
    if(!gamestate.founds.includes(index)) gamestate.founds.push(index);
    else socket.emit("invalidMatch");

  })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});