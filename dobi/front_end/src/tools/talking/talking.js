
export default function talkStart() {
  // const talkingUrl = $('#wsurl').val();
  //
  // const ws = new WebSocket(`${talkingUrl}`);
  //
  // const token = $("#hahaha").text();
  //
  // const phone = $('.getPhones').text();
  //
  // if (!phone) {
  //   //退出登錄清空所以聊天數據
  //   localStorage.all = [];
  //   localStorage.num = 0;
  // }
  // //进入聊天室聊天室未弹出时计算消息数
  // if (localStorage.mesNum) {
  //   var mesNum = JSON.parse(localStorage.mesNum);
  // } else {
  //   var mesNum = 0;
  // }
  //
  // //聊天框弹出
  // $('.talking_down').click(function(event) {
  //   mesNum = 0;
  //   localStorage.mesNum = 0;
  //   $('.talking_down span').text('0');
  //   $('.talking_up').fadeIn();
  //   $('.talking_down').fadeOut();
  //   localStorage.status = 'block';
  //   oldHtml();
  // });
  // //聊天框收起
  // $('.talking_sj').click(function(event) {
  //   $('.talking_up').fadeOut();
  //   $('.talking_down').fadeIn();
  //   localStorage.status = 'none';
  // });
  // //点击退出
  // $('.talking_close').click(function(event) {
  //   $('.login_btn').fadeIn();
  //   $('.talking_inner').fadeOut();
  //   $('.talking_text').fadeOut();
  //   $('.talking_footer').fadeOut();
  //   //清空数据
  //   $('.talking_inner ul').html('');
  //   //全部信息
  //   localStorage.all = [];
  //   //保存退出標識
  //   localStorage.out = 'true';
  // });
  // //点击登录
  // $('.login_btn').click(function(event) {
  //   $('.login_btn').fadeOut();
  //   $('.talking_inner').fadeIn();
  //   $('.talking_text').fadeIn();
  //   $('.talking_footer').fadeIn();
  //   localStorage.all = [];
  //   localStorage.out = 'false';
  // });
  // //发送
  // $('.sent_btn').click(function(event) {
  //   let msg = $('.talking_text textarea').val();
  //   let reg = /^[\u4E00-\u9FA5a-zA-Z0-9_,，.。|！!~·%^&?？;、(=)(（）)(+)\s：:@(*)(《》)($￥)]+$/u;
  //   // let reg = /<\/?[^>]*>|<\/?[^>]*/;
  //   if (reg.test(msg)) {
  //     msg = msg.replace(/&gt|&lt/g,'');
  //   }
  //   else {
  //     msg = msg.replace(/<|>|\//g,'');
  //   }
  //   if (msg != '') {
  //     // ws.send(phone+','+msg);
  //     $('.talking_text textarea').val('');
  //     mesAjax({phone, msg});
  //   }
  //   else {
  //     $('.talking_text textarea').val('');
  //     return  false;
  //   }
  // });
  // document.onkeydown = function(event) {
  //   if (event.keyCode == 13) {
  //     event.preventDefault();
  //     $('.sent_btn').click();
  //   }
  // }
  // //点击头像
  // $('body').on('click', '.icon_peo', function() {
  //   let phone = $(this).next('.peo_mes').find('.peo_phone').text();
  //   sentMes(phone);
  // })
  // //点击电话
  // $('body').on('click', '.peo_phone', function() {
  //   let phone = $(this).text();
  //   sentMes(phone);
  // })
  // //艾特对方手机号
  // function sentMes(phone) {
  //   $('.talking_text textarea').val('@'+phone+"  ");
  // }
  //
  // if (localStorage.all) {
  //   var talking_mes = JSON.parse(localStorage.all);
  // } else {
  //   var talking_mes = [];
  // }
  // //判断刷新页面之前聊天室为弹出还是收起
  // if (localStorage.status == 'block') {
  //   $('.talking_inner ul').text('');
  //   if (localStorage.out && localStorage.out == 'true') {
  //     //已判断为登出
  //     $('.login_btn').show();
  //     $('.talking_inner').hide();
  //     $('.talking_text').hide();
  //     $('.talking_footer').hide();
  //   }
  //   else {
  //     if (localStorage.all) {
  //       //填充历史数据
  //       oldHtml();
  //     }
  //   }
  //   $('.talking_up').show();
  //   $('.talking_down').hide();
  // }
  // else {
  //   //填入消息数
  //   if (localStorage.mesNum) {
  //     const mesNum = JSON.parse(localStorage.mesNum);
  //     $(".talking_down span").text(mesNum);
  //   }
  // }
  //
  // //重新加载内容
  // function oldHtml() {
  //   if (localStorage.all) {
  //     const historyData = JSON.parse(localStorage.all);
  //     talking_mes = historyData;
  //     let historyHtml = '';
  //     historyData.forEach((el, item) => {
  //       historyHtml += talkingHtmlFn(el);
  //     });
  //     $('.talking_inner ul').html(historyHtml);
  //     // setTimeout(() => {
  //     //   const talking_height = $('.talking_inner ul').height();
  //     //   const talking_inner = $('.talking_inner').height();
  //     //   $('.talking_inner').scrollTop(talking_height-talking_inner);
  //     // });
  //     heightGet().then((value) => {
  //       const talking_height = $('.talking_inner ul').height();
  //       const talking_inner = $('.talking_inner').height();
  //       $('.talking_inner').scrollTop(talking_height-talking_inner);
  //     })
  //   }
  // }
  // function heightGet() {
  //   return new Promise(function(resolve, reject){
  //     setTimeout(resolve)
  //   });
  // }
  // ws.onopen = function () {
  //     // console.log("连接成功");
  //     ws.send(JSON.stringify({token:token, channel:'Thechatroom'}));
  // };
  //
  // ws.onmessage = function (e) {
  //     if (JSON.parse(e.data).data) {
  //       //聊天室是否弹出
  //       const talking_display = $('.talking_up').css('display');
  //       if (!localStorage.out || localStorage.out == 'false') {
  //         const userName = JSON.parse(e.data).data.split(':')[0];
  //         const content = JSON.parse(e.data).data.split(':')[1];
  //         const now_mes = {userName:userName, content:content};
  //         const talkingHtml = talkingHtmlFn(now_mes);
  //
  //
  //         $('.talking_inner ul').append(talkingHtml);
  //         //储存对话消息
  //         talking_mes.push(now_mes);
  //         localStorage.all = JSON.stringify(talking_mes);
  //         if (talking_display == "none" || talking_display == undefined) {
  //           mesNum ++;
  //           if (mesNum > 99) {
  //             mesNum ='99+';
  //           }
  //           localStorage.mesNum = JSON.stringify(mesNum);
  //           $(".talking_down span").text(mesNum);
  //         }
  //         else {
  //           mesNum = 0;
  //           localStorage.num = mesNum;
  //         }
  //       }
  //       localStorage.status = talking_display;
  //       let innerH = $('.talking_inner').height();
  //       let talkingH = $('.talking_inner ul').height();
  //       $('.talking_inner').scrollTop(talkingH-innerH);
  //     }
  //     else {
  //       return false;
  //     }
  // };
  // //后台保存消息
  // function mesAjax(now_mes) {
  //   $.ajax({
  //     url: 'Ajax_Push/push',
  //     type: 'POST',
  //     data: {
  //       mo: now_mes.phone,
  //       themessage: now_mes.msg
  //     },
  //     success(res) {
  //
  //     },
  //     error(err) {
  //
  //     }
  //   })
  // }
  // //组成聊天内容
  // function talkingHtmlFn(mes){
  //   return `<li>
  //     <div class="icon_peo">
  //       <img src="/imgs/people_default.png" alt="">
  //     </div>
  //     <div class="peo_mes">
  //       <span class="peo_phone">${mes.userName.slice(0,3)}****${mes.userName.slice(7,11)}</span>
  //       <p>${mes.content}</p>
  //     </div>
  //     <div class="clear"></div>
  //   </li>`
  // }
}
