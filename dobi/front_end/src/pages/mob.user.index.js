import '@/styles/common/index.scss';
import '@/styles/userCenter/index.scss';
import "@/styles/userCenter/userDefault.scss";
import '@/styles/userCenter/sureDialog.scss';
import nav from '@/components/nav';
import activeNav from '@/components/userNav.js';
import http from '@/tools/http';
import is from '@/tools/is';
import DialogBox from '@/tools/dialogBox/dialogBox';
import dialog from '@/tools/dialog';
// import HoverWin from '@/components/hoverWin';
import getLanguagePack from '@/components/tradeLanguagePack';
import chkhttpLang from '@/tools/chgHpLg';
import resetPwd from '@/pcAndMob/resetTradePwd';

// import "@/styles/mob/config.scss";
import "@/styles/mob/nav.scss";
import '@/styles/mob/alert.scss';
import "@/styles/mob/user.reset.scss";
import "@/styles/mob/user.index.scss";
import navMob from "@/components/mo.nav";
import FastClick from 'fastclick';

// process.env.NODE_ENV
$(document).ready(function() {
  FastClick.attach(document.body);
  // 切換 請求處理 語言包
  chkhttpLang("#baseLang", http);
  let phpLang = getLanguagePack() || {
    sureBtn: '確定',
    tradePwdti: '您尚未設置交易密碼，請先設置！（交易密碼是在多比進行交易時需要輸入的密碼，不同于登錄密碼。為確保您的財産安全，請牢記交易密碼，防止丟失!）',
    setTradePwd: "設置交易密碼",
    setTradePwdPHold: "請輸入交易密碼",
    setPwdAgain: "再次輸入密碼",
    setPwdAgainPHold: "請確認交易密碼",
    saveTradePwd: "保存",
    openSwitch: "開",
    closedSwitch: "關",
    saveSucc: "保存成功！",
    saving: "保存",
    warnTips: {
      pwd1: {
        msg: "請輸入您的交易密碼",
        err: "交易密碼長度需在6-20個字符之間"
      },
      pwd2: {
        msg: "請輸入您的交易密碼",
        err: "重複密碼長度需在6-20個字符之間",
        noSame: "兩次輸入的密碼不一致"
      }
    }
  };
  // 移动端 导航
  navMob();
  //
  nav();
  activeNav();
  // 提交成功 提示彈框
  function postSucceDialog(msg, callback) {
    // 清除默认样式
    $("head style").eq(1).remove();
    const template = `<div class="au_dialog">
      <u class="close_btn" data-diclose="btn"></u>
      <div>
        <p>${msg}</p>
        <button class="submit_btn" data-diclose="btn">${phpLang.sureBtn}</button>
      </div>
    </div>`;
    // 不初始化样式
    // dialog.initStyle = 'noInitStyle';
    // 清空顯示內容
    dialog.html(template);
    // dialog.html()
    dialog.css({ position: "relative" });
    dialog.addClass("mob-pwd-succ");
    dialog.show(true);
    $('[data-diclose="btn"]').click(function() {
      // 重定向
      if (callback && is(callback, "Function")) {
        callback();
      }
      dialog.hide(true);
    });
  }
  // 彈框 模板
  const myBox = new DialogBox();
  myBox.tryCallback = function() {
    $("#sectionBody").show();
  }
  const setTradePassWordTpls = `<div id="surePwd" class="trade-pwd"><div class="dialog-title">${phpLang.setTradePwd}</div>
  <div class="top-tips">${phpLang.tradePwdti}</div>
  <div class="form-tab first-mar">
    <span>${phpLang.setTradePwd}</span>
    <input type="password" minlength="6" maxlength="20" name="pwd1" placeholder="${phpLang.setTradePwdPHold}" />
    <p class="warn-tips-lf" data-tips="pwd1"></p>
  </div>
  <div class="form-tab">
    <span>${phpLang.setPwdAgain}</span>
    <input type="password" minlength="6" maxlength="20" name="pwd2" placeholder="${phpLang.setPwdAgainPHold}" />
    <p class="warn-tips-lf" data-tips="pwd2"></p>
  </div>
  <div class="form-tab"><button class="box-submit-btn" id="tradePassWord">${phpLang.saveTradePwd}</button></div></div>`;

  // 設置交易密碼方法
  function setTradePwd() {
    myBox.addClass("mob-tr-pwd");
    // 隐藏 body 内容
    $("#sectionBody").hide();
    myBox.show(setTradePassWordTpls, function() {
      // 獲取 input 框值
      let isBusy = false;
      let warnTips = {
        pwd1: {
          msg: "請輸入您的交易密碼",
          err: "交易密碼長度需在6-20個字符之間"
        },
        pwd2: {
          msg: "請輸入您的交易密碼",
          err: "重複密碼長度需在6-20個字符之間",
          noSame: "兩次輸入的密碼不一致"
        }
      };

      if (phpLang) {
        warnTips = phpLang.warnTips;
      }
      const inputReg = /^([0-9a-zA-Z]{6,20})$/;
      //
      function chkInput(val) {
        let result = true;
        if (val.length < 6 || val.length > 20) {
          result = false;
        }
        if (!inputReg.test(val)) {
          result = false;
        }
        return result;
      }
      $("#surePwd input").on('focus', function() {
        const $input = $(this);
        $input.siblings('p[data-tips]').removeClass('err-tips');
        const name = $input.attr("name");
        $input.siblings('p[data-tips]').html(warnTips[name].msg).show();
      });
      $("#surePwd input").on('blur', function() {
        const $input = $(this);
        const name = $input.attr('name');
        if ($input.val().trim()) {
          if (!chkInput($input.val())) {
            $input.siblings('p[data-tips]').html(warnTips[name].err).addClass('err-tips').show();
          } else if (name === 'pwd2') {
            if ($input.val() !== $('input[name="pwd1"]').val()) {
              $input.siblings('p[data-tips]').html(warnTips[name].noSame).addClass('err-tips').show();
            }
          } else {
            $input.siblings('p[data-tips]').hide();
          }
        } else {
          $input.siblings('p[data-tips]').hide();
        }
      });
      //
      $("#tradePassWord").click(() => {
        if (isBusy) return;
        isBusy = true;
        $(this).addClass('on-submiting').text(`${phpLang.saving}...`);
        const postData = {};
        let isComplete = true;
        const inputs = [...myBox.content.find('input')];
        // 驗證是否為空
        inputs.forEach((input) => {
          const $input = $(input);
          const name = $input.attr('name');
          const val = $input.val().trim();
          if (val) {
            postData[name] = val;
          } else {
            $(input).siblings('p[data-tips]').html(warnTips[name].err).addClass('err-tips').show();
            isComplete = false;
            isBusy = false;
          }
        });
        // 驗證是否 一致
        if (postData['pwd1'] !== postData['pwd2']) {
          isComplete = false;
          isBusy = false;
          $('[data-tips="pwd"]').show();
          // return false;
        }
        // 通過校驗
        if (isComplete) {
          http({
            url: '/ajax_user/setTradePwd',
            method: "POST",
            data: postData,
            success(data) {
              isBusy = false;
              myBox.hide();
              if (parseInt(data.status) === 1) {
                // '保存成功！'
                postSucceDialog(phpLang.saveSucc, function() {
                  // 清除路由參數 刷新頁面
                  window.location.href = '/user';
                });
              }
              // 显示 body 内容
              $("#sectionBody").show();
            },
            error(err) {
              // 显示 body 内容
              $("#sectionBody").show();
              isBusy = false;
              if (err) {
                myBox.hide();
              }
            }
          });
        }
      });
    });
  }
  // ****
  // setTradePwd();
  // postSucceDialog(phpLang.saveSucc);
  // 交易中心跳過來，設置交易密碼
  if (location.href.indexOf('set=tradepwd') > -1) {
    setTradePwd();
    //
  }
  // 設置交易密碼
  $('[data-tradepwd="pwd"]').click(function() {
    // 交易密碼 彈框
    setTradePwd();
  });
  // 隱藏彈框方法
  // myBox.hide();
  // 重置表格顯示
  function setTableStyle(tableNum) {
    const tarEle = $(`[data-table="${tableNum}"]`);
    // copy thead
    if (tarEle.find(`[data-thead='${tableNum}']`).length === 0) {
      // 創建 head div 和 table
      const myTbHead = document.createElement('div');
      myTbHead.id = "tHead";
      myTbHead.className = "t-head";
      myTbHead.setAttribute("data-thead", tableNum);
      myTbHead.innerHTML = "<table></table>";
      // 添加到 當前表格前面
      tarEle.eq(0).prepend(myTbHead);
      // 複制 表頭到 新建的 表格
      tarEle.find(`[data-thead="${tableNum}"] table`).append(tarEle.find("[data-tbody] thead").clone());
      // set style
      const tbodyTr = tarEle.find("[data-tbody] tbody tr").eq(0);
      const tbodyTds = [...tbodyTr.find("td")];
      const tHeadTds = tarEle.find("[data-thead] thead tr").eq(0).find("td");
      tbodyTds.forEach((td, key) => {
        const bodyTdWidth = $(td).css("width");
        tHeadTds.eq(key).css("min-width", bodyTdWidth);
      });
    }
    // 滾動情況
    if (parseInt($("#tBody").css("height")) < parseInt($("#tBody table").css("height"))) {
      $("#tHead table td:last-child").css("paddingRight", "45px");
    }
  }
  // 初始化
  setTableStyle(1);
  setTableStyle(2);
  // 表格滚动事件
  // $("[data-tbody]").on("scroll", function() {
  //   let { left } = $(this).find('table').offset();
  //   let tHead = $(this).siblings("[data-thead]").offset({ left: left });
  // });
  // 顯示有資金幣種  開 關 操作
  function isShowTable(sw) {
    if (sw) { // 開 操作
      $("#swichTable .no-val").show();
    } else { // 關 操作
      $("#swichTable .no-val").hide();
    }
  }
  // 開關按鈕
  $("[data-swich='btn']").click(function () {
    const onState = { right: "0.8rem" };
    const offState = { right: "0.05333rem" };
    if ($(this).data("state") === 'on') {
      isShowTable(false);
      // 開
      $(this).find('span').text(phpLang.openSwitch);
      // $(this).addClass("swith-on");
      $(this).css({ background: "#01b21a", textAlign: "right" }).find('b').animate(onState, () => {
        $(this).data("state", "off");
      });
    } else {
      isShowTable(true);
      // 關
      $(this).find('span').text(phpLang.closedSwitch);
      $(this).css({ background: "#d2d2d2", textAlign: "left" }).find('b').animate(offState, () => {
        $(this).data("state", "on");
      });
    }
  });
  // 點擊 提幣按鈕 轉跳
  function coinOut($this) {
    const coin = $($this).data("coin");
    $("#coinOutForm input[name='coin']").val(coin);
    $("#coinOutForm").submit();
  }
  $("#swichTable [data-coinout='coinout']").click(function() {
    coinOut(this);
  });
  $("#notUseCoin [data-coinout='coinout']").click(function() {
    coinOut(this);
  });
  // 點擊充幣按鈕
  function coinIn($this) {
    const coin = $($this).data("coin");
    window.location.href = `/user/coinin?coin=${coin}`;
  }
  $("#swichTable [data-coinin]").click(function() {
    coinIn(this);
  });
  $("#notUseCoin [data-coinin]").click(function () {
    coinIn(this);
  });
  // 显示人民币
  // const myHover = new HoverWin($('[data-tormb]'), 'tormb');
  // function addHoverWin($elem, attr, direction) {
  //   $($elem).hover(function() {
  //     myHover.setHover(this, attr, direction);
  //   });
  //   $($elem).mouseleave(function() {
  //     myHover.hide();
  //   });
  // }

  var rmbPrice = 0;
  //获取人民币汇率
  const getRmbRatio = new Promise(function(resolve, reject) {
    var rmbRatioGetter = {
      url: '../ajax_trade/btcprice',
      type: 'get',
      success(res) {
        if (res && res. status == 1) {
          rmbPrice = res.data;
          window.rmbPrice = rmbPrice;
        } else {
          window.rmbPrice = '';
        }
        setTimeout(function() { $.ajax(rmbRatioGetter); }, 60*1000);
        resolve();
      },
      error(err) {
        rmbPrice = 0;
        reject();
        //TODO    無法獲取人民幣彙率
      }
    };
    $.ajax(rmbRatioGetter);
    return rmbPrice;
  });
  //计算tbody下的tr to-rmb属性
  function calcRmb($tbody) {
    const $trs = $tbody.find('tr');
    [...$trs].forEach((tr) => {
      const $tr = $(tr);
      const $availName = $tr.find('td:eq(0)'); //币种名称
      const $availCoin = $tr.find('td:eq(1)'); //可用余额DOM
      const $lockCoin = $tr.find('td:eq(2)'); //冻结额DOM
      const $totalCoin = $tr.find('td:eq(3)'); //总额DOM
      const price = $tr.attr('data-price');
      // console.log(price + "   " + $availCoin.text());
      if($availName.text() === "BTC"){
        $availCoin.attr('data-tormb', rmbPrice * $availCoin.text());
        $lockCoin.attr('data-tormb', rmbPrice * $lockCoin.text());
        $totalCoin.attr('data-tormb', rmbPrice * $totalCoin.text());
      }else{
        $availCoin.attr('data-tormb', price * rmbPrice * $availCoin.text());
        $lockCoin.attr('data-tormb', price * rmbPrice * $lockCoin.text());
        $totalCoin.attr('data-tormb', price * rmbPrice * $totalCoin.text());
      }

    });
  }
  // 重置交易密碼
  $('[data-reset="tradepwd"]').click(function() {
    // 交易密碼 彈框
    resetPwd.setTradePwd = true;
  });
  // 获取到人民币汇率后再赋data-tormb
  // getRmbRatio.then(function(resolve) {
  //   const $allAssets = $('#allAssets');
  //   const assetsNum = $allAssets.text().replace(/[^\d.]/, '');
  //   $allAssets.attr('data-tormb', rmbPrice * assetsNum);
  //   calcRmb($('div[data-table="1"] tbody'));
  //   //总资产添加人民币悬浮框
  //   addHoverWin($('#allAssets'), 'tormb', 'top');
  //   //表格tr添加人民币悬浮框
  //   addHoverWin($('div[data-table="1"] tbody tr td'), 'tormb', 'left');
  // }).catch(function(reject) {
  //
  // })

});
