import '@/styles/news/newsDefault.scss';
import nav from '@/components/nav';

$(document).ready(function() {
  nav();
  //
  const pageReg = /^(([1-9]([0-9]+)?)+)$/;
  $("#pageForm input").on('input', function() {
    const $inp = $(this);
    let val = $inp.val();
    if (val && !pageReg.test(val)) {
      // 获取 输入的 整数部分
      let numPart = parseInt(val);
      if (!isNaN(numPart)) {
        $inp.val(numPart);
      } else {
        $inp.val('');
      }
    }
  });
  // 提交
  $("#pageForm").on("submit", function() {
    let val = $(this).find('input').val();
    let result = false;
    if (val && pageReg.test(val)) {
      result = true;
    } else {
      result = false;
    }
    // console.log(1212, result);
    return result;
  });
  var btn=document.getElementById("go").onclick = function () {
    var val= document.getElementsByName("p")[0].value;
    var cate = document.getElementsByName("cate")[0].value;
    location.href='/news/category/'+cate+'/page/'+ val;
   }
});
