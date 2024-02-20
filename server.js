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


// Game setup
const matchNumber = 69 ;
let PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155"
//(await fetch("https://pi2e.ch/blog/wp-content/uploads/2017/03/pi_dec_1m.txt")).text();
const matchesAtIndex = matchChecker(PI, matchNumber);

const gamestate = {
  founds: []
};



io.on('connection', (socket) => {
  console.log('user connected');  

  // pass gamestate
  socket.emit("gamestate", gamestate);

  // TODO: check if index previously found, it must be the first unfound one
  socket.on("foundMatch", (index) => {
    console.log("foundMatch: ", gamestate)
    if(!gamestate.founds.includes(index) && matchesAtIndex(index)){
      gamestate.founds.push(index);
      socket.emit("gamestate", gamestate);
    } 
    else {
      socket.emit("invalidMatch")
    };

  })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});



















// constant, match
function matchChecker(c, m){
   m = m.toString();
   c = c.toString();
   // index
   return function matchesAtIndex(i){
      //console.log(c.slice(i, i+m.length), m.length, i)
      return c.slice(i, i+m.length) == m;
   }
}
