var websocket = new WebSocket('ws://127.0.0.1:5000');

console.log(websocket);

websocket.addEventListener('open', ({data})=> {
  console.log(`[open] : ${data}`);
  console.log(user);
  websocket.send(JSON.stringify({"cmd" : "login_rq", "token" : user._id}));
});

websocket.addEventListener('close', ({data})=> {
	console.log(`[close]`);
});

websocket.addEventListener('message', ({data})=> {
	console.log(`[message] :`);
	console.log(data);

	let packet = JSON.parse(data);
	if (packet.cmd == 'create_record_table_rs')
	{
		// var new_element = document.createElement('div');
		// new_element.className = "bar_item";
		// new_element.setAttribute("title", packet.title);
		// new_element.innerText = packet.title;

		// document.getElementById("title_list").appendChild(new_element);

        CreateBarItem(packet.title);
	}
});

websocket.addEventListener('error', ({data})=> {
  console.log(`[error] : `);
  console.log(data);
});