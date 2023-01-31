const BarItems = document.querySelectorAll('.bar_item');
const NewRecordTableBtn = document.querySelector('#new_record_table');
const TitleEditForm = document.querySelector('#title_edit_form');
const TitleEditInput = document.querySelector('#title_edit_input');
const TitleEditBtn = document.querySelector('#title_edit_btn')

NewRecordTableBtn.addEventListener('click', ()=>{
  console.log("[record_table] click creation record btn");

  const rq = {
    "cmd" : "create_record_table_rq",
    "title" : "test1"
  };

  // call pop

  websocket.send(JSON.stringify(rq));
});

TitleEditBtn.addEventListener('click', () => {
    console.log(TitleEditInput);
    console.log(TitleEditInput.value);
    // send to server ( title : value);
});

function CreateBarItem(title)
{
    // pug에서도 교체할 수 있을지도?
    var new_element = document.createElement('Button');
    new_element.className = "bar_item";
    new_element.setAttribute("title", title);
    new_element.innerText = title;

    AddEventBarItem(new_element);

    document.getElementById("title_list").appendChild(new_element);
}

function LongPressCallBack(element) {
    title_edit_input.setAttribute("value", element.getAttribute("title"));
    gsap.to(addContainer,
        {
            display: 'flex',
            opacity: 1,
            duration: 1,
            onComplete: function () {
                gsap.to(TitleEditForm, {
                    display: 'block',
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease:'elastic',
                    force3D: true
                })}
        });
}

function ShortPressCallBack(bar_item) {
    var title = bar_item.getAttribute('title');
    console.log(title);
    //window.history.pushState('param', 'unused', `/home/${title}`);
  
    console.log(window.location.href);
}

let timer;
let long_press_timer;
function AddEventBarItem(bar_item)
{
    bar_item.addEventListener('mousedown',  function() {
        timer = Date.now();
        long_press_timer = setTimeout(LongPressCallBack, 1000, bar_item);        
    });

    bar_item.addEventListener('mouseup', function () {
        clearTimeout(long_press_timer);
        let now = Date.now();
        let elapsed = now - timer;
        console.log(elapsed);
        if (elapsed < 1000)
            ShortPressCallBack(bar_item);
    
    });
}

BarItems.forEach(bar_item => AddEventBarItem(bar_item));
