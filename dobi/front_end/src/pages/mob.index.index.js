import FastClick from 'fastclick';
import '@/styles/mob/main.scss';
import "@/styles/common/mo.swiper.scss";
import http from '@/tools/http';
import Swiper from 'swiper';
import nav from '@/components/nav';
import moRegister from '@/components/mo.register';
import mobNav from "@/components/mo.nav";
import Alert from "@/tools/alert/alert";
import "@/styles/mob/alert.scss";
import selCoinList from "@/components/mob.select.coinlist";
import getLanguagePacks from '@/components/tradeLanguagePack';

// 重置 html font-size
$(document).ready(function () {
  // 加速ios 点击反应慢
  FastClick.attach(document.body);
  let myAlert = new Alert();

  const lang = getLanguagePacks() || {
    "login_now": "請先登錄",
    "GET_DATA_FAIL": "獲取數據失敗",
    "CANDY_GOT": "恭喜妳已經成功領取"
    };
  // pc版导航 功能
  nav();
  // 手机版导航 功能
  mobNav();
  // 重置樣式
  moRegister();
  // 菜单栏
  const banner = new Swiper('#bannerContainer', {
    loop: true,
    simulateTouch: false,
    parallax: true,
    parallax: true,
    autoplay: 3000,
    Navigation: "arrows",
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev'
  });
    // pc重複功能  可提取（單獨文件）*************
  // $('.login-select').on('change', () => {
  //   // upDataPrice();
  //   let val = $('.login-select').val();
  //   $('[id*="CoinData"]').addClass('hide-ul');
  //   $(`#${val}CoinData`).removeClass('hide-ul');
  // });
  function selCoin() {
    const coinTypes = $(this).attr('data-coincode');
    $('[id*="CoinData"]').addClass('hide-ul');
    $(`#${coinTypes}CoinData`).removeClass('hide-ul');
  }
  selCoinList(selCoin);
  // 币数据
  function upDataPrice() {
    const $sel = $('.coinTypeSpan');
    const coinType = $sel.text();
    http({
      url: '/ajax_market/getAllQuote',
      method: "GET",
      success(result) {
        if (result && parseInt(result.status) === 1) {
          const { data } = result;
          //清空之前的列表
          if (data[coinType]) {
            Object.keys(data).forEach((area) => {
              let $areaUl = $(`#${area}CoinData`);
              Object.keys(data[area]).forEach((coin) => {

                let $li = $areaUl.find(`li[data-coincode='${coin}']`);
                // price 最新价格
                $li.find('span[data-price]').html(data[area][coin].price);
                // 涨跌 切换颜色
                if (data[area][coin].ratio - 0 < 0) {
                  $li.find("[data-pritab]").addClass("down-data").find(".up-array").attr("class", "down-array");
                } else {
                  $li.find("[data-pritab]").removeClass("down-data").find(".down-array").attr("class", "up-array");
                }
                $li.find('span[data-radio]').html(data[area][coin].ratio + '%');
              });
            });
          }
        }
        setTimeout(() => {
          upDataPrice();
        }, 1500);
      },
      error() {
        setTimeout(() => {
          upDataPrice();
        }, 1500);
      }
    });
  }

  // 首次获取
  upDataPrice();
  // pc重複功能  可提取（單獨文件）*************
  // const userInfo = sessionStorage.getItem("user");
  // // 获取本地用户信息
  // let uInfo;
  // // 更新页面数据
  // console.log(uInfo);
  // if (userInfo) {
  //
  //   try {
  //     uInfo = JSON.parse(userInfo);
  //   } catch (e) {
  //   }
  //   // sessionStorage.setItem("user", `{phone: ${user.phone},btc_over: ${user.btc_over}}`);
  //   // const user = JSON.parse(userInfo);
  //   $("#loginGroup").hide();
  //   // 登录显示资产
  //   let $succGroup = $("#loginSuccGroup");
  //   // 顯示賬戶
  //   $succGroup.find('[data-phone]').html(uInfo.phone);
  //   // 顯示資產
  //   $succGroup.find('[data-account]').html(uInfo.total+"BTC");
  //   $succGroup.show();
  // }
  //
  let isLogin = false;
  // 实时 总资产
  function getUserInfo() {
    http({
      url: '/ajax_user/getUserInfo',
      method: "GET",
      success(res) {
        if (res && parseInt(res.status) === 1 && res.data) {
          let { total = "", realInfo, phone } = res.data;
          if (total) {
            if (phone) {
              isLogin = true;
              $("#logoutBTN").removeClass("hide-dom");
              $("#loginGroup").hide();
              $("#loginSuccGroup").show().find('[data-phone]').html(phone);
              $("#userCenter").removeClass("hide-dom");
              sessionStorage.setItem("user", `{"phone": "${phone}","total": "${total}"}`);
            } else {
              isLogin = false;
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

  // 判断是否滚动
  let isMoveTouch = false;
  $(`[id*="CoinData"]`).on('touchstart',function() {
    isMoveTouch = false;
  });
  $(`[id*="CoinData"]`).on('touchmove',function() {
    isMoveTouch = true;
  });
  // 点击币列表
  $('[id*="CoinData"] li').on('touchend', function(e) {
    if (isMoveTouch) return;
    //
    if (!isLogin) {
      return myAlert.show("請先登錄");
    }
    let coin = $(this).data('coincode');
    window.location.href = `/trade/${coin}`;
  });


  let isGettingGift = false;
  let isTouchBanner = false;

  $("#bannerContainer div[data-active]").on("touchmove", function() {
    isTouchBanner = true;
  });

  $("#bannerContainer div[data-active]").on("touchstart", function() {
    isTouchBanner = false;
    isGettingGift = false;
  });

  // 活动
  $("#bannerContainer div[data-active]").on("touchend", function() {
    if (isGettingGift) return;
    isGettingGift = true;
    //
    if (isTouchBanner) return;

    let coin = $(this).data('active');
    $.ajax({
      url: '/ajax_user/coinGift',
      method: 'POST',
      data: {
        coin: coin
      },
      success({status, data, msg}) {
        isGettingGift = false;
        let intStatus = parseInt(status);
        let oAlert = new Alert();
        if (intStatus === 1) {
          oAlert.clickCallback = function() {
            oAlert.closed();
            location.href = '/user/candy?aCoin=3';
          }
          if (coin == 'nano') {
            coin = 'Nano';
          }
          oAlert.show(`${lang.CANDY_GOT}<br><span class="green-f">${data + coin}<span>`);
        } else {
          // 实名
          if (data.need_real_auth) {
            oAlert.clickCallback = function() {
              oAlert.closed();
              location.href = '/user/realinfo';
            }
          }

          // 登陆
          if (data.need_login) {
            oAlert.clickCallback = function() {
              oAlert.closed();
              location.href = '/login';
            }
          }
          oAlert.show(msg);
        }
      },
      error() {
        isGettingGift = false;
      }
    });
  });
});
