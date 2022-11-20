
const person = document.querySelector('#person');
const nav = document.querySelector('.nav');
const recordBtn = document.querySelector('.new-record');
const addContainer = document.querySelector('.add-record');
const recordForm = document.querySelector('#record-form');
const recordClose = document.querySelector('#record-close');

const recordEditBtns = document.querySelectorAll('.edit-record');

function SetRecordForm({id, title, desc, date, time})
{
    if (id != null) document.getElementById("record_id").setAttribute('value', id);

    // set title
    if (title != null) document.getElementById("record_title").setAttribute('value', title);

    // set date
    if (date != null) document.getElementById('record_date').setAttribute('value', date);
    
    // set time
    if (time != null) document.getElementById('record_time').setAttribute('value', time);
    
    // set desc
    if (desc != null) document.getElementById("detail").innerText = desc;

    console.log(recordForm);
}

person.addEventListener('mouseover', ()=>{
    nav.style.opacity = '1';
    nav.style.marginTop = '0px';
})
person.addEventListener('mouseout', ()=>{
    nav.style.opacity = '0';
    nav.style.marginTop = '-10px';
})
recordBtn.addEventListener('click', ()=>{
    // addContainer.style.display = 'flex';
    window.history.pushState('Home', 'Home', '/home/create')
    gsap.to(addContainer, {
        duration: 1,
        opacity: "1",
        display: 'flex',
        onComplete: function(){
            gsap.to(recordForm, {
                opacity:1,
                y: 0,
                duration: 1,
                ease:'elastic',
                force3D: true
            })
        }
    })
})

recordClose.addEventListener('click', ()=>{
    window.history.pushState('Home', 'Home', '/home') // <-- form 을 보낼 떄 받는 라우터를 지정하는데 쓰임 index.js 를 확인하자.

    SetRecordForm({title: '', desc: '', date: '', time: ''});

    gsap.to(recordForm, {
        opacity:0,
        transform: "translateY(-10px)",
        onComplete: function(){
            gsap.to(addContainer, {
                opacity:"0",
                duration: 0.5,
                onComplete: function(){
                    gsap.to(addContainer, {
                        display: "none"
                    })
                }
            })
        }
    })
})

recordEditBtns.forEach(recordEditBtn => recordEditBtn.addEventListener('click', () => {
    window.history.pushState('Home', 'Home', "/home/edit");
    console.log(recordEditBtn);

    let record_str = recordEditBtn.getAttribute('record');
    let record = JSON.parse(record_str);
    //console.log(record);

    // // set title
    // document.getElementById("record_title").setAttribute('value', record.title);

    // // set date
    // document.getElementById('record_date').setAttribute('value', record.date);
    
    // // set time
    // document.getElementById('record_time').setAttribute('value', record.time);
    
    // // set desc
    // document.getElementById("detail").innerText = record.description;
    
    SetRecordForm({id: record._id, title: record.title, desc: record.description, date: record.date, time: record.time});

    gsap.to(addContainer, {
        duration: 1,
        opacity: "1",
        display: 'flex',
        onComplete: function(){
            gsap.to(recordForm, {
                opacity:1,
                y: 0,
                duration: 1,
                ease:'elastic',
                force3D: true
            })
        }
    }) 
}));