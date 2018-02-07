// 共享pc 样式
import "@/styles/userCenter/authen.scss";
import '@/styles/userCenter/sureDialog.scss';
// import nav from '@/components/nav';
import activeNav from '@/components/userNav.js';
import Tips from '@/tools/alert/alert.js';
import dialog from '@/tools/dialog';
import is from '@/tools/is';
import getLanguagePack from '@/components/tradeLanguagePack';
import http from '@/tools/http';
// 移动端样式
import '@/styles/mob/theme.scss';
import "@/styles/mob/fun.scss";
import "@/styles/mob/nav.scss";
// import "@/styles/mob/config.scss";
import "@/styles/mob/user.realinfo.scss";
import '@/styles/mob/alert.scss';
import navMob from "@/components/mo.nav";
import lrz from "lrz";
import FastClick from 'fastclick';

$(document).ready(function() {
  FastClick.attach(document.body);
  // 初始化導航
  navMob();

  // 顯示退出登錄按鈕
  $("#logoutBTN").removeClass("hide-dom");
  //
  let language = getLanguagePack() || {
    BTN_SURE: "確定",
    SUBMIT_SUCC: "實名認證資料提交成功，審核時間為1~3個工作日。",
    PIC_FRONT: "正面照片未選擇",
    PIC_BACK: "背面照片未選擇",
    PIC_HAND: "手持照片未選擇",
    FILE_READER_NO: "抱歉，你的浏覽器不支持 FileReader,請使用谷歌(chrome)或火狐(firefox)浏覽器操作！",
    PIC_SIZE_MAX: "照片大小不能超過2M，請重新上傳！",
    PIC_FORMAT_ERROR: "證件圖片支持jpg/jpeg/png格式,暫時還不支持其他格式。",
    PICK_PIC: "選擇圖片",
    PIC_FULL: "證件照片需要上傳完整"
  };
  // 實名狀態  $user=='空'(待認證) 1(待審核) 2(已認證) 3(審核失敗)
  const status = $("[data-status]").data('status');
  const errMsg = $('[data-errmsg]').data('errmsg');
  // 当前用户实名状态
  let authState = $("#authStatus").attr("data-austatu");
  // 提交數據
  let postData = {};
  // 提交成功 提示彈框
  function postSucceDialog(msg, callback) {
    const template = `<div class="au_dialog mob_au_dialog" id="mobAuto">
      <u class="close_btn" data-diclose="btn"></u>
      <div>
        <p>${msg}</p>
        <button class="submit_btn" data-diclose="btn">${language['BTN_SURE']}</button>
      </div>
    </div>`;
    // 清空顯示內容
    dialog.html(template);
    // dialog.html()
    // dialog.css({ width: "452px", height: "274px", borderRadius: "8px", position: "relative" });
    dialog.show(true);
    $('[data-diclose="btn"]').click(function() {
      // 重定向
      if (callback && is(callback, "Function")) {
        callback();
      }
      dialog.hide(true);
    });
  }
  // postSucceDialog('test');
  // 判断当前页面是否是提交成功页面
  if (window.location.href.indexOf("success") > -1) {
    //'實名認證資料提交成功，審核時間為1~3個工作日。'
    postSucceDialog(language['SUBMIT_SUCC'], function() {
      window.location.href = '/user/realinfo';
    });
  } else {
    $("#realForm input").on("change", function (e) {
      // 阻止冒泡
      e.stopPropagation && e.stopPropagation();
      // 阻止默认 行为
      e.preventDefault && e.preventDefault();
      $('button[data-submit="form"]').removeAttr('disabled');
    });
  }
  // 錯誤 提示
  if (errMsg) {
    postSucceDialog(errMsg);
  }
  // 提交成功彈框提示
  const myAlert = new Tips("");
  // myAlert.show(language['FILE_READER_NO']);
  // myAlert.setHeader("提示");
  activeNav();
  let submit_busy = false;
  // 實名 校驗正則
  const regs = {
    name: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5·]{0,98}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,98}[a-zA-Z]{1}$)/,
    idcard: {
      1: {
        // id15: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/,
        id18: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      },
      2: /^[a-zA-Z\d\-\.]{1,20}$/,
      // 2: /^(P[.]\d{7}|G\d{8}|S\d{8}|S[.]\d{7}|D\d{7,8}|1[4,5]\d{7})$/
    },
    imgFile: {

      frontFace: {
        result: '',
        tips: language['PIC_FRONT'] //正面照片未選擇
      },
      backFace: {
        result: '',
        tips: language['PIC_BACK'] //背面照片未選擇
      },
      handkeep: {
        result: '',
        tips: language['PIC_HAND'] //手持照片未選擇
      }
    },
    msg: 0,
    isChangeFile: false
  };
  // 是否 注册 成功 提示
  if (status === 1) {
    regs.msg = 3;
    $('input[type="file"]').change(function () {
      regs.isChangeFile = true;
    });
  }
  // 實名
  if ($("[data-pname]").data("")) {
    if (typeof(FileReader) === 'undefined') {
      // 抱歉，你的浏覽器不支持 FileReader,請使用谷歌(chrome)或火狐(firefox)浏覽器操作！
      myAlert.show(language['FILE_READER_NO']);
    }
  }
  const imgMaxSize = 2097152;
  function readFile() {
    const imgDom = $(this).siblings('img');
    console.log(this.files);
    const fileBit = this.files[0].size;
    // 圖片大小判斷 pc 端使用 *********
    // if (fileBit) {
    //   if (fileBit > imgMaxSize) {
    //     // 照片大小不能超過2M，請重新上傳！
    //     return myAlert.show(language['PIC_SIZE_MAX']);
    //   }
    // }
    // console.log(e);

    // 圖片類型判斷
    const fileType = this.files[0].type;
    if (!fileType.match(/(jpg|jpeg|png)/g)) {
      // 證件圖片支持jpg/jpeg/png格式,暫時還不支持其他格式。
      return myAlert.show(language['PIC_FORMAT_ERROR']);
    }

    const file = this.files[0];
    //判斷是否是圖片類型
    if (!/image\/\w+/.test(fileType)) {
      // 證件圖片支持jpg/jpeg/png格式,暫時還不支持其他格式。
      myAlert.show(language['PIC_FORMAT_ERROR']);
      return false;
    }

    // 压缩 图片
    lrz(this.files[0], {
      width: 800,
      quality: 0.6
    })
    .then(function(rst) {
      if (rst.base64Len > imgMaxSize) {
        // 照片大小不能超過2M，請重新上傳！
        myAlert.show(language['PIC_SIZE_MAX']);
      } else {
        // 設置 預覽圖 會變形
        imgDom.attr('src', rst.base64).css({zIndex: '20', width: "auto"}).removeClass('no-src');
        // 隐藏原来的背景
        $(imgDom).parents('.file_par').addClass('succ-file-bg');
        // 標記
        imgDom.siblings('b[data-del="img"]').show();
        imgDom.siblings('p[data-select="btn"]').addClass('correct_statu').find('span').text('');
      }
    })
    .catch(function (err) {
        // 万一出错了，这里可以捕捉到错误信息
        if (err) {
          myAlert.show(language['PIC_SIZE_MAX']);
        }
    });

    // const reader = new FileReader();
    // reader.readAsDataURL(file);

    // 压缩 图片
    /* eslint-disable */
    //reader.onload = function(e) {
      // console.log(e);
      // // 压缩
      // lrz(this.result, {
      //   width: 800,
      //   quality: 0.3
      // })
      // .then(function(rst) {
      //   if (rst.base64Len > imgMaxSize) {
      //     // 照片大小不能超過2M，請重新上傳！
      //     myAlert.show(language['PIC_SIZE_MAX']);
      //   } else {
      //     // 設置 預覽圖 會變形
      //     imgDom.attr('src', rst.base64).css({zIndex: '20', width: "auto"}).removeClass('no-src');
      //     // 隐藏原来的背景
      //     $(imgDom).parents('.file_par').addClass('succ-file-bg');
      //     // 標記
      //     imgDom.siblings('b[data-del="img"]').show();
      //     imgDom.siblings('p[data-select="btn"]').addClass('correct_statu').find('span').text('');
      //   }
      // })
      // .catch(function (err) {
      //     // 万一出错了，这里可以捕捉到错误信息
      //     if (err) {
      //       myAlert.show(language['PIC_SIZE_MAX']);
      //     }
      // })
    //};
  }
  // 下拉列表
  $('[data-select="cardtype"]').click(function() {
    const selectDom = $(this);
    selectDom.val(1);
    const data = selectDom.data("select");
    const targetList = $(`#${data}`);
    if (targetList.is(":visible")) {
      targetList.hide();
    } else {
      targetList.show();
      targetList.find("div").click(function(e) {
        const optionData = $(e.target).data("value");
        selectDom.val(optionData);
        targetList.hide();
      });
    }
  });
  // 更改证件类型
  $("#realForm select").on("change", function(e) {
    // 阻止冒泡
    e.stopPropagation && e.stopPropagation();
    // 阻止默认 行为
    e.preventDefault && e.preventDefault();
    // 解除禁用按钮
    $('button[data-submit="form"]').removeAttr('disabled');
  })
  // 選擇圖片
  $('input[data-file="cert"]').change(readFile);
  // 刪除 圖片
  $('b[data-del="img"]').click(function(e) {
    // 阻止冒泡
    e.stopPropagation && e.stopPropagation();
    // 阻止默认 行为
    e.preventDefault && e.preventDefault();
    //
    var target = $(this);
    target.siblings('img').attr('src', '').css({ zIndex: '1' }).addClass('no-src');;
    target.siblings('input').val("").removeAttr('disabled', 'disabled');
    target.hide();
    target.siblings('p[data-select="btn"]').removeClass('correct_statu').find('span').text(language['PICK_PIC']); //選擇圖片
    target.siblings('img').data('src', 0);
    target.parents(".file_par").removeClass('succ-file-bg');

  });
  // 提示框
  function warnTips(thisInput, isCorrect, isSubmit) {
    const tipsElm = $(thisInput).siblings("[data-tips]");
    let tipsMsg = "";
    //
    if (isCorrect) {
      tipsMsg = tipsElm.data("msg");
    } else {
      tipsMsg = tipsElm.data("err");
    }
    // 驗證失敗 內容不為 空
    if ( !isCorrect) {
      if (isSubmit || $(thisInput).val()) {
        // 驗證失敗 提示 sjdlfkj
        tipsElm.html(tipsMsg).show().addClass("input-tips-err");
      }
    } else {
      tipsElm.removeClass("input-tips-err").hide();
    }
  }

  // 校驗 input 內容是否正確
  function checkInput(input, isSubmit) {
    const $input = $(input);
    const val = $input.val();
    const inputName = $input.attr("name");
    const inputType = $input.attr("type");
    let result = false;
    if (inputType === 'text') {
      switch (inputName) {
        case 'name':
          result = regs[inputName].test(val);
          //
          if (!result && isSubmit) {
            warnTips(input, result, isSubmit);
          }
          break;
        case 'idcard': {
          const type = $('[name="cardtype"]').val();
          if (type === '1') {
            // \u4e00-\u9fa5]
            if (regs[inputName][type].id18.test(val)) {
              result = true;
            }
          } else {
            result = regs[inputName][type].test(val);
          }
          // 提示框
          if (!result && isSubmit) {
            warnTips(input, result, isSubmit);
          }
          break;
        }
        default:
          result = false;
      }
    } else if (inputType === 'file') {
      result = true;
    }
    return result;
  }
  // 判断图片是否已经完成
  function imgIsComplete() {
    const imgs = [...$("#realForm img")];
    let result = true;
    // 判斷圖片是否有值
    imgs.forEach(function(img) {
      if (!$(img).attr('src')) {
        result = false;
      }
    });
    // 判斷 input 是否有值
    const inputs = [...$('#realForm input[type="file"]')];
    inputs.forEach((input) => {
      if (!$(input).val()) {
        result = false;
      }
    });
    return result;
  }
  //
  imgIsComplete();

  // 獲取所有form 表單 input
  function getFormInput() {
    // 按钮禁用时，不允许提交
    if ($("button[type=submit]").attr("disabled")) return;
    if (submit_busy) return;
    submit_busy = true;
    let isComplete = true;
    // 获取所有 input 值
    const inputs = [...$("#realForm input")];
    inputs.forEach((input) => {
      let $input = $(input);
      // 输入框未完成
      if (!checkInput(input, 'isSubmit')) {
        isComplete = false;
        submit_busy = false;
      } else {
        // 把输入值 储存到提交对象中
        if ($input.attr('type') !== 'file') {
          postData[$input.attr('name')] = $input.val();
        }
        // 图片
        else {
          let imgSrc = $input.siblings('img').attr('src');
          // 判断是否为 base64 格式
          if (imgSrc && imgSrc.indexOf('data:image') > -1) {
            postData[$input.attr('data-mobname')] = imgSrc;
          }
          // 提交空字符串
          else {
            postData[$input.attr('data-mobname')] = "";
          }
        }
      }
    });

    // 不是注册成功
    if (status !== 1 && !imgIsComplete()) {
      postSucceDialog(language['PIC_FULL']);
      isComplete = false;
      submit_busy = false;
    }
    // 如果有更改图片，图片必须全部更改，否则提示
    if (status === 1 && regs.isChangeFile) {
      if (!imgIsComplete()) {
        postSucceDialog(language['PIC_FULL']);
        isComplete = false;
        submit_busy = false;
      }
    }
    return isComplete;
  }

  // input fouce
  $("#realForm input[type='text']").focus(function() {
    const tipsElm = $(this).siblings("[data-tips]");
    let tipsMsg = "";
    if ($(this).val()) {
      if (checkInput(this)) {
        tipsMsg = tipsElm.data("msg");
      } else {
        tipsMsg = tipsElm.data("err");
      }
    } else {
      tipsElm.removeClass('input-tips-err');
      tipsMsg = tipsElm.data("msg");
    }
    $(this).siblings("[data-tips]").html(tipsMsg).show();
  });

  $("#realForm input[type='text']").blur(function() {
    const isCorrect = checkInput(this);
    // 為空
    if (!$(this).val()) {
      warnTips(this, true);
    } else {
      warnTips(this, isCorrect);
    }
  });
  // 實名提交檢驗
  $("#realForm").on("submit", function() {
    let formComplete = getFormInput();
    if (formComplete) {
      let $select = $("#realForm select");
      // 获取证件类型值
      postData[$select.attr('name')] = $select.val();
      console.log(postData);
      // ''(待认证) 1(待审核) 2(已认证) 3(审核失败)
      let url;
      // 待认证
      if (authState == '' || authState == '0') {
        url = "/ajax_Auth/phone";
      }
      // 1(待审核)
      else if (authState == "1") {
        url = "/ajax_Auth/mobilephone";
      }
      if (authState == "1" && regs.isChangeFile) {

      }
      // 提交数据
      http({
        url: url,
        method: "POST",
        data: postData,
        success({ status, data, msg }) {
          // 实名成功
          if (parseInt(status) === 1) {
            $(".mob_dialog .dialog_content").css({"background": "transparent", "margin": "0"});
            // '實名認證資料提交成功，審核時間為1~3個工作日。'
            postSucceDialog(language['SUBMIT_SUCC'], function() {
              // 防止重复提交
              submit_busy = true;
              window.location.href = '/user/realinfo';
            });
          }
          // else {
          //   postSucceDialog(msg);
          // }
          submit_busy = false;
        }
      });
    }

    return false;
  });
  // (function() {
  //   // $("head style").eq(1).remove();
  //   // dialog.css({ width: "452px", height: "274px", borderRadius: "8px", position: "relative" });
  //   $(".mob_dialog .dialog_content").css({"background": "transparent", "margin": "0"});
  //   postSucceDialog(language['SUBMIT_SUCC']);
  // })();
  // postSucceDialog(language['SUBMIT_SUCC'], function() {
  //   window.location.href = '/user/realinfo';
  // });
});
