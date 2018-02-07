import '@/styles/animation/slider.scss';
import http from '@/tools/http';
import alr from '@/tools/alert/alert';

export default () => {
  let myAlert = new alr();
  $("#navMenu").on("touchend", function(e) {
    e.stopPropagation && e.stopPropagation();
    // myAlert.show("touch");
    let $navVList = $("#navVerList");
    // 隐藏导航
    if ($navVList.is(":visible")) {
      // .delay(500).hide()
      $navVList.removeClass('fadeInRight').addClass('fadeOutRight');
      // 隐藏导航
      setTimeout(() => {
        $navVList.removeClass('fadeOutRight').hide();
      }, 300);
    } else {
      $navVList.fadeIn().addClass('fadeInRight');
    }
  });
  let isLogin = false;
  // 登陆显示
  function loginNavShow(phone) {
    $("#logoutBTN").removeClass("hide-dom");
    $("#loginGroup").hide();
    $("#loginSuccGroup").show().find('[data-phone]').html(phone);
    $("#userCenter").removeClass("hide-dom");

  }
  // 未登录
  function unLogin() {
    $("#loginGroup").show();
    $("#loginSuccGroup").hide();
    $("#userCenter").addClass("hide-dom");
  }
  // 退出登录
  function logout() {
    http({
      url: "/ajax_user/logout",
      method: "POST",
      success(res) {
        if(res && parseInt(res.status) === 1) {
          sessionStorage.clear();
          // 显示登录按钮
          $("#loginSuccGroup").hide();
          $("#loginGroup").show();
          // 隐藏 开发和 退出 按钮
          $("#devIng").fadeOut();
          $("#logoutBTN").addClass("hide-dom");
          $("#userCenter").addClass("hide-dom");
          // 返回首页
          window.location.href = '/';
        }
      }
    })
  }
  // 登录显示我的账户
  function getUserInfo() {
    http({
      url: '/ajax_user/getUserInfo',
      method: "GET",
      success(res) {
        // alert(JSON.stringify(res));
        if (res && parseInt(res.status) === 1 && res.data) {
          let { total = "", realInfo, phone } = res.data;
          if (total) {
            // 表示已经登录
            if (phone) {
              isLogin = true;
              loginNavShow(phone);
              sessionStorage.setItem("user", `{"phone": "${phone}","total": "${total}"}`);
            }
            // 未登录
            else {
              isLogin = false;
              unLogin();
            }
            $("#loginSuccGroup").find('[data-account]').html(total+"BTC");
          }
        }
        setTimeout(() => {
          getUserInfo();
        }, 5000);
      },
      error() {
        getUserInfo();
      }
    })
  }
  // init
  getUserInfo();
  // let ik = 1;
  // 点击下拉导航 栏
  $("#navVerList li").on("touchend", function(e) {
    // 阻止冒泡
    e.stopPropagation && e.stopPropagation();
    // 提示开发中页面
    let $thisA = $(this).find("a");
    let path = $thisA.data('path');
    // 不是点击了无效 栏
    if (path !== 'none') {
      // 更新头部信息
      $("#navTitle").html($thisA.html());
      // 开发中
      if (path === "deving") {
        $("#devIng").fadeIn();
      }
      // 退出登录
      else if (path === 'clear') {
        logout();
        // title 显示为首页
        $("#navTitle").html($("#navVerList li a[data-path='home']").html());

      } else {
        // $("#devIng").fadeIn();
      }
      // 更换标题
      $("#navMenu").click();
   }
  });
  $("body").on("touchend", function() {
    let $navVList = $("#navVerList");
    // 隐藏导航
    if ($navVList.is(":visible")) {
      // .delay(500).hide()
      $navVList.removeClass('fadeInRight').addClass('fadeOutRight');
      // 隐藏导航
      setTimeout(() => {
        $navVList.removeClass('fadeOutRight').hide();
      }, 300);
    }
    //  else {
    //   $navVList.fadeIn().addClass('fadeInRight');
    // }
  });

  $("#devGoBack").click(() => {
    let pathname = window.location.pathname;
    // console.log(path);
    if (pathname === '/') {
      // 顶部显示首页
      $("#navTitle").html($("#navVerList li a[data-path='home']").html());
      $("#devIng").fadeOut();
    } else {
      window.location.href = '/';
    }
  });

}
