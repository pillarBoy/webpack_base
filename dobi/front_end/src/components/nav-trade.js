import "@/styles/common/navDefault.scss";

export default function(lang) {
  // console.log('nav tab');
  // console.log('nav tab');
  var language = {
    OPEN_SOON: "即將開放!"
  };
  if (lang) language = lang;
  $("[data-account]").hover(function() {
    const tog = $(this).data('account');
    $(`#${tog}`).show();
  });
  $("[data-account]").mouseleave(function() {
    const tog = $(this).data('account');
    $(`#${tog}`).hide();
  });
  $("#languageBtn").hover(function() {
    $("#langList").show();
  });
  $("#languageBtn").mouseleave(function() {
    $("#langList").hide();
  });
  $("#langList").click(function() {

    alert(language['OPEN_SOON']); // "即將開放!"
  });

  // return new Promise((resolve, reject) => {
  //   http({
  //     url: '/ajax_user/getUserInfo',
  //     methods: "POST",
  //     data: '',
  //     success(req) {
  //       // 登录状态
  //       if (is(req.data, "Object")) {
  //         $("#TopNav li[data-unlogin]").hide();
  //         $("#UserLoginStatu").show();
  //       }
  //       // 未登录状态
  //       else {
  //         $("#TopNav li[data-unlogin]").show();
  //         $("#UserLoginStatu").hide();
  //       }
  //       resolve(req);
  //     },
  //     error(err) {
  //       reject(err);
  //     }
  //   });
  // });


}
