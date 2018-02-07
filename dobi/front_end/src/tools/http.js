import is from 'tools/is.js';
import clone from 'clone';
import TIPS from './alert/alert';

const httpAlert = new TIPS();

function http(settings, noAlert) {
  // getLang("#baseLang");
  let lang = {
    sysError: '系統錯誤，請聯系客服協助處理。',
    timeout: '請求超時,請稍後重試',
    reqError: '請求超時,請稍後重試'
  };
  // 切换语言

  if (http.lang) {
    lang = http.lang;
  }
  // httpAlert.setHeader("提示");
  // 弹窗 公共 方法
  const defaultSettings = {
    timeout: 60000
  };
  let errCallBack = '';
  // 获取全部请求配置
  if (is(settings, 'Object')) {
    Object.keys(settings).forEach((key) => {
      switch (key) {
        // 封装 成功 回调函数
        case 'success': {
          const callback = clone(settings[key]);
          defaultSettings.success = function(req) {
            // 请求失败 0
            if (parseInt(req.status) === 0) {
              const { data } = req;
              // alert(req.msg);
              // 判断是否有重定向url
              if (is(data, 'Object') && parseInt(data.need_login) === 1) {
                // 后台没给重定向 url 时
                if (!data.reUrl) {
                  httpAlert.show(req.msg, function() {
                    window.location.href = '/?login';
                  });
                } else {
                  httpAlert.show(req.msg, function() {
                    window.location.href = data.reUrl;
                  });
                }
              } else if (req.msg && !noAlert) {
                if (is(req.msg, 'Object')) {
                  httpAlert.show(req.msg.content);
                } else {
                  httpAlert.show(req.msg);
                }
              }
            }
            // 参数错误
            else if (parseInt(req.status) === 2) {
              // 系统错误
              httpAlert.show(lang.sysError);
            }
            //
            if (is(callback, 'Function')) {
              // 回调 成功callback
              callback(req);
            }
          };
          break;
        }
        case 'url': {
          defaultSettings[key] = settings[key] || window.location.href.host + "" + settings[key];
          break;
        }
        case 'error': {
          if (settings[key]) {
            errCallBack = clone(settings[key]);
          }
          break;
        }
        default:
          defaultSettings[key] = clone(settings[key]);
      }
    });

    // 錯誤處理
    defaultSettings.error = function errDeal(err, status) {
      if (err.status === 408 || err.status >= 500 || err.status === 0) {
        // 請求超時,請稍後重試
        httpAlert.show(lang.timeout);
      }
      if (status >= 500) {
        httpAlert.show(lang.timeout);
      }
      //
      if (err.status === 403) {
        // '請求錯誤'
        httpAlert.show(lang.reqError);
      }
      // 錯誤處理 回掉
      if (errCallBack) {
        errCallBack(err);
      }
    }
  }
  return $.ajax(defaultSettings);
}

// http.__proto__.lang

export default http;
