const BarItems = document.querySelectorAll('.bar_item');
const NewRecordTableBtn = document.querySelector('new_record_table');

BarItems.forEach(bar_item => bar_item.addEventListener('click', () => {
  var title = bar_item.getAttribute('title');
  console.log(title);
  window.history.pushState('param', 'unused', `/home/${title}`);

  console.log(window.location.href);
  var request = new XMLHttpRequest();
  //request.open()
}));

NewRecordTableBtn.addEventListener('click', ()=>{
  console.log("[record_table] click creation record btn");

  var request = new XMLHttpRequest();
  /*
    1. request create new table
    2. response
  */
});