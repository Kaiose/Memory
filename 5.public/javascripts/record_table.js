const BarItems = document.querySelectorAll('.bar_item');
const NewRecordTableBtn = document.querySelector('#new_record_table');
const TitleEditForm = document.querySelector('#title_edit_form');
const TitleEditInput = document.querySelector('#title_edit_input');
const TitleEditBtn = document.querySelector('#title_edit_btn');
const TitleEditClose = document.querySelector('#title_edit_form_close');

NewRecordTableBtn.addEventListener('click', ()=>{
  console.log("[record_table] click creation record btn");

  const rq = {
    "cmd" : "create_record_table_rq",
    "title" : "New Record Table"
  };

  // call pop

  websocket.send(JSON.stringify(rq));
});

TitleEditClose.addEventListener('click', () => {
    gsap.to(TitleEditForm, {
        opacity: 0,
        display: "none",
        transform: "translateY(-10px)",
        onComplete: function() {
            gsap.to(addContainer, {
                opacity: 0,
                duration: 0.5,
                display: "none"
            })
        }
    });
});

TitleEditBtn.addEventListener('click', () => {
    console.log(TitleEditInput);
    // send to server ( title : value);

    let table_id = TitleEditInput.getAttribute("table_id");
    let to = TitleEditInput.value;

    let rq = {
        cmd : "edit_title_rq",
        table_id : table_id,
        to : to
    };

    websocket.send(JSON.stringify(rq));

    gsap.to(TitleEditForm, {
        opacity: 0,
        display: "none",
        transform: "translateY(-10px)",
        onComplete: function() {
            gsap.to(addContainer, {
                opacity: 0,
                duration: 0.5,
                display: "none"
            })
        }
    });
});

function CreateBarItem(table_id, title)
{
    // pug에서도 교체할 수 있을지도?
    var new_element = document.createElement('Button');
    new_element.className = "bar_item";
    new_element.setAttribute("title", title);
    new_element.setAttribute("table_id", table_id);
    new_element.innerText = title;

    AddEventBarItem(new_element);

    document.getElementById("title_list").appendChild(new_element);
}

function LongPressCallBack(element) {
    TitleEditInput.setAttribute("table_id", element.getAttribute("table_id"));
    TitleEditInput.value = element.getAttribute("title");

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
    var uid = bar_item.getAttribute('table_id');
    var title = bar_item.getAttribute('title');

    window.location.replace(`/record/select?table_id=${uid}&title=${title}`);
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
