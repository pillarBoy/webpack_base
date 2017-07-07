import $ from 'jquery';

import '@/commenStyle/main.css';

$(document).ready(function () {
  $('body').append('这是about page');
  var div = document.createElement('div');
  div.innerHTML = 'div o';
  $('body').append(div);
});
