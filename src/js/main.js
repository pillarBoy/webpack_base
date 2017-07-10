import '@/commenStyle/main.css';
import '@/commenStyle/text.scss';
import say from '@/components/comment.js';
// import $ from 'jquery';
import test from './test.js';

$(document).ready(function () {
  say("hello Andy.");
  $("body").css({backgroundColor: '#00ec00'})
  test();
});
