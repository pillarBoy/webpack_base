import '@/styles/common/resetPwd.scss';
import DialogBox from '@/tools/dialogBox/dialogBox';
import http from '@/tools/http';
import Alert from '@/tools/alert/alert';
import chkhttpLang from '@/tools/chgHpLg';

// process.env.NODE_ENV
class ResetPwd extends DialogBox {
  constructor(options) {
    super();
    // 切換 http 語言包
    chkhttpLang("#baseLang", http);

    this.myAlert = new Alert();
    this.lang = {
      title: '找回登錄密碼',
      phoneTit: '中國 +86',
      phoneHolder: '請輸入您的登錄手機號',
      captcha: '圖形驗證碼',
      imgHolder: '請輸入圖形驗證碼',
      NextStep: '下一步',
      stepOne: '填寫手機號',
      stepTwo: '身份驗證',
      stepThree: '設置新密碼',
      stepFour: '重置密碼成功',
      loginPwd: '設置密碼',
      surePwd: '確認密碼',
      phoneCode: '手機驗證碼',
      loginPwdHolder: '至少使用兩種字符組合',
      surePwdHolder: '請再次輸入密碼',
      phoneCodeHolder: "請輸入手機驗證碼",
      getPhoneCode: '獲取驗證碼',
      reGetPhoneCode: '重新獲取驗證碼',
      clickGetVoiceCode: '點擊獲取',
      voiceCode: '語音驗證碼',
      phoneComing: '請注意收聽來電',
      canGet: '可以在',
      canGetAfter: '後獲取',
      getPhoneCodeAg: '后重新獲取',
      userPhoneTips: '已填寫手機號:',
      userPhoneNum: '******',
      goLogin: '去登錄',
      warn: {
        phone: {
          nor: '請輸入您的常用手機號碼',
          err: '手機號格式不正確',
          msg: '',
          empty: '手機號碼不能為空'
        },
        captcha: {
          nor: '看不清？點擊圖片更換驗證碼',
          err: '位數不正確',
          msg: '',
          empty: '圖形驗證碼不能為空'
        },
        code: {
          nor: '請輸入手機驗證碼',
          err: '手機驗證碼格式不正確',
          msg: '',
          empty: '手機驗證碼不能為空'
        },
        password: {
          nor: '請輸入登錄密碼',
          err: '登錄密碼格式不正確',
          weak: '有被盜風險，請使用字母、數字或符號兩種及以上組合',
          midd: '安全強度適中，可以使用三種以上的組合來提高安全性',
          good: '您的密碼很安全',
          space: '登錄密碼不能使用空格',
          noCh: '登錄密碼不能使用中文',
          less: '登錄密碼不能小于6位字符',
          msg: '',
          empty: '登錄密碼不能為空'
        },
        repassword: {
          nor: '請再次輸入登錄密碼',
          err: '兩次密碼不一致',
          msg: '',
          empty: '確認密碼不能為空'
        }
      }
    };
    // 輸入校驗規則
    this.inputRules = {
      // 1/2/6/9。
      phone: /^(1[34578][0-9]{9})$/,
      captcha: /^([0-9a-zA-Z]{4})$/,
      phoneCode: /^([0-9]{6})$/,
      code: /^([0-9a-zA-Z]{6})$/
    };
    // 重置密碼 根模板
    this.setPhoneTpl = $('#activityCotain div[data-tpl="repwd"]').html();
    // 清空 防止id冲突

    // 缓存 重置 初始页面
    this.tryCallback = () => {
      $('#activityCotain div[data-tpl="repwd"]').html(this.setPhoneTpl);
    }

    // 重置 module box 樣式
    this.css({ padding: 0, width: '574px' });
    this.formElem = '';
    this.chkpwd();
    this.options = options;
    this.store = { tel: '' };
    this.postBusy = false;
    this.countdownBusy = false;
  }
  clearTpl() {
    $('#activityCotain div[data-tpl="repwd"]').html("");
  }
  inputBlurFn(input, submit) {
    let $input = $(input);
    let $warnElem = $input.siblings('span[data-warn]');
    let inpName = $input.attr('name');
    // 不是密碼類型
    if (inpName === 'password') {
      // 輸入不為空
      let chkRes = this.chkpwd($input.val());
      let intension = 0;
      // 是否 空格
      if ($input.val().length < 6 || $input.val().length > 20) {
        // 显示 红色提醒边框
        if (submit) this.errInput($input);
        $warnElem.addClass('err-warn-win').html(this.lang.warn[inpName].less).show();
      }
      // 空格
      else if (chkRes.hasSpan) {
        $warnElem.addClass('err-warn-win').html(this.lang.warn[inpName].space).show();
        this.errInput($input);
      }
      // 中文
      else if (chkRes.noCh) {
        $warnElem.addClass('err-warn-win').html(this.lang.warn[inpName].noCh).show();
        this.errInput($input);
      } else {
        // 清除 红色提醒边框
        this.errInput($input, 'isCorrect');
        // 强度判断 数字
        if (chkRes.num) {
          intension++;
        }
        // 特殊字符
        if (chkRes.punctuation) {
          intension++;
        }
        // 字母
        if (chkRes.letter) {
          intension++;
        }
        //
        if (intension === 1) {
          this.errInput($input);
          $warnElem.addClass('err-warn-win weak-pwd').html(this.lang.warn[inpName].weak).show();
        }
        if (intension === 2) {
          $warnElem.addClass('midd-pwd').html(this.lang.warn[inpName].midd).show();
        }
        if (intension === 3) {
          $warnElem.addClass('good-pwd').html(this.lang.warn[inpName].good).show();
        }
      }
    } else if (inpName === 'repassword') {
      let pwdVal = this.formElem.find('input[name="password"]').val();
      if (pwdVal !== $input.val()) {
        $warnElem.addClass('err-warn-win').html(this.lang.warn[inpName].err).show();
        this.errInput($(input));
      } else {
        // 清除 红色提醒边框
        this.errInput($input, 'isCorrect');
        $warnElem.hide();
      }
    } else if ($input.val()) {
      if (!this.checkInput($input)) {
        this.blurWarnTips($warnElem, this.lang.warn[inpName].err);
      } else {
        this.blurWarnTips($warnElem, '', 'empty');
      }
    } else if (submit) {
      this.blurWarnTips($warnElem, this.lang.warn[inpName].empty);
    } else {
      this.blurWarnTips($warnElem, '', 'empty');
    }
  }
  // 提交 手机号
  bindInputCheck() {
    // 重新获取一次元素
    this.formElem = $("#formContain");
    this.formElem.find('input').on('focus', (e) => {
      let $input = $(e.target);
      let inpName = $input.attr('name');
      // 顯示 提示框
      this.focusWarnTips($input.siblings('span[data-warn]'), this.lang.warn[inpName].nor);
    });
    //
    this.formElem.find('input').on('blur', (e) => {
      this.inputBlurFn(e.target);
    });
  }
  //
  upDateView(step, html, callback) {
    // this.formElem = $("#formContain");
    const StepElem = $("#doStep");
    // StepElem.find(".act-step").removeClass('act-step');
    StepElem.find(`div:nth-child(${step})`).addClass('act-step');
    this.formElem.html(html);
    this.bindInputCheck();
    if (callback) {
      callback();
    }
  }
  // update img code 更新图形验证码
  randomImgCode() {
    let rootElem = $('#resPhone');
    // 初次获取验证码
    rootElem.find('img').attr("src", `/index/captcha?v=${(new Date()).getTime()}`);
  }
  // 1图形验证码
  pushPhoneNum() {
    // 清空模板
    this.clearTpl();
    this.show(this.setPhoneTpl, () => {
      this.formElem = $("#formContain");
      let rootElem = $('#resPhone');
      // 初次获取验证码
      rootElem.find('img').attr("src", `/index/captcha?v=${(new Date()).getTime()}`);
      // 点击更新图形验证码
      rootElem.find('img').click(function() {
        $(this).attr('src', `/index/captcha?v=${(new Date()).getTime()}`);
      });
      $('#postPhone').click(() => {
        let postData = this.formCompleted(this.formElem);
        this.store = Object.assign({}, postData);
        if (postData) {
          this.lang.userPhoneNum = this.store.phone.slice(0, 3) + '****' + this.store.phone.slice(-4);
          //
          this.getData('/ajax_user/erifypPhone', postData, () => {
            this.phoneCodePost();
          });
        } else {
          //
          this.postBusy = false;
        }
      });
      // 給 input 綁定事件
      this.bindInputCheck();
      // this.setSuccess();
      // this.resetPwdPost();
      // this.phoneCodePost();
    });
  }
  // 2手機驗證碼
  phoneCodePost() {
    // 身份確認 模板
    const Authen = `<p class="sure-phone" data-form="lable">
      <span>${this.lang.userPhoneTips}</span><span class="minx-phone">${this.lang.userPhoneNum}</span>
    </p>
    <div class="short-tag sure-phone">
      <p data-form="lable">
        <span>${this.lang.phoneCode}</span><input type="text" name="code" maxlength="6" placeholder="${this.lang.phoneCodeHolder}">
        <span class="warn-tips-win" data-warn="msg"></span>
      </p>
      <button type="button" data-phcode="60" id="getPhoneCode" data-action="11">${this.lang.getPhoneCode}</button>
      <div class="voice-code" id="voicdCodeTab"><span>${this.lang.clickGetVoiceCode}</span><b data-phcode="60">S</b><span class="voice-btn" data-action="8" data-phcode="60">${this.lang.voiceCode}</span></div>
    </div>
    <p><button id="phoneCode" class="submit-btn">${this.lang.NextStep}</button></p>
    `;

    let moBox = this;
    const MAXCOUNT = 60;
    // 倒計時
    function countDown(moBox, action) {
      if (moBox.countdownBusy) return;
      moBox.countdownBusy = true;
      // btn
      let limitTime = MAXCOUNT;
      // 語音按鈕
      let voiceTab = $('#voicdCodeTab');
      voiceTab.addClass('voice-code-act').show();
      /* eslint-disable no-use-before-define */
      function runCount() {
        // 短信按鈕
        moBox.formElem.find('button[data-phcode]').html(`${limitTime}S${moBox.lang.getPhoneCodeAg}`);
        // let voiceTab = $('#voicdCodeTab');
        if (limitTime === MAXCOUNT) {
            $('#voicdCodeTab').show();
        }
        if (limitTime === 0) {
          clearTimeout(codeTime);
          moBox.countdownBusy = false;
          $('#voicdCodeTab').removeClass('voice-code-act');
          moBox.formElem.find('button[data-phcode]').html(moBox.lang.reGetPhoneCode);
          // clickGetVoiceCode
          voiceTab.find('span').eq(0).html(`${moBox.lang.clickGetVoiceCode}`);
          voiceTab.find('span').eq(1).html(`${moBox.lang.voiceCode}`);
        } else {
          // 語音驗證碼
          if (action === 8) {
            voiceTab.find('span').eq(0).html('');
            voiceTab.find('span').eq(1).html(`${moBox.lang.phoneComing}`);
            moBox.formElem.find('b[data-phcode]').html('');
          } else {
            voiceTab.find('span').eq(0).html(`${moBox.lang.canGet}`);
            voiceTab.find('span').eq(1).html(`${moBox.lang.canGetAfter+moBox.lang.voiceCode}`);
            // voiceTab
            moBox.formElem.find('b[data-phcode]').html(`${limitTime}S`);
          }
        }
        limitTime--;
      }
      // 第一次啟動
      runCount();
      // 定時啟動
      const codeTime = setInterval(() => {
        runCount();
      }, 1000);
      /* eslint-enable */
    }
    //
    this.upDateView(2, Authen, () => {

      function getPhoneCodeFn() {
        let action = $(this).data('action');

        if (action == 8 && $("#voicdCodeTab b").is(":visible")) {
          return;
        }

        // 获取短信验证码
        http({
          url: '/Ajax_Auth/sendregmsg',
          method: 'POST',
          data: {
            phone: moBox.store.phone,
            action: action,
            back: 1
          },
          success(res) {
            if (parseInt(res.status) === 1) {
              // 倒計時
              countDown(moBox, action);
            }
          }
        });
      }
      //
      this.formElem.find('span[data-phcode]').click(getPhoneCodeFn);
      this.formElem.find('button[data-phcode]').click(getPhoneCodeFn);

      $("#phoneCode").click(() => {
        let postData = this.formCompleted($("#formContain"));
        if (postData) {
          this.getData('/ajax_user/authenticate', postData, () => {
            // 下一步
            this.resetPwdPost();
          });
        } else {
          // 重置 点击条件
          this.postBusy = false;
        }
      });
      // this.bindInputCheck();
      this.formElem.find('input[name="phoneCode"]').focus();
    });
  }
  // 3重置密碼步驟
  resetPwdPost() {
    // 重置密碼 模板
    this.restPwdTpl = `<p data-form="lable">
      <span>${this.lang.loginPwd}</span><input type="password" name="password" maxlength="16" onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false" placeholder="${this.lang.loginPwdHolder}">
      <span class="warn-tips-win" data-warn="msg"></span>
    </p>
    <p data-form="lable">
      <span>${this.lang.surePwd}</span><input type="password" name="repassword" maxlength="16" onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false" placeholder="${this.lang.surePwdHolder}">
      <span class="warn-tips-win" data-warn="msg"></span>
    </p>
    <p><button class="submit-btn" id="surePwd">${this.lang.NextStep}</button></p>
    `;
    this.upDateView(3, this.restPwdTpl, () => {
      $('#surePwd').click(() => {
        let postData = this.formCompleted($("#formContain"));
        if (postData) {
          this.getData('/ajax_user/resetPassword', postData, (res) => {
            this.setSuccess(res.msg);
          });
        } else {
          //
          this.postBusy = false;
        }
      });
      // this.bindInputCheck();
    });
  }
  // 4设置成功
  setSuccess(msg) {
    const successTpl = `
    <div class="succ-win">
      <div class="succ-icon"></div>
      <div id="succTitle" class="">${msg}</div>
    </div>
    <p class="succ-btn"><button class="submit-btn" id="goLogin">${this.lang.goLogin}</button></p>
    `;
    //
    this.upDateView(4, successTpl, () => {
      $("#goLogin").click(() => {
        this.close();
        if (this.options && typeof this.options.loginFn === 'function') {
          this.options.loginFn();
        }
      });
    });
  }
  //
  getData(url, data, callback) {
    if (this.postBusy) return;
    this.postBusy = true;
    let moBox = this;
    http({
      url: url,
      method: 'POST',
      data: data,
      success(res) {
        if (res && res.status && parseInt(res.status) === 1) {
          moBox.postBusy = false;
          if (callback && typeof callback === 'function') {
            callback(res);
          }
        } else {
          if (res.data == 'captcha') {
            moBox.randomImgCode();
          }
          moBox.postBusy = false;
        }
      },
      error() {
        moBox.postBusy = false;
      }
    });
  }
  // 顯示提示 $elem: 需要操作的元素的jquery对象， content: 提示內容， type：'error'(錯誤), 默認不传
  focusWarnTips($elem, content) {
    $elem.removeClass('err-warn-win weak-pwd midd-pwd good-pwd');
    $elem.html(content).show();
  }
  // 红色边框提示
  errInput($input, isCorrect) {
    if (!isCorrect) {
      $input.parents('[data-form="lable"]').addClass('err-input');
    } else {
      $input.parents('[data-form="lable"]').removeClass('err-input');
    }
  }
  // 失去焦點 格式校驗
  blurWarnTips($elem, content, isEmpty) {
    // 如果錯誤，顯示錯誤提示
    if (!isEmpty) {
      $elem.addClass('err-warn-win').html(content).show();
      // 红色 提醒边框
      this.errInput($elem);
    } else {
      //
      this.errInput($elem, 'isCorrect');
      $elem.hide().removeClass('err-warn-win');
    }
  }
  // 校驗 input 輸入是否符合規則
  checkInput($input) {
    const val = $input.val();
    const name = $input.attr('name');
    let result;
    // 校驗規則是否正確
    if (name !== 'password' && name !== 'repassword') {
      if (val) {
        if (!this.inputRules[name].test(val)) {
          // this.warnTips($input.siblings('span[data-warn]'), this.lang.warn[name].err, 'error');
          result = false;
        } else {
          result = true;
        }
      } else {
        result = null;
      }
    }
    return result;
  }
  // 密碼規則校驗
  chkpwd(val) {
    /* eslint-disable */
    // 密碼
    const pwdRule = {
      num: /\d/g,
      letter: /[a-zA-Z]/g,
      punctuation: /[~\!@#\$\^&\*()\+\-\=\|:\;\,\.<>\/?*]/g,
      hasSpan: /\s/g,
      noCh: /[\u4e00-\u9fa5]/g
    };
    /* eslint-enable */
    const result = {};
    Object.keys(pwdRule).forEach((key) => {
      if (pwdRule[key].test(val)) {
        result[key] = true;
      }
    });
    return result;
  }
  // 获取短信验证码ewui6
  getphoneCode(action) {
    http({
      url: 'Ajax_user/phoneCode',
      method: "POST",
      data: {
        action: action
      },
      success(data) {
        // console.log(data);
      }
    });
  }
  // submit
  formCompleted($form) {
    let inputs = [...$form.find('input')];
    let isComplete = true;
    const poseData = {};
    //
    inputs.forEach((inp) => {
      this.inputBlurFn(inp, 'submit');
      let $inp = $(inp);
      let inpName = $inp.attr('name');
      if (inpName !== "password" && inpName !== 'repassword') {
        if (!this.checkInput($inp)) {
          isComplete = false;
          // 红色 提示框
          this.errInput($inp);
        } else {
          poseData[$inp.attr('name')] = $inp.val();
        }
      } else {
        const errDomNum = $("#formContain .err-input");
        if (errDomNum.length > 0) {
          isComplete = false;
        } else {
          poseData[$inp.attr('name')] = $inp.val();
        }
      }
    });
    return isComplete ? poseData : isComplete;
  }
}

export default ResetPwd;
