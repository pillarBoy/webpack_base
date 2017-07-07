import '@/commenStyle/main.css';
import '@/commenStyle/text.scss';
import say from '@/components/comment.js';
import $ from 'jquery';

$(document).ready(function () {
  say("hello Andy.");
  $("body").css({backgroundColor: '#00ec00'})
});
