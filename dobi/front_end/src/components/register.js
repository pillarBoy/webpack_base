import "@/styles/common/register.scss";
import is from '@/tools/is';
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
/* eslint-disable */

let encrypt = new JSEncrypt();

// console.log(encrypt.encrypt({data: {a: '12354', b: "8877"}}));

export default function(callbackFg, lang) {
  var language = {
    tel_msg: '手機號格式不正確',
    tel_empty: '請輸入手機號碼',
    pwd_msg: '登錄密碼不能小于6位字符',
    pwd_empty: '密碼不能為空',
    surePwd_msg: '兩次輸入的密碼不一致',
    surePwd_empty: '確認密碼不能為空',
    imgCode_msg: '驗證碼不能為空',
    telCode_msg: '短信驗證碼不能為空',
    captcha_empty: '請輸入圖形驗證碼',
    captcha_msg: '位數不正確',
    vcode_empty: '請輸入手機驗證碼',
    vcode_msg: '位數不正確',
    validate_default_msg: '請完善表單',
    getMsgAfterTime: "s後重新獲取",
    getVoiceAfterTime: "s後獲取語音驗證碼",
    canGet: "可以在",
    pickUpPhone: "請注意收聽來電",
    reGetMsg: "重新獲取驗證碼",
    clickAndGet: "點擊獲取",
    voiceCode: "語音驗證碼",
    getCode: "獲取驗證碼",
    form_tel_empty: "請輸入您的常用手機號碼",
    form_pwd_less: "登錄密碼不能小于6位字符",
    form_pwd_space: "登錄密碼不能使用空格",
    form_pwd_empty: "請輸入您的登錄密碼",
    form_pwd_strength_good: "您的密碼很安全",
    form_pwd_strength_midd: "安全強度適中，可以使用三種以上的組合來提高安全性",
    form_pwd_strength_weak: "有被盜風險，請使用字母、數字或符號兩種及以上組合",
    form_surepwd_msg: "請確認您的登錄密碼",
    form_captcha_empty: "請輸入圖形驗證碼",
    form_captcha_refresh: "看不清此驗證碼?點擊刷新",
    form_vcode_msg: "請輸入手機驗證碼"
  };
  if (lang)
    language = lang;

  let publicKey = '';

  // public key
  function publicKeyFn() {
    $.ajax({
      url: '/ajax_user/getCommonRsaKey',
      method: "GET",
      success({status, data}) {
        let intStatus = parseInt(status);
        if (intStatus === 1) {
          publicKey = data;
          encrypt.setPublicKey(publicKey);
        } else {
          publicKeyFn();
        }
      },
      error() {
        publicKeyFn();
      }
    });
  }
  // 获取public key
  publicKeyFn();

  // loading 菊花
  function loadingSvg() {
    if ($('.layer u[data-loading="svg"]').is(":visible")) {
      $('.layer u[data-loading="svg"]').hide();
    } else {
      $('.layer u[data-loading="svg"]').show();
    }
  }
  // 用于判断是否登陆页面
  let isLogin = false;
  // 获取对应弹框模板
  function getTpl(tag) {
    let tpl = $(`#activityCotain div[data-tpl="${tag}"]`).html();
    // 清空模板
    $(`#activityCotain div[data-tpl="${tag}"]`).html('');

    return tpl;
  }
  const register = {};
  // act-news-ti 下一行 插入 <p class="act-reg-news">注册即送<span>5MCC</span>，实名认证后再送<span>10MCC</span>！</p>
  const layer = getTpl('register');
  // 登录模板
  const loginLayer = getTpl('login');
  // 注册模板
  const successLayer = getTpl('loginsucc');
  //
  const pwdLayer = getTpl('pwd');


  //重置交易密码
  const reTransLayer = getTpl('retrans');
  //将模板html加入body
  $('.layer-container').append(layer);
  // 關閉彈框
  function closeWin(callback) {
    $('.close-layer').click();
    if (callback && is(callback, 'Function')) {
      callback();
    }
    // 移动端
    $(".mob-pwd").removeClass("mob-pwd-flex");
  }
  // 註冊 function
  function registerFn() {
    isLogin = false;
    $(".layer-container").show();
    // 判斷是否要求註冊
    $.ajax({
      url: '/ajax_user/getRf',
      data: '',
      success(res) {
        if (res.status == 1 && res.data) {
          let gif = document.createElement('div');
          let msg = res.data.split(':');
          gif.innerHTML = `<span>${msg[0]}</span>: <span>${msg[1]}</span>`;
          gif.className = 'rig-gif';
          $("[data-lasline='register']").prepend(gif);
        }
      },
      error(err) {}
    })
    $('.layer').parent().html(layer);
    // 更新图形验证码
    randomImgCode();
    $('.layer').attr('id', 'register-layer').show();
    countdown.reset($('.msg-group input[type="button"]'));
    $('#register-layer').show();
    $('.layer-container .layer-bg').show();
  }

  //去登陸鏈接
  $('.layer-container').on('click', '[data-login="login"]', loginFn);
  $('.layer-container').on('click', '[data-register="register"]', registerFn);

  // 注冊
  $('[data-register="register"]').click(registerFn);
  //

  //
  var countdown = {
    timer: null,
    cutDown($elem, time) {
      $elem.attr('disabled', 'disabled');
      $elem.parent().next('.mixed-text').find('a').attr('disabled');
      // 60s後重新獲取
      $elem.val(time + language['getMsgAfterTime']).data('time', time);
      // 可以在60s後獲取語音驗證碼
      $('.getVoice-container').find('span').css('color', '#fe8005').html(language['canGet'] + time + language["getVoiceAfterTime"]);
      if (msg_type === 8) {
        $('.getVoice-container').find('span').css('color', '#fe8005').html(language['pickUpPhone']);
      }
    },
    count(elem) {
      var $elem = $(elem);
      var time = parseInt($elem.data('time'));
      this.cutDown($elem, time);
      this.timer = setInterval(() => {
        if (time == 0) {
          $elem.parent().children().removeAttr('disabled');
          // 重新獲取驗證碼
          $elem.val(language['reGetMsg']).data('time', 60);
          // 點擊獲取 語音驗證碼
          $('.getVoice-container').show().find('span').css('color', '#999').html(`${language['clickAndGet']}<a href="javascript:void(0)">${language['voiceCode']}</a>`);
          clearTimeout(this.timer);
        } else {
          time--;
          this.cutDown($elem, time);
        }
      }, 1000);
    },
    reset(elem) {
      clearTimeout(countdown.timer);

      elem.removeAttr('disabled');
      elem.val(language['getCode']).data('time', 60); //'獲取驗證碼'
      $('.getVoice-container').find('span').css('color', '#999').html(`${language['clickAndGet']}<a href="javascript:void(0)">${language['voiceCode']}</a>`);
    }
  }

  // 登录
  function loginFn() {
    isLogin = true;
    $(".layer-container").show();
    $('.layer').parent().html(loginLayer);
    // 更新图形验证码
    randomImgCode();
    $('.layer').attr('id', 'login-layer');
    countdown.reset($('.msg-group input[type="button"]'));
    $('#login-layer').show();
    $('.layer-container .layer-bg').show();
    // 忘記密碼 拓展
    $("#forgetPwd").click(function() {
      // 關閉彈框
      closeWin(function() {
        // 執行重置密碼操作
        if (callbackFg && is(callbackFg, 'Function')) {
          callbackFg(register);
        }
      });
    });
    // callbackFg
  }
  // loginFn();
  function pwdFn(callback) {
    $('.layer').html(pwdLayer);
    $('.layer').attr('id', 'pwd-layer');
    $('#pwd-layer').show();
    $('.layer-container .layer-bg').show();
    $(".layer-container").show();
    if (callback && typeof callback === "function") {
      callback();
    }
    // $('#pwd-laye').find('#trans-pwd').attr('autofocus', 'autofocus');
  }
  // pwdFn();
  //
  function reTransPwdFn() {
    $('.layer').html(reTransLayer);
    $('.layer').attr('id', 'trans-layer');
    $('#trans-layer').show();
    $('.layer-container .layer-bg').show();
    // $('#trans-layer').find('#trans-pwd').attr('autofocus', 'autofocus');
  }

  //
  $('body').on('click', '[data-login="login"]', function() {
    // loginFn();
    loginFn();
  });
  // 关闭弹框 事件
  $('body').on('click', '.close-layer', function() {
    var $this = $(this);
    $('.layer').hide();
    //
    $(".layer-container").hide();
    if (register) {
      // 调用回调函数
      if (register.rootCallBack && typeof register.rootCallBack === 'function') {
        register.rootCallBack();
      }
    }
    $this.parent('.layer').siblings('.layer-bg').hide();
    // 移动端
    $(".mob-pwd").removeClass("mob-pwd-flex");
  });

  function randomNum() {
    return parseInt(Math.random() * 10000000);
  }
  // 圖形驗證碼
  function randomImgCode() {
    $('span[data-pscode="code"]').find('img').attr("src", `/index/captcha?v=${randomNum()}`);
  }
  // UPDATE img code
  $('body').on('click', '.pop-form span[data-pscode="code"]', function() {
    randomImgCode();
  });

  //
  function warnTip(_this, msg, isHide, isSubmit) {
    //
    var $errorTip = _this.next('p');
    if (isHide) {
      if (isSubmit) {
        if (!$errorTip.is(':visible')) {
          return $errorTip.show();
        }
      } else {
        $errorTip.html(msg).hide();
      }
    } else {
      $errorTip.html(msg).show();
    }
  }

  const regs = {
    tel: {
      condistion: /^(0|86|17951)?(13[0-9]|14[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57]|19[0-9])[0-9]{8}$/,
      msg: language['tel_msg'], //'手機號格式不正確'
      empty: language['tel_empty'] //'請輸入手機號碼'
    },
    pwd: {
      num: /\d/g,
      letter: /[a-zA-Z]/g,
      punctuation: /[~\!@#\$\^&\*()\+\-\=\|:\;\,\.<>\/?*]/g,
      hasSpan: /\s/g,
      noCh: /[\u4e00-\u9fa5]/g,
      msg: language['pwd_msg'], //登錄密碼不能小于6位字符
      empty: language['pwd_empty'] //密碼不能為空
    },
    surePwd: {
      msg: language['surePwd_msg'], //'兩次輸入的密碼不一致'
      empty: language['surePwd_empty'] //'確認密碼不能為空'
    },
    imgCode: {
      msg: language['imgCode_msg'] //驗證碼不能為空
    },
    telCode: {
      msg: language['telCode_msg'] //短信驗證碼不能為空
    },
    captcha: {
      msg: language['captcha_msg'], //'位數不正確'
      empty: language['captcha_empty'] //請輸入圖形驗證碼
    },
    vcode: {
      msg: language['vcode_msg'], //'位數不正確'
      empty: language['vcode_empty'] //'請輸入手機驗證碼'
    },
    default: {
      // language['validate_default_msg']
      msg: ""
    }
  };

  // 檢驗電話號碼
  function telTest(type, tel) {
    return regs[type].condistion.test(tel);
  }

  function pwdTest(type, str) {
    const res = {
      num: false,
      letter: false,
      punctuation: false,
      pwdLev: 0
    };
    // num
    if (str.match(regs[type].num)) {
      res.num = true;
      res.pwdLev++;
    }
    // word
    if (str.match(regs[type].letter)) {
      res.letter = true;
      res.pwdLev++;
    }
    // punctuation
    if (str.match(regs[type].punctuation)) {
      res.punctuation = true;
      res.pwdLev++;
    }
    // 中文
    if (!str.match(regs[type].noCh)) {
      res.noCh = true;
    }
    return res;
  }

  function isRegister(_this) {
    return $(_this).parents('#register-layer').length > 0
      ? true
      : false;
  }
  function checkForm(_this, isSubmit) {
    const $tip = $(_this).next('p');
    $tip.removeClass('error-tip');
    let isCorrect = false;
    const type = $(_this).data('form');
    let inputVal = $(_this).val();
    const errorBorder = $(_this).parent('.input-g');
    switch (type) {
        // 電話
      case 'tel':
        {
          inputVal = $.trim(inputVal);
          $(_this).siblings('.input-correct').hide();
          if (inputVal) { //存在
            // 判斷電話號碼 規則
            if (!telTest(type, inputVal)) {
              $tip.addClass('error-tip');
              errorBorder.addClass('form-err');
              warnTip($(_this), regs[type].msg);
            } else {
              // 重新填充值
              $(_this).val(inputVal);
              isCorrect = true;
              $(_this).siblings('.input-correct').show();
              warnTip($(_this), language['form_tel_empty'], true); //請輸入您的常用手機號碼
              errorBorder.removeClass('form-err');
            }
          } else { // 空
            if (!isSubmit) {
              warnTip($(_this), language['form_tel_empty'], 'hide'); //請輸入您的常用手機號碼
              errorBorder.removeClass('form-err');
            } else {
              $tip.addClass('error-tip');
              errorBorder.addClass('form-err');
              warnTip($(_this), regs[type].empty, false, true);
            }
          }
          break;
        }
        // 密碼
      case 'pwd':
        {
          // 是否登陆****
          // if (isLogin) break;
          $(_this).siblings('.input-correct').hide();
          const inputCorrect = $(_this).parent().find('.input-correct');
          const pwdStrenth = $(_this).parent().find('.tip-placeholder');
          pwdStrenth.removeClass('midd-pwd good-pwd');
          //
          if (inputVal) {
            // 長度 判斷
            if (inputVal.length < 6 ) {
              isRegister(_this)
                ? errorBorder.addClass('form-err')
                : false;
              pwdStrenth.addClass('error-tip');
              pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd');
              // '登錄密碼不能小于6位字符' //判斷是注冊還是登錄，注冊顯示錯誤信息，登錄不顯示
              isRegister(_this)
                ? warnTip($(_this), language['form_pwd_less'])
                : warnTip($(_this), '', true);

            } else { //長度大于6
              const pwdLev = pwdTest(type, inputVal);
              // 有空格
              if (regs[type].hasSpan.test(inputVal)) {
                errorBorder.addClass('form-err');
                pwdStrenth.addClass('error-tip');
                //'登錄密碼不能使用空格'
                warnTip($(_this), language['form_pwd_space']);
              } else if (pwdLev.pwdLev < 2) {
                // 密碼  強度 弱
                pwdStrenth.addClass('error-tip');
                isRegister(_this)
                  ? errorBorder.addClass('form-err')
                  : false;
                pwdStrenth.removeClass('midd-pwd good-pwd').addClass('weak-pwd');
                // 如果是註冊
                if (isRegister(_this)) {
                  warnTip($(_this), language['form_pwd_strength_weak'], false);
                } else {
                  warnTip($(_this), '', false);
                }
              } else if (pwdLev.pwdLev >= 2 && pwdLev.pwdLev < 3) {
                // 密碼強度  中
                isCorrect = true;
                $(_this).siblings('.input-correct').show();
                errorBorder.removeClass('form-err');
                pwdStrenth.removeClass('good-pwd weak-pwd').addClass('midd-pwd');
                // 如果是註冊
                if (isRegister(_this)) {
                  warnTip($(_this), language['form_pwd_strength_midd'], false);
                } else {
                  warnTip($(_this), '', true);
                }
                // ,pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd')
                // isRegister(_this) ? warnTip($(_this), '', false) : warnTip($(_this), language['form_pwd_strength_midd'], true); //安全強度適中，可以使用三種以上的組合來提高安全性
              } else if (pwdLev.pwdLev = 3) {
                // 您的密碼很安全
                isCorrect = true;
                $(_this).siblings('.input-correct').show();
                errorBorder.removeClass('form-err');
                pwdStrenth.removeClass('midd-pwd weak-pwd').addClass('good-pwd');

                if (isRegister(_this)) {
                  warnTip($(_this), language['form_pwd_strength_good'], false);
                  // pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd').addClass("good-pwd");
                } else {
                  warnTip($(_this), '', true);
                }
                // isRegister(_this) ? warnTip($(_this), '', false) : (warnTip($(_this), language['form_pwd_strength_good'], true),pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd'));
              }
            }
          } else { // 輸入 為空
            if (isSubmit) {
              errorBorder.addClass('form-err');
              pwdStrenth.addClass('error-tip');
              pwdStrenth.removeClass('weak-pwd');
              warnTip($(_this), regs[type].empty, false, true);
            } else {
              //'請輸入您的登錄密碼'
              pwdStrenth.removeClass('weak-pwd');
              warnTip($(_this), language['form_pwd_empty'], 'hide');
              errorBorder.removeClass('form-err');
            }
          }
          break;
        }
      case 'surePwd':
        {
          $(_this).siblings('.input-correct').hide();
          const firstPwd = $('input[data-form="pwd"]').val();
          const surePwd = $(_this).val();
          // 空判斷
          if (!$.trim(surePwd)) {
            if (isSubmit) {
              warnTip($(_this), regs[type].empty, false, true);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              warnTip($(_this), language['form_surepwd_msg'], 'hide'); //'請確認您的登錄密碼'
              errorBorder.removeClass('form-err');
            }
          } else {
            if (firstPwd !== surePwd) {
              warnTip($(_this), regs[type].msg);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              isCorrect = true;
              $(_this).siblings('.input-correct').show();
              warnTip($(_this), language['form_surepwd_msg'], 'hide'); //'請確認您的登錄密碼'
              errorBorder.removeClass('form-err');
            }
          }
          break;
        }
      case 'captcha':
        {
          if (inputVal == '') {
            if (isSubmit) {
              warnTip($(_this), regs[type].empty, false, true);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              warnTip($(_this), language['form_captcha_empty'], 'hide'); //請輸入圖形驗證碼
              $(_this).next('p').removeClass('error-tip');
            }
          } else { //不為空
            if (inputVal.length < 4) {
              warnTip($(_this), regs[type].msg);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              isCorrect = true;
              warnTip($(_this), language['form_captcha_refresh'], 'hide'); //看不清此驗證碼?點擊刷新
            }

          }
          break;
        }
      case 'vcode':
        {
          if (inputVal == '') {
            if (isSubmit) {
              warnTip($(_this), regs[type].empty, false, true);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              warnTip($(_this), language['form_vcode_msg'], 'hide'); //請輸入手機驗證碼
              $(_this).next('p').removeClass('error-tip');
            }
          } else { //不為空
            if (inputVal.length < 6) {
              warnTip($(_this), regs[type].msg);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              isCorrect = true;
              warnTip($(_this), language['form_vcode_msg'], 'hide'); //請輸入手機驗證碼
            }
          }
          break;
        }
      default:
        if (!$.trim(inputVal)) {
          errorBorder.addClass('form-err');
          warnTip($(_this), regs['default'].msg);
        } else {
          isCorrect = true;
          errorBorder.removeClass('form-err');
        }
    }
    return isCorrect;
  }

  /*獲取表單的所有值並檢查是否完善表單
   *完善時返回所有表單對象的值
   *不完善時返回false
   */
  function getFormData(wrapper) {
    var elem = wrapper;
    var inputs = [].slice.call(elem.find('input[data-form]')),
      formData = {},
      isComplete = true;
    inputs.reverse();
    inputs.forEach(function(input) {
      var $input = $(input),
        name = $input.attr('name'),
        val = $input.val();
      // input 為空
      if (!$.trim(val)) {
        isComplete = false;
        checkForm(input, true);
      }
      // 判斷輸入是否有誤
      if (!checkForm(input, true)) {
        wrapper.parents('#register-layer').length > 0
          ? isComplete = false
          : null;
      }
      formData[name] = val;
    });
    return isComplete
      ? formData
      : false;
  }
  $("body").on('blur', '.layer-container input', function() {
    checkForm(this, false);
  });
  // input 聚焦
  $(".layer-container").on('focus', '.layer input', function() {
    checkForm(this, false);
    $(this).parent().removeClass('form-err');
    $(this).siblings('.input-correct').hide();
    $(this).siblings('.tip-placeholder').show();
  });
  // 错误处理 提示 内容更新
  function backToFrontError(data) {
    switch (data.data) {
      case 'phone':
      case 'mo':
        var $tel = $('input[data-form="tel"]');
        $tel.parent('.input-g').addClass('form-err');
        $tel.next('p').addClass('error-tip');
        warnTip($tel, data.msg);
        break;
      case 'captcha':
        var $captcha = $('input[data-form="captcha"]');
        $captcha.parent('.input-g').addClass('form-err');
        $captcha.next('p').addClass('error-tip');
        warnTip($captcha, data.msg);
        break;
      case 'code':
      case "smsCaptch":
        var $vcode = $('input[data-form="vcode"]');
        $vcode.parent('.input-g').addClass('form-err');
        $vcode.next('p').addClass('error-tip');
        warnTip($vcode, data.msg);
        break;
      case 'Upassword':
        var $pwd = $('input[data-form="pwd"]');
        $pwd.parent('.input-g').addClass('form-err');
        $pwd.next('p').addClass('error-tip');
        warnTip($pwd, data.msg);
        break;
      default:
        var $vcode = $('input[data-form="vcode"]');
        $vcode.next('p').addClass('error-tip');
        warnTip($vcode, data.msg);
        break;
    }
  }
  // 登陆注册 提交数据 方法
  function postData(e) {
    e.preventDefault();
    var formData = getFormData($('.pop-form'));
    if (formData) {
      var mo = formData.tel,
        pwd = formData.pwd,
        repwd = formData.surePwd,
        captcha = formData.captcha,
        code = formData.vcode;
      //注冊
      if ($(e.target).parents('#register-layer').length > 0) {
        var url = "/ajax_user/register",
          data = {
            phone: mo,
            pwd: pwd,
            repwd: repwd,
            captcha: captcha,
            code: code,
            regtype: 'phone'//登錄
          }
      } else {
        url = "/Ajax_User/login",
        data = {
          phone: mo,
          password: pwd,
          captcha: captcha,
          code: code,
          regtype: 'phone'
        }
        // rsa transiform
        if (publicKey) {
          try {
            let pukdata = '';
            let jsonStri = JSON.stringify(data);
            let jsonLength = jsonStri.length;
            let keyLength = publicKey.length;
            let asslength = 117;
            // 超出 public key 长度 - 11 分段加密
            if (jsonLength > asslength) {
              pukdata = [];
              // 分段长度
              let partLength = asslength;
              // 分段数量
              let strLeng = Math.ceil(jsonLength /asslength);

              //
              for (var i = 0; i < strLeng; i++) {
                let start = i * partLength;
                let end = (i + 1) * partLength;
                console.log(start, end);
                let part = jsonStri.slice(start, end);
                pukdata.push(encrypt.encrypt(part));
              }
            } else {
              pukdata = encrypt.encrypt(jsonStri);
            }

            data = {
              data: pukdata
            };
          } catch (e) {
            data = data;
            // alert('try again later.');
          }
        }
      }
      // loading  菊花
      loadingSvg();
      $.ajax({
        url: url,
        method: "POST",
        data: data
      }).done(function(data) {
        if (data.status == 1) {
          // 注冊 成功 彈框
          if (isRegister($(e.target))) {
            // $('#register-layer').html(successLayer).addClass('success-layer');
            $('#register-layer').html(successLayer).addClass('success-layer');
            $("#register-layer .hide-dom").removeClass("hide-dom");
            $('.layer').show();
            $(".layer-container").show();
            $('.layer-container .layer-bg').show();
          } else {
            // 判斷是否移動端
            const $loginGroup = $("#loginGroup");
            if ($loginGroup.length > 0) {
              if (data.data && data.data.user) {
                let {
                  phone = '',
                  total = 0
                } = data.data.user;
                // 把用戶信息存到本地
                sessionStorage.setItem("user", `{"phone": "${phone}","total": "${total}"}`);
                if ($loginGroup.length > 0) {
                  // 隱藏登錄按鈕
                  $loginGroup.hide();
                  // 显示退出登录按钮
                  $("#logoutBTN").removeClass("hide-dom");
                  //
                  let $succGroup = $("#loginSuccGroup");
                  // 顯示賬戶
                  $succGroup.find('[data-phone]').html(phone);
                  // 顯示資產
                  $succGroup.find('[data-account]').html(total+"BTC");
                  $succGroup.show();
                  closeWin();
                }
              }
            }
            // pc端 刷新页面
             else {
              // 刷新頁面，轉跳到指定頁面
              const {reUrl} = data.data;
              let href = '';
              if (/trade/.test(location.href)) {
                history.go(0);
              }
              // 重定向路由
              if (reUrl) {
                href = reUrl;
              } else {
                href = '/';
              }
              // 后台配置
              window.location.href = href;
            }
          }
        } else if (data.status == 0) {
          loadingSvg();
          // 密码错误
          if (data.data =='Upassword') {
            $('#login-layer input[name="pwd"]').siblings('p.tip-placeholder').removeClass('weak-pwd good-pwd midd-pwd');
          }
          // 图形验证码过期，update
          if (data.data == 'captcha') {
            randomImgCode();
          }
          // $('.weak-pwd').removeClass('weak-pwd').addClass('error-tip');
          backToFrontError(data);
        }
      })
    } else {
      return false;
    }
  }
  $(".layer-container").on('submit', '.pop-form', function(e) {
    postData(e);
  });

  //發送短信驗證碼
  function sendVcode(e, type) {
    var $that = $(e.target);
    var $tel = $('input[name="tel"]');
    var $imgCaptcha = $('.captcha-group').find('input[name="captcha"]');

    var captchaCheck = checkForm($imgCaptcha, true);
    var telCheck = checkForm($tel, true);
    if (captchaCheck === true && telCheck === true) {
      // 倒计时
      countdown.count($('.msg-group input[type="button"]'));
      let imgCaptcha = $imgCaptcha.val();
      let telVal = $tel.val();
      // var url = $that.parents('#register-layer').length > 0
      //   ? "/ajax_user/sendregmsg"
      //   : "/Ajax_Auth/sendregmsg";

      let url = type === 'register' ? "/ajax_user/sendregmsg" : "/Ajax_Auth/sendregmsg";
      $.ajax({
        type: "post",
        url: url,
        async: true,
        data: {
          action: msg_type,
          captcha: imgCaptcha,
          phone: telVal
        },
        success: function(data) {
          if (data.status == 1) {
            $('.getVoice-container').show();
          } else if (data.status == 0) {
            // 停止倒计时
            countdown.reset($('.msg-group input[type="button"]'), 'hideVoiceBtn');
            // 图形验证码过期，update
            if (data.data == 'captcha') {
              randomImgCode();
            }
            backToFrontError(data);
          }
        }
      });
    } else {
      return false;
    }
  }

  var msg_type = 0; //短信默認為0   語音8;
  $('body').on('click', '.msg-group input[type="button"]', function(e) {
    e.stopPropagation && e.stopPropagation();
    msg_type = 0;
    let type = $(e.target).parents('div[data-type]').data('type');
    //
    sendVcode(e, type);
    $(this).siblings('input[name="vcode"]').focus(); //发送短信验证码后聚焦输入框
  });
  //發送語音驗證碼
  $('body').on('click', '.layer-container a', function(e) {
    e.stopPropagation && e.stopPropagation();
    msg_type = 8;
    let type = $(e.target).parents('div[data-type]').data('type');
    sendVcode(e, type);
    // 发送验证码后聚焦输入框
    $(this).siblings('input[name="vcode"]').focus();
  });
  // function closeCallBack() {
  //   if () {
  //
  //   }
  // }
  register.loginFn = loginFn;
  register.pwdFn = pwdFn;
  register.warnTip = warnTip;
  register.close = closeWin;
  register.registerFn = registerFn;

  register.loginSuccCallBack = function() {}
  // registerFn();
  // 登錄頁面 彈出 登錄對話框
  $(document).ready(function() {
    // 登陆
    if (window.location.href.indexOf('?login') > -1) {
      loginFn();
    }
    // 注册
    if (window.location.href.indexOf('alert=register') > -1) {
      registerFn();
    }
  });
  return register;
}
