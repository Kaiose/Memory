const BarItems = document.querySelectorAll('.bar_item');
const NewRecordTableBtn = document.querySelector('#new_record_table');

NewRecordTableBtn.addEventListener('click', ()=>{
  console.log("[record_table] click creation record btn");

  const rq = {
    "cmd" : "create_record_table_rq",
    "title" : "test1"
  };

  websocket.send(JSON.stringify(rq));
});

function LongPressCallBack(element) {
    let title = "LongPressCallBack";
    element.setAttribute("title", title);
    element.innerText = title;    

    console.log(element);
}

function ShortPressCallBack(bar_item) {
    var title = bar_item.getAttribute('title');
    console.log(title);
    window.history.pushState('param', 'unused', `/home/${title}`);
  
    console.log(window.location.href);
}

let timer;
BarItems.forEach(bar_item => bar_item.addEventListener('mousedown', function () {

    timer = Date.now();
    console.log(timer);

}))

BarItems.forEach(bar_item => bar_item.addEventListener('mouseup', function () {

    let now = Date.now();
    let elapsed = now - timer;
    console.log(elapsed);
    if (elapsed > 1000) // long press, edit title
        LongPressCallBack(bar_item);
    else // short press, move to specific page
        ShortPressCallBack(bar_item);
}))

