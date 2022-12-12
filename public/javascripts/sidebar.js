var bar_items = document.querySelectorAll('.bar_item');

bar_items.forEach(bar_item => bar_item.addEventListener('click', () => {
  var title = bar_item.getAttribute('title');
  console.log(title);
  window.history.pushState('param', 'unused', `/home/${title}`);

  console.log(window.location.href);
  var request = new XMLHttpRequest();
  //request.open()
}));