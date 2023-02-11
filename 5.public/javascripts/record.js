{
const person = document.querySelector('#person');
const nav = document.querySelector('.nav');
const addContainer = document.querySelector('.add-record');
const recordForm = document.querySelector('#record-form');
const recordClose = document.querySelector('#record-close');
const recordEditBtns = document.querySelectorAll('.edit-record');
const RecordRemoveDoms = document.querySelectorAll('#delete');

function SetRecordForm({id, table_id, subject, desc, date, time})
{
    if (id != null) document.getElementById("record_id").setAttribute('value', id);

    if (table_id != null) document.getElementById("table_id").setAttribute('value', table_id);

    // set title
    if (subject != null) document.getElementById("record_subject").setAttribute('value', subject);

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

recordClose.addEventListener('click', ()=>{
    window.history.pushState('Home', 'Home', '/home') // <-- form 을 보낼 떄 받는 라우터를 지정하는데 쓰임 index.js 를 확인하자.

    SetRecordForm({table_id: '', subject: '', desc: '', date: '', time: ''});

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
    window.history.pushState('Home', 'Home', "/record/edit");
    console.log(recordEditBtn);

    let record_str = recordEditBtn.getAttribute('record');
    let record = JSON.parse(record_str);

    SetRecordForm({id: record._id, table_id: _table._id, subject: record.subject, desc: record.description, date: record.date, time: record.time});

    gsap.to(addContainer, {
        duration: 1,
        opacity: "1",
        display: 'flex',
        onComplete: function(){
            gsap.to(recordForm, {
                display: 'block',
                opacity:1,
                y: 0,
                duration: 1,
                ease:'elastic',
                force3D: true
            })
        }
    }) 
}));

console.log(RecordRemoveDoms);

RecordRemoveDoms.forEach(dom => dom.addEventListener('click', () => {
    window.history.pushState('record', 'Home', "/record/remove");
    console.log(dom);
}));

}