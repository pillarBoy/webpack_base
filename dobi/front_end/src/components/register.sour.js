import "@/styles/common/register.scss";
/* eslint-disable */

export default function () {
  const register = {};
  const layer = `
                  <div class="layer-bg"></div>
                    <div class="layer" id="register-layer">
                     <div class="close-layer"></div>
                     <p class="layer-title">注册</p>
                     <form class="pop-form">
                      <div class="input-g">
                        <label>手机号</label>
                        <input type="text" name="tel" placeholder="请输入您的手机号" data-form="tel"/>
                        <p class="tip-placeholder">请输入您的常用手机号码</p>
                        <i class="input-correct"></i>
                      </div>

                      <div class="input-g">
                        <label>设置密码</label>
                        <input type="password" name="pwd" placeholder="至少使用两种字符组合" data-form="pwd" maxlength="20" onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false"/>
                        <p class="tip-placeholder">请输入您的登录密码</p>
                        <i class="input-correct"></i>
                      </div>

                      <div class="input-g">
                        <label>确认密码</label>
                        <input type="password" name="surePwd" placeholder="请再次输入密码" data-form="surePwd" onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false"/>
                        <p class="tip-placeholder">请再次输入密码</p>
                        <i class="input-correct"></i>

                      </div>
                      <div class="input-g captcha-group">
                        <label>图形验证码</label>
                        <input type="text" class='sm-input' name="captcha" maxlength="4" placeholder="请输入图形验证码" data-form="captcha"/>
                        <p class="tip-placeholder">看不清？点击图片更换验证码</p>
                        <span data-pscode="code"><img src='/index/captcha'></span>
                      </div>

                      <div class="input-g msg-group">
                        <label>手机验证码</label>
                        <input type="text" class='sm-input' name="vcode" maxlength="6" placeholder="请输入手机验证码" data-form="vcode"/>
                        <p class="tip-placeholder">请输入您的手机验证码</p>
                        <input type="button" class="xs-input" value="获取验证码" class="btn_getMsg" data-time="60"/>
                      </div>

                      <div class="mixed-text getVoice-container">
                        <span>点击获取<a href="javascript:void(0)">语音验证码</a></span>
                      </div>

                      <div class="checkbox-container">
                        <input type="checkbox" id="agree-check" required/>
                        <label for="agree-check">同意<a href='/policy' target="_blank">《用户协议》</a></label>
                      </div>

                      <div class="input-g">
                        <input type="submit" value="立即注册"/>
                      </div>

                      <div class="mixed-text">
                        <span>已经注册，去<a href="javascript:void(0)" id="link-login">登录</a></span>
                      </div>
                    </form>
                  </div>
                  `;
    const loginLayer = `<div class="layer-bg"></div>
                   <div class="layer" id="login-layer">
                   <div class="close-layer"></div>
                   <p class="layer-title">登录</p>
                   <form class="pop-form">
                    <div class="input-g">
                      <label>手机号</label>
                      <input type="text" name="tel" placeholder="请输入您的手机号" data-form="tel"/>
                      <p class="tip-placeholder">请输入您的手机号码</p>
                    </div>

                    <div class="input-g">
                      <label>输入密码</label>
                      <input type="password" name="pwd" placeholder="请输入您的登录密码" data-form="pwd" maxlength="20" onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false"/>
                      <p class="tip-placeholder">请输入您的登录密码</p>
                    </div>

                    <div class="input-g captcha-group">
                      <label>图形验证码</label>
                      <input type="text" class='sm-input' name="captcha" maxlength="4" placeholder="请输入图形验证码" data-form="captcha"/>
                      <p class="tip-placeholder">看不清？点击图片更换验证码</p>
                      <span data-pscode="code"><img src='/index/captcha'></span>
                    </div>

                    <div class="input-g msg-group">
                      <label>手机验证码</label>
                      <input type="text" class='sm-input' name="vcode" maxlength="6" placeholder="请输入手机验证码" data-form="vcode"/>
                      <p class="tip-placeholder">请输入您的手机验证码</p>
                      <input type="button" class="xs-input" value="获取验证码" class="btn_getMsg" data-time="60"/>
                    </div>

                    <div class="mixed-text getVoice-container">
                      <span>点击获取<a href="javascript:void(0)">语音验证码</a></span>
                    </div>

                    <div class="input-g">
                      <input type="submit" value="登录"/>
                    </div>
                  </form>`;
    const successLayer = `<div class="close-layer"></div>
                        <p class="layer-title">恭喜您注册成功</p>
                        <input type="button" value="去登录" data-login="login" id="link-login"/>`


  $('.layer-container').append(layer);
  // $("body").prepend(layer);
	//去登陆链接
	$('.layer-container').on('click', '#link-login', function(){
    $('.close-layer').click();
    console.log($('[data-login="login"]'));
    loginFn();
  })
  // 注册
  function registerFn() {
    $('.layer').parent().html(layer);
    $('.layer').attr('id', 'register-layer');
    countdown.reset($('.msg-group input[type="button"]'));
    $('#register-layer').show();
    $('.layer-bg').show();
  }
  $('[data-register="register"]').click(registerFn);
  // 注册
  // $('.banner-jump button').eq(0).click(function () {
  //   $('.layer').parent().html(layer);
  //   $('.layer').attr('id', 'register-layer');
  //   countdown.reset($('.msg-group input[type="button"]'));
  //   $('#register-layer').show();
  //   $('.layer-bg').show();
  // });
  //
  function loginFn() {
    $('.layer').parent().html(loginLayer);
    $('.layer').attr('id', 'login-layer');
    countdown.reset($('.msg-group input[type="button"]'));
    $('#login-layer').show();
    $('.layer-bg').show();
  }
  // 登录
  // $('.banner-jump button').eq(1).click(function () {
  //   $('.layer').parent().html(loginLayer);
  //   $('.layer').attr('id', 'login-layer');
  //   countdown.reset($('.msg-group input[type="button"]'));
  //   $('#login-layer').show();
  //   $('.layer-bg').show();
  // });
  //
  $('body').on('click', '[data-login="login"]', loginFn);
  $('body').on('click', '.close-layer', function () {
    var $this = $(this);
    $('.layer').hide();
    $this.parent('.layer').siblings('.layer-bg').hide();
  });

  function randomNum() {
    return parseInt(Math.random() * 100000);
  }
  // 图形验证码
  function randomImgCode() {
    $('span[data-pscode="code"]').find('img').attr("src", `/index/captcha?${randomNum()}`);
  }
  // 初始化 图形验证码
  randomImgCode();
  $('body').on('click', '.pop-form span[data-pscode="code"]', function () {
    randomImgCode();
  });

  function warnTip(_this, msg, isHide, isSubmit) {
    var $errorTip = _this.next('p');
    if (isHide) {
      if (isSubmit) {
        // console.log('warnTip进入isSubmit');
        if (!$errorTip.is(':visible')) {
          return $errorTip.show();
        }
      } else {
        $errorTip.html(msg).hide();
      }
    } else {
      $errorTip.html(msg).show();
      // console.log('没有hide');
    }
  }

  const regs = {
    tel: {
      condistion: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
      msg: '手机号格式不正确',
      empty: '请输入手机号码'
    },
    pwd: {
      num: /\d/g,
      letter: /[a-zA-Z]/g,
      punctuation: /[~\!@#\$\^&\*()\+\-\=\|:\;\,\.<>\/?*]/g,
      hasSpan: /\s/g,
      noCh: /[\u4e00-\u9fa5]/g,
      msg: '登录密码不能小于6位字符',
      empty: '密码不能为空'
    },
    surePwd: {
      msg: '两次输入的密码不一致',
      empty: '确认密码不能为空'
    },
    imgCode: {
      msg: '验证码不能为空'
    },
    telCode: {
      msg: '短信验证码不能为空'
    },
    captcha: {
      empty: '请输入图形验证码',
      msg: '位数不正确'
    },
    vcode: {
      empty: '请输入手机验证码',
      msg: '位数不正确'
    },
    default: {
      msg: '请完善表单'
    }
  };

  var countdown = {
    timer: null,
    count: function (elem) {
      var $elem = $(elem);
      var time = parseInt($elem.data('time'));
      time--;
      if (time >= 0) {
        $elem.attr('disabled', 'disabled');
        $elem.parent().next('.mixed-text').find('a').attr('disabled');
        // console.log(msg_type);
        this.timer = setTimeout(function () {
          $elem.val(time + 's后重新获取').data('time', time);
          $('.getVoice-container').find('span').css('color', '#fe8005').html("可以在" + time + "s后获取语音验证码");
          if (msg_type === 8) {
            $('.getVoice-container').find('span').css('color', '#fe8005').html("请注意收听来电");
          }
          countdown.count(elem);
        }, 1000);
      } else {
        $elem.parent().children().removeAttr('disabled');
        $elem.val('重新获取验证码').data('time', 60);
        $('.getVoice-container').find('span').css('color', '#999').html('点击获取<a href="javascript:void(0)">语音验证码</a>');
      }
    },
    reset: function (elem) {
      clearTimeout(countdown.timer);
      elem.removeAttr('disabled');
      elem.val('获取验证码').data('time', 60);
      $('.getVoice-container').find('span').css('color', '#999').html('点击获取<a href="javascript:void(0)">语音验证码</a>');
    }
  }


  // 检验电话号码
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
    return $(_this).parents('#register-layer').length > 0 ? true : false;
  }
  function checkForm(_this, isSubmit) {
    const $tip = $(_this).next('p');
    $tip.removeClass('error-tip');
    let isCorrect = false;
    const type = $(_this).data('form');
    const inputVal = $(_this).val();
    const errorBorder = $(_this).parent('.input-g');
    switch (type) {
      // 电话
      case 'tel':
        {
          $(_this).siblings('.input-correct').hide();
          if (inputVal) { //存在
            // 判断电话号码 规则
            if (!telTest(type, inputVal)) {
              $tip.addClass('error-tip');
              errorBorder.addClass('form-err');
              warnTip($(_this), regs[type].msg);
            } else {
              isCorrect = true;
              $(_this).siblings('.input-correct').show();
              warnTip($(_this), '请输入您的常用手机号码', true);
              // console.log('手机号正确');
              errorBorder.removeClass('form-err');
            }
          } else { // 空
            if (!isSubmit) {
              warnTip($(_this), '请输入您的常用手机号码', 'hide');
              errorBorder.removeClass('form-err');
            } else {
              $tip.addClass('error-tip');
              errorBorder.addClass('form-err');
              warnTip($(_this), regs[type].empty, false, true);
            }
          }
          break;
        }
        // 密码
      case 'pwd':
        {
          $(_this).siblings('.input-correct').hide();
          const inputCorrect = $(_this).parent().find('.input-correct');
          const pwdStrenth = $(_this).parent().find('.tip-placeholder');
          pwdStrenth.removeClass('midd-pwd good-pwd');
          //
          if (inputVal) {
            // 长度 判断
            if (inputVal.length < 6) {
              isRegister(_this) ? errorBorder.addClass('form-err') : false;
              pwdStrenth.addClass('error-tip');
              pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd');
              isRegister(_this) ? warnTip($(_this), '登录密码不能小于6位字符') : warnTip($(_this), '', true); //判断是注册还是登录，注册显示错误信息，登录不显示

            } else {                      //长度大于6
              const pwdLev = pwdTest(type, inputVal);
              if(regs[type].hasSpan.test(inputVal)){   //有空格
                errorBorder.addClass('form-err');
                pwdStrenth.addClass('error-tip');
                warnTip($(_this), '登录密码不能使用空格');
              }else if (pwdLev.pwdLev < 2) {
                pwdStrenth.addClass('error-tip');
                isRegister(_this) ? errorBorder.addClass('form-err') : false;
                pwdStrenth.removeClass('midd-pwd good-pwd').addClass('weak-pwd');
                isRegister(_this) ? warnTip($(_this), '有被盗风险，请使用字母、数字或符号两种及以上组合', false) : (warnTip($(_this), '', true),pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd'));
              } else if (pwdLev.pwdLev >= 2 && pwdLev.pwdLev < 3) {
                isCorrect = true;
                $(_this).siblings('.input-correct').show();
                errorBorder.removeClass('form-err');
                pwdStrenth.removeClass('good-pwd weak-pwd').addClass('midd-pwd');
                isRegister(_this) ? warnTip($(_this), '安全强度适中，可以使用三种以上的组合来提高安全性', false) : (warnTip($(_this), '', true),pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd'));
              } else if (pwdLev.pwdLev = 3) {
                isCorrect = true;
                $(_this).siblings('.input-correct').show();
                errorBorder.removeClass('form-err');
                pwdStrenth.removeClass('midd-pwd weak-pwd').addClass('good-pwd');
                isRegister(_this) ? warnTip($(_this), '您的密码很安全', false) : (warnTip($(_this), '', true),pwdStrenth.removeClass('midd-pwd good-pwd weak-pwd'));
              }
            }
          } else { // 输入 为空
            if (isSubmit) {
              // console.log('pwd进入isSubmit');
              errorBorder.addClass('form-err');
              pwdStrenth.addClass('error-tip');
              warnTip($(_this), regs[type].empty, false, true);
            } else {
              warnTip($(_this), '请输入您的登录密码', 'hide');
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
          // 空判断
          if (!$.trim(surePwd)) {
            if (isSubmit) {
              warnTip($(_this), regs[type].empty, false, true);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              warnTip($(_this), "请确认您的登录密码", 'hide');
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
              warnTip($(_this), "请确认您的登录密码", 'hide');
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
              warnTip($(_this), "请输入图形验证码", 'hide');
              $(_this).next('p').removeClass('error-tip');
            }
          } else { //不为空
            if (inputVal.length < 4) {
              warnTip($(_this), regs[type].msg);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              isCorrect = true;
              warnTip($(_this), '看不清此验证码?点击刷新', 'hide');
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
              warnTip($(_this), "请输入手机验证码", 'hide');
              $(_this).next('p').removeClass('error-tip');
            }
          } else { //不为空
            if (inputVal.length < 6) {
              warnTip($(_this), regs[type].msg);
              $(_this).next('p').addClass('error-tip');
              errorBorder.addClass('form-err');
            } else {
              isCorrect = true;
              warnTip($(_this), '请输入手机验证码', 'hide');
            }
          }
          break;
        }
      default:
        if (!$.trim(inputVal)) {
          errorBorder.addClass('form-err');
          warnTip(regs['default'].msg);
        } else {
          isCorrect = true;
          errorBorder.removeClass('form-err');
        }
    }
    return isCorrect;
  }

  /*获取表单的所有值并检查是否完善表单
   *完善时返回所有表单对象的值
   *不完善时返回false
   */
  function getFormData(wrapper) {
    var elem = wrapper;
    var inputs = [].slice.call(elem.find('input[data-form]')),
      formData = {},
      isComplete = true;
    inputs.reverse();
    inputs.forEach(function (input) {
      var $input = $(input),
          name = $input.attr('name'),
          val = $input.val();
      // input 为空
      if (!$.trim(val)) {
        isComplete = false;
        // console.log('input为空');
        checkForm(input, true);
      }
      // 判断输入是否有误
      if (!checkForm(input, true)) {
        wrapper.parents('#register-layer').length > 0 ? isComplete = false : null;
      }
      formData[name] = val;
    });
    return isComplete ? formData : false;
  }

  $("body").on('blur', '#register-layer input[data-form]', function () {
    checkForm(this);
  });

  $(".layer-container").on('focus', 'input', function () {
    $(this).parent().removeClass('form-err');
    $(this).siblings('.input-correct').hide();
    $(this).siblings('.tip-placeholder').show();
  });

  function backToFrontError(data){
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
        // console.log('登录表单错误进入default');
        break;
    }
  }

  $(".layer-container").on('submit', '.pop-form', function (e) {
    e.preventDefault();
    var formData = getFormData($('.pop-form'));
    //console.log(formData);
    if (formData) {
      var mo = formData.tel,
          pwd = formData.pwd,
          repwd = formData.surePwd,
          captcha = formData.captcha,
          code = formData.vcode;
        if($(e.target).parents('#register-layer').length > 0){//注册
        	var url = "/ajax_user/register",
        			data = {phone:mo,  pwd:pwd,  repwd:repwd,  captcha:captcha,  code:code,  regtype:'phone',}
        }else{                         //登录
        	url = "/Ajax_User/login",
        	data = {phone:mo,  password:pwd, captcha:captcha,  code:code,  regtype:'phone',}
        }
      $.ajax({
        type: "POST",
        url: url,
        async: true,
        data: data,
      }).done(function (data) {
        if (data.status == 1) {
          if(isRegister($(e.target))){    //注册成功
            $('#register-layer').html(successLayer).addClass('success-layer');
          }else{
            window.location.href = "/";
            // alert('登录成功'),history.go(0);
          }
        } else if (data.status == 0) {
          backToFrontError(data);
        }
      })
    } else {
      return false;
    }
  });

  //发送短信验证码
  function sendVcode(e) {
    var $that = $(e.target);
    var $tel = $('input[name="tel"]');
    var $imgCaptcha = $('.captcha-group').find('input[name="captcha"]');
    var captchaCheck = checkForm($imgCaptcha, true);
    var telCheck = checkForm($tel, true);
    if (captchaCheck === true && telCheck === true) {
      var imgCaptcha = $imgCaptcha.val();
      var telVal = $tel.val();
      var url = $that.parents('#register-layer').length > 0 ? "/ajax_user/sendregmsg" : "/Ajax_Auth/sendregmsg";
      $.ajax({
        type: "post",
        url: url,
        async: true,
        data: {
          action: msg_type,
          captcha: imgCaptcha,
          phone: telVal
        },
        success: function (data) {
          if (data.status == 1) {
            countdown.count($('.msg-group input[type="button"]'));
            $('.getVoice-container').show();
          } else if (data.status == 0) {
            backToFrontError(data);
          }
        }
      });
    } else {
      return false;
    }
  }

  var msg_type = 0; //短信默认为0   语音8;
  $('body').on('click', '.msg-group input[type="button"]', function (e) {
    e.stopPropagation && e.stopPropagation();
    msg_type = 0;
    sendVcode(e);
  });
  //发送语音验证码
  $('body').on('click', '.getVoice-container a', function (e) {
    e.stopPropagation && e.stopPropagation();
    msg_type = 8;
    sendVcode(e);
  });
  register.loginFn = loginFn;
  return register;
}
