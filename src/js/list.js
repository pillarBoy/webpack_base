import com from '@/components/comment.js';
import $ from 'jquery';

com();
$(document).ready(function() {
  $('body li').css({
    margin: '10px',
    backgroundColor: 'pink'
  });
});
console.log('list page');
