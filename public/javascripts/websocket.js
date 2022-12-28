var websocket = new WebSocket('ws://127.0.0.1:5000');

console.log(websocket);

websocket.addEventListener('open', (data)=> {
  console.log(`[open] : ${data}`);
});

websocket.addEventListener('close', (data)=> {
  console.log(`[close] : ${data}`);
});

websocket.addEventListener('message', (data)=> {
  console.log(`[message] : ${data}`);
});


websocket.addEventListener('error', (data)=> {
  console.log(`[error] : ${data}`);
});  
