const BarItems = document.querySelectorAll('.bar_item');
const NewRecordTableBtn = document.querySelector('#new_record_table');

BarItems.forEach(bar_item => bar_item.addEventListener('click', () => {
  var title = bar_item.getAttribute('title');
  console.log(title);
  window.history.pushState('param', 'unused', `/home/${title}`);

  console.log(window.location.href);
  //request.open()
}));

NewRecordTableBtn.addEventListener('click', ()=>{
  console.log("[record_table] click creation record btn");

  const rq = {
    "name" : "create_record_table_rq",
  }

  websocket.send(JSON.stringify(rq));
  /*
    1. request create new table
    2. response
  */
});