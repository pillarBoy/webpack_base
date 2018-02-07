import '@/styles/common/index.scss';
import '@/styles/userCenter/index.scss';
import "@/styles/userCenter/coinIn.scss";
import Flatpickr from "flatpickr";
import Zh from "flatpickr/dist/l10n/zh.js";
import nav from '@/components/nav';
import activeNav from '@/components/userNav.js';
import http from '@/tools/http';
import Alert from '@/tools/alert/alert';
import is from '@/tools/is';
import setTableStyle from '@/components/makeTableHead';
import getLanguagePack from '@/components/tradeLanguagePack';
import chkhttpLang from '@/tools/chgHpLg';
// mobile
import "@/styles/mob/user.coinin.scss";
import mobNav from "@/components/mo.nav";
import selCoinList from "@/components/mob.select.coinlist";
import FastClick from 'fastclick';

// process.env.NODE_ENV
// 我的賬戶 轉幣 提幣 委托 成交 頁面js
$(document).ready(function() {
  FastClick.attach(document.body);
  // 切換 請求處理 語言包
  chkhttpLang("#baseLang", http);
  const lang = getLanguagePack() || {
    tablePlatformIn: "平台內",
    tablePlatformOut: "平台外",
    COPY_NOT_SUPPORT: "您的浏覽器不支持快速複制功能，請手動選擇需要複制的內容按下 ctrl + c 鍵複制。",
    MOB_COPY_NOT_SUPPORT: "您的浏覽器不支持快速複制功能，請手動選擇需要複制的內容進行複制。",
    COPY_NOT_SUPPORT_UPDATE: "您的浏覽器不支持複制功能呢，請安裝最新版本浏覽器後再試試。",
    COPY_SUCCESS: "複制成功，請通過 ctrl + v 鍵粘貼。",
    MOB_COPY_SUCCESS: "複制成功",
    GET_DATA_FAIL: "獲取數據失敗",
    START_TIME: "請選擇開始時間",
    END_TIME: "請選擇結束時間",
    START_GT_END: "開始時間不能大于等于結束時間"
  };

  // 彈框
  const myAlert = new Alert("");
  mobNav();
  nav();
  activeNav();
  Flatpickr.localize(Zh.zh);
  /* eslint-disable */
  // 日曆
  const startTimtOptions = {
    enableTime: true,
    // defaultDate: "today",
    // maxDate: $("#endTime").val() || "",
    dateFormat: "Y-m-d H:i:S"
  };
  const startTime = new Flatpickr("#startTime", startTimtOptions);
  const endTimtOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i:S"
  };
  const endTime = new Flatpickr("#endTime", endTimtOptions);
  /* eslint-enable */
  // 初始化
  setTableStyle();
  //
  window.onresize = function() {
    setTableStyle();
  };

  /* eslint-disable */
  // const html = $("span[data-ccodetext='code']").html();
  // new window.QRCode(document.getElementById("qrcodeImg"), {
  //   text: html,
  //   width: 99,
  //   height: 99,
  //   colorDark : "#000000",
  //   colorLight : "#ffffff",
  //   correctLevel : window.QRCode.CorrectLevel.H
  // });
  // 沒有數據顯示圖標  isHideTips: boolean。如果需要隱藏，傳 true

  // 複制粘貼
  $('[data-copy="ele"]').click(function (e) {
    if (!document.execCommand) {
      // 您的浏覽器不支持快速複制功能，請手動選擇需要複制的內容按下 ctrl + c 鍵複制。
      return myAlert.show(lang['MOB_COPY_NOT_SUPPORT']);
    }
    const text = $("#coinAddr").html();
    var transfer = document.getElementById('J_CopyTransfer');
    if (!transfer) {
      transfer = document.createElement('textarea');
      transfer.id = 'J_CopyTransfer';
      transfer.style.position = 'absolute';
      transfer.style.opacity = '0';
      transfer.style.width = '0';
      transfer.style.left = '0px';
      transfer.style.bottom = '0px';
      document.body.appendChild(transfer);
    }
    transfer.value = text || '';
    transfer.focus();
    transfer.select();
    try {
      var succ = document.execCommand('Copy', false, null);
      if (succ) {
        //複制成功，請通過 ctrl + v 鍵粘貼。
        myAlert.show(lang['MOB_COPY_SUCCESS']);
      } else {
        //您的浏覽器不支持快速複制功能，請手動選擇需要複制的內容按下 ctrl + c 鍵複制。
        myAlert.show(lang['MOB_COPY_NOT_SUPPORT']);
      }
    } catch (e) {
      if (e) {
        // 您的浏覽器不支持複制功能呢，請安裝最新版本浏覽器後再試試。
        // 移動端複製 失敗 提示
        myAlert.show(lang['MOB_COPY_NOT_SUPPORT']);
      }
    }
    transfer.blur();
  });

  // 幣篩選條件 (移動端不使用此方法)
  function showSelCoinName($this) {
    // return;
    // $("#coinList .sel-coin").removeClass("sel-coin");
    // const coinCode = $(this).data('coincode');
    // $(this).addClass("sel-coin");
    // $("#coinName").html($($this).html().trim() + " ");
  }

  //
  $('#coinList span[data-coincode]').click(function() {
    showSelCoinName(this);
  });
  $("#coinFlag span[data-flag]").click(function() {
    $("#coinFlag .sel-coin").removeClass("sel-coin");
    const coinFlag = $(this).data('flag');
    $(this).addClass("sel-coin");
  });

  // *********************
  //初始化
  function inisetdata() {
    var coin = $('.sel-coin').attr('data-coincode');
    getcoindata(coin, 'in', 'all');
    getcoinmessage(coin);
    $('span[data-ntcoin]').html($('.sel-coin').html().trim());
    getCoinAddress(coin);//獲取錢包地址
  }

  // 獲取幣列表數據
  function getcoindata(coin, coinType, type, startTime, endTime, page) {
    page == undefined ? page = 1 : page = page;
    http({
      url: '/ajax_user/coinRecord',
      type: 'POST',
      dataType: 'json',
      data: {
        coin: coin,
        coinType: coinType,
        type: type,
        startTime: startTime,
        endTime: endTime,
        page: page,
        size: '500'
      },
      success(req) {
        if (req.status && parseInt(req.status) === 1) {
          let { data } = req;
          let html = '';

          if (is(data.list, 'Array')) {
            // 有數據
            if (data.list.length > 0) {
              $('#tableNoData').hide();
              data.list.forEach((coin) => {
                html += `<tr>
                <td>${coin.id}</td>
                <td>${coin.time}</td>
                <td>${coin.txid}</td>
                <td>${coin.bid ? lang.tablePlatformIn : lang.tablePlatformOut }</td>
                <td>${coin.number}</td>
                <td>${coin.confirm}</td>
                <td class="${coin.status === '成功'
                    ? 'green-font'
                    : 'orange-font'}">${coin.status}</td>
                </tr>`;
              });
              $('#dataBody').html(html);
              // 重置表頭
              setTableStyle();
            } else {
              $('#tableNoData').show()
            }
          }
        }
      },
      error(err) {
        if (err)
          myAlert.show(lang['G ET_DATA_FAIL']);
      }
    });
  }
  // 生産二維碼
  function makeCodeImg(addrText) {
    // $("#qrcodeImg img").attr('src', `/Ajax_user/qrimages?text=${addrText}`);

    let img = document.createElement('img');
    img.src = `/Ajax_user/qrimages?text=${addrText}`;
    img.className = 'succ-img';
    img.onload = function() {
      $('#qrcodeImg').html('').append(img);
    }
    // await http({
    //   url: `/Ajax_user/qrimages?text=${addrText}`,
    //   method: 'GET',
    //   success(res) {
    //     console.log(res);
    //   }
    // });
    // $("#qrcodeImg").html("");
    // const html = $("span[data-ccodetext='code']").html();
    // new window.QRCode(document.getElementById("qrcodeImg"), {
    //   text: html,
    //   width: 99,
    //   height: 99,
    //   colorDark : "#000000",
    //   colorLight : "#ffffff",
    //   correctLevel : window.QRCode.CorrectLevel.H
    // });
  }
  // 獲取錢包地址
  function getCoinAddress(coin) {
    // $("#qrcodeImg").html("");
    $('#qrcodeImg img').attr('src', '/imgs/creating_qrCode.png').removeClass('succ-img');
    $('#coinAddr').html("");
    $("#addrShow").hide();
    // 生成中顯示
    $("#addrLoading").show();
    // 不能充幣顯示
    $("#canNotIn").hide();
    http({
      url: '/ajax_user/getCoinAddress',
      type: 'POST',
      dataType: 'json',
      data: {
        coin: coin,
      },
      success(req) {
        if(parseInt(req.status) === 1) {
          const { data } = req;
          if (!data['wallet']) {
            // $("#qrcodeImg").html("");
            $('#coinAddr').html("");
            // myAlert.show('獲取錢包地址失敗');
          } else {
            $("#addrShow").show();
            $("#addrLoading").hide();
            $('#coinAddr').html(data['wallet']);
            makeCodeImg(data['wallet']);
          }
        }
      },
      error(err) {
        if (err) {
          // alert('獲取錢包數據失敗');
        }
      }
    });
  }
  // 一句話
  function getcoinmessage(coin) {
    http({
      url: '/ajax_user/coinRecordMessage',
      type: 'POST',
      dataType: 'json',
      data: {
        coin: coin
      },
      success: function({ data }) {
        //
        if (is(data, "Object")) {
          if (data.message) {
            $('.u-riches').show().html(data.message);
            // no-tips-cond-time
            $('.u-riches').siblings(".cond-time").removeClass("no-tips-cond-time")
          } else {
            $('.u-riches').hide();
            $('.u-riches').siblings(".cond-time").addClass("no-tips-cond-time")
          }
        }
      },
      error: function(err) {
        // if (err) myAlert.show(err);
      }
    });
  }

  //chen
  //初始化
  function selCoin() {
    //
    var coin = $(this).attr('data-coincode');
    $('#dataBody').html('');
    let canCoinIn = $(this).data('instatus');
    // 是否可以充值
    if (canCoinIn === 0){
      getCoinAddress(coin);//獲取錢包地址
    } else {
      // 不能充值
      $("#addrLoading").hide();
      $("#addrShow").hide();
      $("#canNotIn").show();
      $("#qrcodeImg img").removeClass('succ-img').attr("src", '/imgs/can_not_in.png')
    }
    getcoinmessage(coin);
    $('span[data-ntcoin]').html($(this).html().trim());

    $('[name=coin]').val(coin);
    $(this).addClass("sel-coin");
    $("#qkBtn .sel-qk-btn").removeClass('sel-qk-btn');
    $('#allCoin').addClass('sel-qk-btn');
    getcoindata(coin, 'in', 'all');
  }
  // 點擊幣種
  // $('#coinList span').click(selCoin);

  //   function() {
  //   //
  //   var coin = $(this).attr('data-coincode');
  //   $('#dataBody').html('');
  //   let canCoinIn = $(this).data('instatus');
  //   // 是否可以充值
  //   if (canCoinIn === 0){
  //     getCoinAddress(coin);//獲取錢包地址
  //   } else {
  //     // 不能充值
  //     $("#addrLoading").hide();
  //     $("#addrShow").hide();
  //     $("#canNotIn").show();
  //     $("#qrcodeImg img").removeClass('succ-img').attr("src", '/imgs/can_not_in.png')
  //   }
  //   getcoinmessage(coin);
  //   $('span[data-ntcoin]').html($(this).html().trim());
  //
  //   $('[name=coin]').val(coin);
  //   $(this).addClass("sel-coin");
  //   $("#qkBtn .sel-qk-btn").removeClass('sel-qk-btn');
  //   $('#allCoin').addClass('sel-qk-btn');
  //   getcoindata(coin, 'in', 'all');
  // });
  // 點擊全部
  $('#allCoin').click(function() {
    $("#qkBtn .sel-qk-btn").removeClass('sel-qk-btn');
    $(this).addClass("sel-qk-btn");
    var coin = $('.sel-coin').attr('data-coincode');
    $('#dataBody').html('');
    $('[name=type]').val('all');
    getcoindata(coin, 'in', 'all');
  });
  // 點擊今天
  $('#todayCoin').click(function() {
    $("#qkBtn .sel-qk-btn").removeClass('sel-qk-btn');
    $(this).addClass("sel-qk-btn");
    var coin = $('.sel-coin').attr('data-coincode');
    $('#dataBody').html('');
    $('[name=type]').val(1);
    getcoindata(coin, 'in', 1);
  });
  // 點擊30天
  $('#monthCoin').click(function() {
    $("#qkBtn .sel-qk-btn").removeClass('sel-qk-btn');
    $(this).addClass("sel-qk-btn");
    var coin = $('.sel-coin').attr('data-coincode');
    $('#dataBody').html('');
    $('[name=type]').val(2);
    getcoindata(coin, 'in', 2);
  });
  // 點擊篩選
  $('#timeselect').click(function() {
    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    $('[name=type]').val(3);
    $('[name=startTime]').val(startTime);
    $('[name=endTime]').val(endTime);
    if (startTime == '') {
      myAlert.show(lang["START_TIME"]); //請選擇開始時間
      return false;
    }
    if (endTime == '') {
      myAlert.show(lang["END_TIME"]); //請選擇結束時間
      return false;
    }
    if (startTime >= endTime) {
      myAlert.show(lang['START_GT_END']); //開始時間不能大于等于結束時間
      return false;
    }
    $('#dataBody').html('');
    var coin = $('.sel-coin').attr('data-coincode');
    getcoindata(coin, 'in', 3, startTime, endTime);
  });
  // 點擊重置
  $('#reset').click(function() {
    var coin = $('.sel-coin').attr('data-coincode');
    $('#dataBody').html('');
    $("#startTime").val('');
    $("#endTime").val('');
    $('[name=type]').val('all');
    $("#qkBtn .sel-qk-btn").removeClass('sel-qk-btn');
    $('#allCoin').addClass('sel-qk-btn');
    getcoindata(coin, 'in', 'all');
  });
  // 點擊導出excel
  $('#excel').click(function() {
    var coin = $('[name=coinex]').val();
    var coinType = $('[name=coinType]').val();
    var type = $('[name=type]').val();
    var startTime = $('[name=startTimeex]').val();
    var endTime = $('[name=endTimeex]').val();
    location.href = '/user/coinRecordCsvOut?coin=' + coin + '&coinType=' + coinType + '&type=' + type + '&startTime=' + startTime + '&endTime=' + endTime;
  });
  // 獲取路由參數
  function GetQueryString(name) {
    const reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  // 默認選擇全部篩選
  $('#allCoin').addClass("sel-qk-btn");
  // 是否通過賬戶中心點擊跳轉過來
  const coin = GetQueryString('coin');
  if (coin) {
    $('#dataBody').html('');
    $(`#coinList .sel-coin`).removeClass("sel-coin");
    $(`#coinList span[data-coincode="${coin}"]`).addClass("sel-coin");
    // 模拟点击选择的币 点击事件
    $("#changeCoin").html(coin);
    $('#coinList span.sel-coin').click();
    selCoin.call($(`#coinList .sel-coin`)[0]);
  } else {
    inisetdata();
  }
  // 切換幣列表
  selCoinList(selCoin);

  // $("#changeCoin").on("touchstart", function(e) {
  //   e.stopPropagation && e.stopPropagation();
  //   // 切换币列表显示状态
  //   let $option = $("#coinList");
  //   if ($option.is(":visible")) {
  //     $("#coinList").hide();
  //
  //   } else {
  //     $("#coinList").show();
  //   }
  // })
  // //
  // // 判断是否滚动
  // let isMoveTouch = false;
  // $("#coinList").on('touchmove',function() {
  //   isMoveTouch = true;
  // });
  // $("body").on("touchend", function(e) {
  //   e.stopPropagation && e.stopPropagation();
  //   // 启动 点击 开关
  //   isMoveTouch = false;
  // });
  // $("#coinList span").on("touchend", function() {
  //   console.log(isMoveTouch);
  //   if (isMoveTouch) return;
  //   //
  //   let coinName = $(this).html().trim();
  //   // 设置选择币结果
  //   $("#changeCoin").val(coinName);
  //   // 清除之前选择的币的样式
  //   $(this).siblings(".sel-coin").removeClass("sel-coin");
  //   // 切换币源， 刷新页面数据
  //   selCoin.call(this);
  //   // 隐藏币 列表
  //   $("#coinList").hide();
  //   // 启动 点击 开关
  //   isMoveTouch = false;
  // });
  //
  // // 选择 币 切换币来源
  // $("#coinOptions p").on("touchstart", function() {
  //   isMoveTouch = false;
  // });

  // 表格滚动事件
  $("[data-tbody]").on("scroll", function() {
    let { left } = $(this).find('table').offset();
    let tHead = $(this).siblings("[data-thead]").offset({ left: left });
  });
});
