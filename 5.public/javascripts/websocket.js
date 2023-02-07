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
        if (packet.result == true)
        {
            CreateBarItem(packet.table_id, packet.title);
        }
	}

    if (packet.cmd == "edit_title_rs")
    {
        // 귀찮음 -> 리로드
        window.location.reload();
    }
});

websocket.addEventListener('error', ({data})=> {
  console.log(`[error] : `);
  console.log(data);
});