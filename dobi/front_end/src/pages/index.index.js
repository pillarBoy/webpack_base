import '@/styles/common/index.scss';
import '@/styles/main.scss';
import Swiper from 'swiper';
import nav from '@/components/nav';
import DialogBox from '@/tools/dialogBox/dialogBox';
import http from '@/tools/http';
import eNumToStrNum from '@/tools/eNumToStrNum';
import getLanguagePack from '@/components/tradeLanguagePack';
import chkhttpLang from '@/tools/chgHpLg';
import talking from '@/tools/talking/talking';
import Alert from "@/tools/alert/alert";
import Vue from 'vue';
import getLanguagePacks from '@/components/tradeLanguagePack';
// import Alert from '@/tools/alert/alert';

// process.env.NODE_ENV
$(document).ready(function() {
  const lang = getLanguagePacks() || {
    "login_now": "請先登錄",
    "GET_DATA_FAIL": "獲取數據失敗",
    "CANDY_GOT": "恭喜妳已經成功領取"
    };
  // alert(11);
  //打開聊天室接受數據功能
  talking();
  chkhttpLang("#baseLang", http);
  let myAlert = new Alert();
  let register = nav();
  // const resetPwdFn = new ResetPwd();
  // resetPwdFn.pushPhoneNum();
  const nowActive = $('#bannerContainer').attr('data-active');
  if (nowActive) {
    const banner = new Swiper('#bannerContainer', {
      loop: true,
      simulateTouch: false,
      parallax: true,
      // 点击操作swiper，autoplay不关闭-
      autoplayDisableOnInteraction : false,
      autoplay: 5000,
      pagination: '.swiper-pagination',
      paginationClickable :true,
      // Navigation arrows
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      onSlideChangeStart: function(banner) {

      }
    });
  }


  // // 弹框
  const myBox = new DialogBox();
  myBox.outsideCss({ width: '80%', height: '80%' });
  myBox.css({ width: "100%", height: '100%', padding: "0 33px", overflow: 'auto' });
  // 新闻 弹框
  function showNotice(category, title, content) {
    const tpls = `<div class="notice-content"><p class="dialog-title">${title}</p>
      <div class="notice-detail">${content}</div>
    </div>`;
    // <div class="sub-title">${title}</div>
    myBox.show(tpls);
  }
  // showNotice();
  $("#newsTag a").click(function() {
    return;
    const selId = $(this).attr('lang');
    http({
      url: '/index/newsDetail',
      method: "POST",
      data: {
        id: selId
      },
      success(req) {
        let { category, title, content } = req.data;
        showNotice(category, title, content);
      },
      error(err) {
        if (err) {
          alert(err);
        }
      }
    })
  });

  //活動點擊
  $('.acitvity_btn').click(function(event) {
    let coinName = $(this).data('coin');
    http({
      url: '/ajax_user/coinGift',
      type: 'POST',
      dataType: 'json',
      data: { coin: coinName },
      success(data) {
        if (data.status == 1) {
          if (coinName === 'nano') {
            coinName = 'Nano';
          }
          let htmls = `
                      <p class="candy_tips_get">${lang['CANDY_GOT']}</p>
                      <p class="candy_green">${data.data + coinName}</p>
                      `;
          //data.msg
          myAlert.show(htmls);
          //
          $('[data-btnsu="sureBtn"]').click(function(event) {
            window.location.href = '/user/candy?index=3';
          });
        } else {
          myAlert.show(data.msg);
          if (data.data.need_real_auth == 1) {
            $('[data-btnsu="sureBtn"]').click(function(event) {
              window.location.href = '/user/realinfo';
            });
          }
        }
      },
      error(err) {
        if (err)
          myAlert.show(lang['GET_DATA_FAIL']);
      }
    })
  });
  $('.no_login_btn').click(function(event) {
    myAlert.show(lang['login_now']);
    $('[data-btnsu="sureBtn"]').click(function(event) {
      $('.login-btn').click();
    });
  });
  // newsTab
  const btcData = new Swiper('#btcData', {
    // Optional parameters
    loop: true,
    slidesPerView: 5,
    spaceBetween: 0,
    autoplay: 1,
    autoplayDisableOnInteraction: false,
    speed: 6000,
    paginationClickable: true
  });
  const mccData = new Swiper('#mccData', {
    // Optional parameters
    // loop: true,
    slidesPerView: 5,
    spaceBetween: 0,
    // autoplay: false,
    // autoplayDisableOnInteraction: false,
    // speed: 6000,
    // paginationClickable: true
  });

  //
  const ethData = new Swiper('#ethData', {
    // Optional parameters
    // loop: true,
    slidesPerView: 5,
    spaceBetween: 0,
    // autoplay: 1,
    // autoplayDisableOnInteraction: false,
    // speed: 6000,
    // paginationClickable: true
  });

  // 币列表点击币转跳至交易中心 对应币 数据展示
  $("#vueDom [data-coincode]").click(function() {
    window.location.href = `/trade/${$(this).data('coincode')}`;
  });
  // 币数据
  function upDataPrice() {
    http({
      url: '/ajax_market/getAllQuote',
      method: "GET",
      success(result) {
        if (result && parseInt(result.status) === 1) {
          //
          const { data } = result;
          Object.keys(data).forEach((areaName) => {
            let area = data[areaName];
            Object.keys(area).forEach((coinName) => {
              // amount 成交量  price 成交价 ratio 涨跌幅
              const amount = area[coinName].amount;
              const $coinDom = $(`#${areaName}Data li[data-coincode="${coinName}"]`);
              // 成交价
              let price = area[coinName].price;
              // 获取小数 位数
              const strNum = price + '';
              let numLength;
              let beautyNum;
              // console.log(strNum.indexOf('e'));
              if (strNum.indexOf('e') > -1) {
                numLength = strNum.slice(-1);
                beautyNum = price.toFixed(numLength);
                $coinDom.find("span[data-price]").html(beautyNum);
              } else {
                $coinDom.find("span[data-price]").html(strNum);
              }
              // 成交量
              $coinDom.find("span[data-amount]").html(area[coinName].amount);
              // 成交額
              $coinDom.find("span[data-money]").html(area[coinName].money);
              // 涨跌幅
              $coinDom.find("span[data-radio]").html(area[coinName].ratio + '%');
              // 涨 不变 class ， 跌要 添加 class down-data
              // console.log(data[coinName].ratio);
              if (parseFloat(area[coinName].ratio) < 0) {
                $coinDom.find(".price-tab").addClass("down-data").find(".up-array").attr("class", "down-array");
              } else {
                $coinDom.find(".price-tab").removeClass("down-data").find(".down-array").attr("class", "up-array");
              }
            })
          });
        }
      },
      error(err) {
        if (err)
        console.log(err);
      }
    });
  }
  // 首次获取
  upDataPrice();
  // let
  setInterval(function(){
    upDataPrice();
  }, 2000);
  upDataPrice();

  let allUpDownData = 0;
  //
  const $allUpDownDom = $("#allUpDown");
  // 判断是否首页
  if ($allUpDownDom.is(":visible")) {
    function getAllUpDown() {
      http({
        url: '/ajax_market/getCoinIndex',
        method: 'GET',
        success(res) {
          if (res && parseInt(res.status) === 1) {
            const $allUpDownDom = $("#allUpDown");
            if (res.data.curIndex) {
              // down
              if (res.data.curIndex < allUpDownData) {
                $allUpDownDom.addClass('down-pc');
              } else {
                $allUpDownDom.removeClass('down-pc');
              }
              allUpDownData = res.data.curIndex;
              $allUpDownDom.html(res.data.curIndex);
            }
          }
        }
      });
    }

    // 首次加载
    getAllUpDown();
    // 涨跌幅
    setInterval(function(){
      getAllUpDown();
    }, 5000);
  }

  // new Swiper('#btcData', {
  //   // Optional parameters
  //   loop: true,
  //   slidesPerView: 5,
  //   spaceBetween: 0,
  //   autoplay: 1,
  //   autoplayDisableOnInteraction: false,
  //   speed: 6000,
  //   paginationClickable: true,
  //   observer: true, //修改swiper自己或子元素时，自动初始化swiper，主要是这两行
  //   observeParents: true //修改swiper的父元素时，自动初始化swiper
  // });

  // new Swiper('#mccData', {
  //   // Optional parameters
  //   loop: true,
  //   slidesPerView: 5,
  //   spaceBetween: 0,
  //   autoplay: 1,
  //   autoplayDisableOnInteraction: false,
  //   speed: 9000,
  //   paginationClickable: true,
  //   observer: true, //修改swiper自己或子元素时，自动初始化swiper，主要是这两行
  //   observeParents: true //修改swiper的父元素时，自动初始化swiper
  // });

  $("#changeAreaBtn").click(function(e) {
    let ul = $(this).find('ul');
    if (ul.is(":visible")) {
      $(this).removeClass('act-area');
      ul.hide();
    } else {
      $(this).addClass('act-area');
      ul.show();
    }
  });

  // 切换 BTC交易区
  $("#changeAreaBtn ul>li").click(function() {
    let li = $(this);
    let areaName = li.data('aname');
    let curArea = $("#changeAreaBtn span[data-aname]");
    // 获取当前 BTC交易区
    let oldtrade = curArea.data('aname');
    // 设置 交易区
    li.data('aname', oldtrade).find('span').html(oldtrade);
    curArea.data('aname', areaName).html(areaName);
    // 显示对应交易区数据
    $("#vueDom div[data-tradearea='coin']").addClass('no-act-area');
    $(`#${areaName}Data`).parent('div').removeClass('no-act-area');
  });

});
