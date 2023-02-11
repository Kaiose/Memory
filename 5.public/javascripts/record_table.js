{
const BarItems = document.querySelectorAll('.bar_item');
const NewRecordTableBtn = document.querySelector('#new_record_table');
const TitleEditForm = document.querySelector('#title_edit_form');
const TitleEditInput = document.querySelector('#title_edit_input');
const TitleEditBtn = document.querySelector('#title_edit_btn');
const TitleEditClose = document.querySelector('#title_edit_form_close');
const addContainer = document.querySelector('.add-record');

NewRecordTableBtn.addEventListener('click', ()=>{
  console.log("[record_table] click creation record btn");

    let data = JSON.stringify({ 
        title : "New Record Table"
     });

    fetch("/record_table/create", {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : data
    })
    .then((res) => res.json())
    .then(table => {
        if (table.err != null)
        {
            alert(`Can't Create New Table)`);
            return;
        }

        CreateRecordTable(table.table_id, table.title);
    });
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
    let title = TitleEditInput.value;

    let data = {
        table_id : table_id,
        title : title
    };

    fetch("/record_table/edit", {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then((res) => res.json())
    .then(table => {
        if (table.err != null)
        {
            alert(`Can't Edit Table)`);
            return;
        }

        EditRecordTable(table.table_id, table.title);
    });

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

function CreateRecordTable(table_id, title)
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

function FindRecordTable(table_id)
{
    let items = document.querySelectorAll('.bar_item');
    for (let element of items)
    {
        console.log(element);
        if (table_id == element.getAttribute('table_id'))
            return element;
    }

    return null;
}

function EditRecordTable(table_id, title)
{
    let target = FindRecordTable(table_id);
    if (target == null)
    {
        console.log("Can't Find Target Item: " + table_id);
        return;
    }
    target.setAttribute('title', title);
    target.innerText = title;
l}

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

    window.location.replace(`/record_table/select?table_id=${uid}&title=${title}`);
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
}