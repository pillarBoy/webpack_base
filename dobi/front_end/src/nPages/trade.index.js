/* old js */
import navTrade from '@/components/nav-trade';
import register from '@/components/register';
import HoverWin from '@/components/hoverWin';
import ResetPwd from '@/components/resetPassword';
import getLanguagePack from '@/components/tradeLanguagePack';

/* eslint-disable */
import '@/styles/common/navDefault.scss';
import '@/styles/trade/trade.scss';

import Vue from 'vue';
import is from 'tools/is';
// import math from 'mathjs';
import http from 'tools/http';
/* eslint-disable no-unused-vars */
import filters from '@/filters';
import directives from '@/directives';
/* eslint-enable */
import publicFn from '@/plugins/publicKey';
import { numUseNoDot, toFixedNum } from '@/filters/filters';
import _ from 'lodash';
import math from 'mathjs';
import talking from '@/tools/talking/talking';

// 包含 **** 表示需要优化的地方


window.onload = function() {
  talking();
  /* eslint-disable */
  // 参数必须为 字符串
  function convertNum(num_str) {
    // 如果不包含e 直接返回
    // if (num_str.indexOf('e') < 0 || num_str.indexOf('E') < 0) {
    //   return num_str;
    // }
    // 科学计数法字符 转换 为数字字符， 突破正数21位和负数7位的Number自动转换
    // 兼容 小数点左边有多位数的情况，即 a×10^b（aEb），a非标准范围（1≤|a|<10）下的情况。如 3453.54E-6 or 3453.54E6
  	var resValue = '',
  		power = '',
  		result = null,
  		dotIndex = 0,
  		resArr = [],
  		sym = '';
  	var numStr = num_str.toString();
  	if (numStr[0] == '-') {  // 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
  		numStr = numStr.substr(1);
  		sym = '-';
  	}
  	if ((numStr.indexOf('E') != -1) ||(numStr.indexOf('e') != -1)) {
    	var regExp = new RegExp( '^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$','ig' );
    	result = regExp.exec(numStr);
    	if (result != null) {
     		resValue = result[2];
     		power = result[5];
     		result = null;
   		}
    	if (!resValue && !power){ return false}
      dotIndex = resValue.indexOf('.');
      resValue = resValue.replace('.','');
      resArr = resValue.split('');

      if (Number(power) >= 0){
        var subres = resValue.substr(dotIndex);
        power = Number(power);
        //幂数大于小数点后面的数字位数时，后面加0
        for(var i=0; i<power-subres.length; i++) {
          resArr.push('0');
        }
        if(power-subres.length < 0){
        	resArr.splice(dotIndex+power, 0, '.');
        }
      } else {
        power = power.replace('-','');
        power = Number(power);
        //幂数大于等于 小数点的index位置, 前面加0
        for(var i=0; i<=power-dotIndex; i++) {
      	  resArr.unshift('0');
        }
        var n = power-dotIndex >= 0 ? 1 : - (power - dotIndex);
        resArr.splice(n, 0, '.');
      }
    }

  	resValue = resArr.join('');
    return sym + resValue;
  }
  /* eslint-enable */

  //获取语言包
  let phpLang = getLanguagePack() || {
    CANCEL_FIAL: "撤單未成功",
    NET_ERROR: "網絡繁忙",
    TRUST_STATUS_ALL: "全部成交",
    TRUST_STATUS_PART: "部分成交",
    TRUST_STATUS_NO: "未成交",
    TRUST_STATUS_CANCEL: "已撤銷",
    TRUST_STATUS_FIND: "查詢中",
    INPUT_NEED_VALID: "請輸入數字,小數點後最多8位",
    FLOATNUM_A: "價格必須大於$min,小於$max,最多",
    FLOATNUM_B: "最多$float位小數",
    MAX_TRADE_NUM: "最大交易數量為:",
    MIN_TRADE_NUM: "最小交易數量為:",
    AMOUNT_MAX: "最多",
    TRADE_BUY_IN: "買入",
    TRADE_SELL_OUT: "賣出",
    TRADE_CANCEL: "撤銷",
    OPEN_SOON: "即將開放",
    LOADING: "加载中...",
    TRADE_AREA_TITLE: "交易區",
    PRICE_HOLDE: "請輸入價格",
    NUMBER_HOLDE: "請輸入數量",
    TRADE_MIN: "交易數量不能小於",
    TRADE_MAX: "交易數量不能大於",
    BUY_OVER: "超出可買入額，請檢查後重新輸入",
    SELL_OVER: "超出可賣出額，請檢查後重新輸入"
  };
  navTrade(phpLang);
  //人民币悬浮框
  const myHover = new HoverWin($('[data-tormb]'), 'tormb');
  myHover.loadingTips = phpLang.LOADING;
  //调用悬浮框
  function addHoverWin($elem, attr, direction) {
    $($elem).off('mouseenter');
    $($elem).mouseenter(function(e) {
      if (e.stopPropagation) e.stopPropagation();
      myHover.setHover(this, attr, direction);
    });
    $($elem).mouseleave(function() {
      myHover.hide();
    });
  }

  // function addKeyUpWin($elem, attr, direction) {
  //   // 第一次focus就执行显示
  //   myHover.setHover($elem, attr, direction);
  //   // 监听按键按起再执行
  //   $($elem).keyup(function() {
  //     myHover.setHover(this, attr, direction);
  //   });
  //   // 失焦时隐藏
  //   $($elem).blur(function() {
  //     myHover.hide();
  //   });
  // }

  // 注册登录、交易密码悬浮框相关函数
  const registerObj = register(function() {
    const resetPwdFn = new ResetPwd();
    resetPwdFn.pushPhoneNum();
  });
  // 关闭隐藏事件
  registerObj.rootCallBack = function() {
    $(`form[data-form="trade"] .is-submitting`).removeClass('is-submitting').children('input[disabled]').removeAttr('disabled');
  };

  // 鼠标移入交易规则显示全部规则
  $('#sidebar-catch').on('mouseenter', function() {
    $(this).parent().stop().animate({ right: '-30px' }, 'fast');
  });

  $('#sidebar-container').on('mouseleave', function() {
    $(this).stop().animate({ right: '-330px' }, 'fast');
  });

  // 注册插件
  Vue.use(publicFn);
  //
  new Vue({
    data: {
      // 是否允许轮询 获取数据
      canTimeout: true,
      // 当前交易场
      curArea: '',
      // 所有交易场
      areas: {},
      hasArea: false,
      // 轮询 时长
      delayT: 2000,
      // 当前币种
      coinFrom: '',
      // 交易区
      coinTo: '',
      tradeData: {
        // 我的委托
        mytrust: [{}],
        // 成交 记录
        orders: {
          d: [],
          price: '--',
          max: '--',
          min: '--',
          money: '--',
          ratio: '1',
          sum: '--'
        },
        // 买 卖 价格
        trust: {
          buy: [],
          sale: []
        }
      },

      // btc人民币价格
      rmbPrice: 0,
      // btc 可用余额 （btc） _ 为了 根后端字段名 统一
      area_over: '--',
      area_lock: '--',
      // 当前币 可用余额
      coin_over: '--',
      coin_lock: '--',

      // 买入表单
      buyForm: {
        price: '',
        number: '',
        type: 'in',
        coin_from: '',
        coin_to: '',
        pwdtrade: '',
        reqToken: ''
      },
      // 买入 规则
      buyFormRule: {
        // 价格小数 位数
        pfloat: 8,
        // 数量小数 位数
        nfloat: 8,
        // 交易数量 最大值
        max: '',
        // 交易数量 小於最小值提示
        min: ''
      },
      // 卖出表单
      sellForm: {
        price: '',
        number: '',
        type: 'out',
        coin_from: '',
        pwdtrade: '',
        coin_to: '',
        reqToken: ''
      },
      // 卖出 规则
      sellFormRule: {
        // 价格小数 位数
        pfloat: 8,
        // 数量小数 位数
        nfloat: 8,
        // 交易数量 最大值
        max: '',
        // 交易数量 小於最小值提示
        min: ''
      },

      // 表单校验 提示 框 开关
      buyTips: false,
      // 0 红色 失败； 1绿色，成功
      buyTipsTheme: 0,
      sellTips: false,
      // 0 红色 失败； 1绿色，成功
      sellTipsTheme: 0,
      // 滑杆
      buyRang: 0,
      sellRang: 0,
      // 滑竿长度
      trackWidth: 0,
      // 鼠标状态 up or down
      mouseStatu: 'up',
      // 鼠标所在当前位置
      mouseStartX: 0,
      // 滑竿左边边缘位置
      edgeLeft: 0,
      edgeRight: 0,
      // 交易密码
      pwdTrade: '',
      // 下单成功状态
      buyOrderOk: false,
      sellOrderOk: false,
      // 当前交易类型 buy or sell
      orderType: '',
      // 设置交易密码 开关
      setPwd: false,
      // 交易密码 提示内容
      pwdTips: '',
      // 提交状态
      submitting: false,
      buySubmitting: false,
      sellSubmitting: false,
      // 正在撤销 列表
      cancellingQueue: [],
      // 登录状态
      isLogin: true
    },
    created() {
      this.$getPublicKey();
    },
    updated() {
      // 示例 擁有 data-tormb 屬性的元素，2. 需要顯示的 內容在data- 的 tormb 的值中 3. 顯示方向 在 (可以選擇 "left", "top", "right", "bottom" 四個方向 默認上方)
      addHoverWin($('#day-volumn'), 'tormb', 'bottom');
      addHoverWin('.amount-box [data-tormb]', 'tormb', 'top');

      addHoverWin($('#newest-price'), 'tormb', 'bottom');
      addHoverWin($('#lowest-price'), 'tormb', 'bottom');

      addHoverWin($('#deal-list tr'), 'tormb', 'left');
      addHoverWin($('#buyin-list tr'), 'tormb', 'left');
      addHoverWin($('#sellout-list tr'), 'tormb', 'left');
      addHoverWin($('.delegate-table tr'), 'tormb', 'top');
      addHoverWin($('form[id^="form"] [data-tormb]'), 'tormb', 'top');
    },
    mounted() {
      // 鼠标释放 时，关闭滑竿 计算
      document.body.onmouseup = () => {
        this.mouseStartX = 0;
        this.mouseStatu = '';
      };
      document.body.onmousemove = (e) => {
        this.moveDot(e, this.mouseStatu);
      };
      // 获取滑竿 width
      let style = window.getComputedStyle(this.$refs.track, null);
      this.trackWidth = parseInt(style.width);
      // 獲取 當前 幣信息
      this.coinFrom = $('.curr-mar').find('h2').data('from');
      this.coinTo = $('.curr-mar').find('h2').data('to');
      let token = $("#hahaha").html().trim();
      //
      this.buyForm.coin_from = this.coinFrom;
      this.buyForm.coin_to = this.coinTo;
      this.buyForm.reqToken = token;
      this.sellForm.coin_from = this.coinFrom;
      this.sellForm.coin_to = this.coinTo;
      this.sellForm.reqToken = token;
      // 获取 交易区数据
      this.getAreaData();
      // 获取 交易中心列表数据
      this.tradeDataFn();
      // 获取用户信息
      this.getUserInfo();
      this.getRmbPrice();
    },
    methods: {
      // login
      login() {
        registerObj.loginFn();
      },
      register() {
        registerObj.registerFn();
      },
      // 获取币 价格
      getRmbPrice() {
        http({
          url: `/ajax_market/coinPrice?coin=${this.coinTo}`,
          success: ({ status, data }) => {
            //
            if (parseInt(status) === 1) {
              this.rmbPrice = data;
              this.$forceUpdate();
            }
            //
            if (this.canTimeout) {
              setTimeout(() => {
                this.getRmbPrice();
              }, this.delayT);
            }
          },
          error: () => {
            if (this.canTimeout) {
              setTimeout(() => {
                this.getRmbPrice();
              }, this.delayT);
            }
          }
        });
      },
      // computed price
      compPrice(coin) {
        let price = '--';
        if (this.rmbPrice && coin - 0 > 0) {
          price = (coin * this.rmbPrice).toFixed(2);
        }
        return price;
      },
      // 获取 后台配置规则
      getPhpRule(json, type) {
        // 解构赋值
        (this[`${type}FormRule`] = json);
      },
      // 获取用户信息
      getUserInfo() {
        http({
          url: `/ajax_user/getUserInfo?coin=${this.coinFrom}_${this.coinTo}`,
          method: 'GET',
          success: (res) => {
            let { status, data } = res;
            // 如果后台 返回正常json 正常处理
            if (status != undefined) {
              let intStatus = parseInt(status);
              // status 一直是1 data 可能是null（未登录）
              if (intStatus === 1 && data) {
                this.area_over = data[`${this.curArea}_over`];
                this.area_lock = data[`${this.curArea}_lock`];
                this.coin_over = data[`${this.coinFrom}_over`];
                this.coin_lock = data[`${this.coinFrom}_lock`];
              }
              // 是否登录
              if (data) {
                this.isLogin = true;
              } else {
                this.isLogin = false;
              }
            }
            if (this.canTimeout) {
              // 轮询
              setTimeout(() => {
                this.getUserInfo();
              }, this.delayT);
            }
          },
          error: () => {
            this.getUserInfo();
          }
        }, 'noAlert');
      },
      // 切换 交易场
      changeArea(areaName) {
        this.curArea = areaName;
      },
      // 切换币
      changeCoin(coin) {
        window.location.href = `/trade/${coin}`;
      },
      // 获取 交易场 数据
      getAreaData() {
        $.ajax({
          url: '/ajax_market/getAllQuote',
          type: 'GET',
          success: ({ status, data }) => {
            let intStatus = parseInt(status);
            if (intStatus === 1) {
              this.hasArea = true;
              this.areas = Object.assign({}, data);
              this.resetTHead();
            }
            if (this.canTimeout) {
              setTimeout(() => {
                this.getAreaData();
              }, this.delayT);
            }
          },
          error: () => {
            setTimeout(() => {
              this.getAreaData();
            }, this.delayT);
          }
        });
      },
      // 重置 表头 样式
      resetTHead() {
        let tbodys = this.$refs.element;
        let thead = this.$refs.thead;
        let theadTds = '';
        // 表头
        if (thead) {
          theadTds = thead.children;
        }
        // 表格
        if (tbodys) {
          let firstTr = tbodys[0].firstChild;
          let tds = [...firstTr.children];
          if (theadTds) {
            tds.forEach((td, key) => {
              let tdStyle = window.getComputedStyle(td);
              theadTds[key].style.minWidth = tdStyle.width;
            });
          }
        }
      },
      // 买卖 我的委托 表格
      tradeDataFn() {
        let url = `/ajax_trade/tradeData?coin=${this.coinFrom}_${this.coinTo}`;
        http({
          url,
          method: 'GET',
          success: ({ status, data }) => {
            let intStatus = parseInt(status);
            if (intStatus === 1) {
              this.tradeData = Object.assign({}, data);
            }
            if (this.canTimeout) {
              // 轮询
              setTimeout(() => {
                this.tradeDataFn();
              }, this.delayT);
            }
          },
          error: () => {
            this.tradeDataFn();
          }
        });
      },
      // 点击 卖出 盘面（列表）
      sellClick(coinData) {
        // 填入价格 买卖 form 都填入
        this.autoFixPrice(coinData);
        // 填入数量 只填 **买入**（是买，没有错，反过来的） form
        this.autoFixNum(coinData, 'buy');
      },
      // 点击 买入 盘面（列表）
      buyClick(coinData) {
        this.autoFixPrice(coinData);
        // 填入数量 只填 **卖出**（是 卖 ，没有错，反过来的） form
        this.autoFixNum(coinData, 'sell');
      },
      // 自动填入买卖价格 买卖
      autoFixPrice(coinData) {
        if (coinData.p) {
          // 去除多余的零 和 多余的 .
          let price = numUseNoDot(coinData.p);
          this.buyForm.price = price;
          this.sellForm.price = price;
        }
      },
      // 自动填入 数量
      autoFixNum(coinData, type) {
        // 买入 form 填充数量
        if (type === 'buy') {
          let formNum = '';
          // 如果下单数量 比可买数量大 ，则填入 可买数量
          formNum = coinData.l - this.canBuyNum > 0 ? this.canBuyNum : coinData.l;
          // 去除多余的零 和 多余的 .
          formNum = numUseNoDot(formNum);
          this.buyForm.number = formNum;
        }
        // 卖出 form 填充数量
        else {
          let formNum = '';
          // 如果下单数量 比 當前币 数量大 ，则填入 當前币 数量
          formNum = coinData.l - this.coin_over > 0 ? this.coin_over : coinData.l;
          // 去除多余的零 和 多余的 .
          formNum = numUseNoDot(formNum);
          this.sellForm.number = formNum;
        }
      },
      // 校验 交易 价格  限制只输入数字 包括小数
      checkNum(val, type) {
        let result = '';
        let needChange = false;
        if (val) {
          // 转换 字符串
          if (!is(val, 'String')) {
            val += '';
          }
          // 限制小数 位数
          let nfloat = this[`${type}FormRule`].nfloat;
          // 输入 是否是数字
          const numReg = /^(\d+(?:\.[0-9]*)?)/g;
          // 截取规则 有效数字 规则
          const mathRule = new RegExp(`^([0-9]+(?:\\.[0-9]{0,${nfloat}})?)`, 'g');

          // 是否存在 有效数字
          if (numReg.test(val)) {
            // 截取规则内的数据
            let usefullNum = val.match(mathRule);
            if (usefullNum) {
              needChange = true;
              result = usefullNum[0];
            }
          } else {
            needChange = true;
            result = '';
          }
        }
        return { needChange, result };
      },
      // 限制 输入价格 规则
      priceInput(type) {
        let val = this[`${type}Form`].price;
        let checkNum = this.checkNum(val, type);
        // 是否需要 修改 输入值
        if (checkNum.needChange) {
          this[`${type}Form`].price = checkNum.result;
        }
      },
      // 数量 输入
      numInput(type) {
        let val = this[`${type}Form`].number;
        let checkNum = this.checkNum(val, type);
        if (checkNum.needChange) {
          this[`${type}Form`].number = checkNum.result;
        }
      },
      // 表单 校验 提示
      showTips(type, msg, callback, times = 2000) {
        this[`${type}Tips`] = msg;
        // 是否需要 回掉
        if (callback && is(callback, 'Function')) {
          callback();
        }
        setTimeout(() => {
          this[`${type}Tips`] = '';
          this[`${type}TipsTheme`] = 0;
          this[`${type}OrderOk`] = false;
        }, times);
      },
      // 买入规则校验 判断最大值 最小值;  是否超出: (buy)可买约 或者 （sell）当前币 余额
      checkForm(type) {
        let isCompleted = true;
        let { number } = this[`${type}Form`];
        // 价格判断 小于最小值 交易數量不能小於
        if (number - this[`${type}FormRule`].min < 0) {
          this.showTips(type, `${phpLang.TRADE_MIN + numUseNoDot(this[`${type}FormRule`].min)}`);
          isCompleted = false;
        }
        // 大于最大值  msg:交易數量不能大於
        if (number - this[`${type}FormRule`].max > 0) {
          this.showTips(type, `${phpLang.TRADE_MAX + numUseNoDot(this[`${type}FormRule`].max)}`);
          isCompleted = false;
        }

        return isCompleted;
      },
      // 下单 公共判断 是否为空 是否为 0
      submitOrder(type) {
        // 防止重复提交
        if (this.submitting) return;
        this.submitting = true;
        let isCompleted = true;
        let { number, price } = this[`${type}Form`];

        // 重置 提示颜色状态
        this[`${type}OrderOk`] = false;
        // 价格 为空 或 0  msg: 請輸入價格
        if (price === '' || price - 0 <= 0) {
          isCompleted = false;
          this.showTips(type, phpLang.PRICE_HOLDE);
        }
        // 数量 为空 或 0  msg: 請輸入數量
         else if (number === '' || number - 0 <= 0) {
          isCompleted = false;
          this.showTips(type, phpLang.NUMBER_HOLDE);
        }
        // 买入buy，交易额＞BTC可用余额  超出可买入额，请检查后重新输入  msg:超出可買入額，请检查后重新输入
        else if (type === 'buy' && this.buySettle - this.area_over > 0) {
          isCompleted = false;
          this.showTips(type, phpLang.BUY_OVER);
        }
        // 卖出sell 按钮，数量 > 当前币余额 提示;  交易额＞MCC可用余额X卖出价=可卖约  msg：超出可賣出額，請檢查后重新輸入
        else if (type === 'sell' && number - this.coin_over > 0) {
          isCompleted = false;
          this.showTips(type, phpLang.SELL_OVER);
        }
        if (!isCompleted) {
          return this.submitting = false;
        }
        // 下单 买卖
        if (this.checkForm(type)) {
          // 记录当前交易类型 buy or sell
          this.orderType = type;
          let postData = this.$jsencrypt(Object.assign({}, this[`${type}Form`]));
          // 下单
          http({
            method: 'POST',
            url: '/ajax_trade/setTrust',
            data: postData,
            success: ({ status, data, msg }) => {
              if (status === undefined || data === undefined) {
                this.showTips(type, 'The server is busy, please try again later');
              }
              // 下单成功
              if (parseInt(status) === 1) {
                this[`${type}TipsTheme`] = 1;
                this[`${type}OrderOk`] = true;
                this.showTips(type, msg, () => {
                  // 清空数量
                  this[`${type}Form`].number = '';
                });
              }
              // 下单失败
              else {
                // 0.是否 登陸
                if (data.need_login && parseInt(data.need_login) === 1) {
                  this.showTips(type, msg, () => {
                    registerObj.loginFn();
                  });
                }

                // 1.用户还未设置实名认证 toast提示【请实名认证后再操作】
                if (data.need_real_auth && parseInt(data.need_real_auth) === 1) {
                  // 请实名认证后再操作
                  this.showTips(type, msg, () => {
                    // 转跳
                    window.location.href = "/user/realinfo";
                  });
                }

                // 2.请设置交易密码后再操作
                if (data.need_set_tpwd && parseInt(data.need_set_tpwd) === 1) {
                  // 请实名认证后再操作
                  this.showTips(type, msg, () => {
                    // 输入 交易密码 提示 显示 输入框
                    window.open('/user?set=tradepwd');
                  });
                }

                // 3.输入交易密码 status
                if (data.need_trade_pwd) {
                  // 请实名认证后再操作
                  this.setPwd = true;
                }
              }

              // 再次提交开关
              this.submitting = false;
            },
            error: () => {
              this.showTips(type, 'The server is busy, please try again later');
              this.submitting = false;
            }
          }, 'noAlert');
        } else {
          this.submitting = false;
        }
      },
      // 确认交易密码
      surePwd() {
        let postData = this.$jsencrypt({ pwdtrade: this.pwdTrade });
        http({
          url: '/ajax_trade/pwdtradeAuth',
          method: 'POST',
          data: postData,
          success: ({ status, msg }) => {
            if (status === undefined) {
              this.pwdTips = 'The server is busy, please try again later';
            }
            // // 交易密码正确
            if (parseInt(status) === 1) {
              this.setPwd = false;
              this.pwdTips = '';
              this.submitOrder(this.orderType);
            }
            // 交易密码 输入 有误
            else {
              // this.pwdTrade = '';
              this.pwdTips = msg;
            }
          },
          error: () => {
            this.pwdTips = 'The server is busy, please try again later';
          }
        }, 'noAlert');
      },
      // 正在撤销 列表
      canceling(id) {
        let status = false;
        if (_.indexOf(this.cancellingQueue, id) > -1) {
          status = true;
        }
        return status;
      },
      // 撤销
      cancelOrder(order, agrStatus) {
        if (order.status - 2 >= 0) {
          return;
        }
        //  此单 在取消订单列表  是否在取消队列里 不在订单，执行取消 在，就返回
        if (_.indexOf(this.cancellingQueue, order.id) > -1) {
          return;
        }
        // 不在撤銷列表 加入 列表
        else {
          this.cancellingQueue.push(order.id);
        }
        // 更改状态 撤銷中 ...
        // order.status = 5;

        // 记录原来的状态
        let oldStatus = agrStatus;
        // 缓存订单号  用于 移除取消成功 从取消列表移除
        let id = order.id;
        let postData = {
          id: order.id,
          coin_from: this.coinFrom,
          coin_to: this.coinTo,
          reqToken: this.sellForm.reqToken
        };
        //

        http({
          url: '/ajax_trade/trustcancel',
          method: 'POST',
          data: postData,
          success: ({ status }) => {
            if (parseInt(status) === 1) {
              order.status = 3;
            } else {
              order.status = oldStatus;
            }
            _.remove(this.cancellingQueue, key => key === id);
          },
          error: () => {
            order.status = oldStatus;
            _.remove(this.cancellingQueue, key => key === id);
          }
        });
      },
      // formNum 赋值
      formNumValue(type, percen) {
        let number = '';
        // sell numer = 当前币 余额 * 百分比
        if (type === 'sell') {
          number = this.coin_over * percen;
          if (percen - 1 < 0) {
            number = `${number}`.slice(0, 10);
          }
        }
        // buy number = 可买约 * 百分比
        else if (this.canBuyNum && this.canBuyNum != '--') {
          number = this.canBuyNum * percen;
          if (percen - 1 < 0) {
            number = `${number}`.slice(0, 10);
          }
        }
        let strNum = number + '';
        if (strNum.indexOf('e') > -1) {
          number = convertNum(strNum);
        }
        // 赋值
        this[`${type}Form`].number = number;
      },
      // 点击 滑杆 圆点
      rangeOn($event, type) {
        this.mouseStartX = $event.pageX;
        this.mouseStatu = type;
        // **** 这里要改成原生写法 计算 元素在屏幕的位置
        this.edgeLeft = $($event.target).parent().offset().left;
      },
      // 移动 滑竿
      moveDot($event, type) {
        // 如果点击了 圆点
        if (this.mouseStartX > 0) {
          // 鼠标相对移动位置 x方向
          let offsetX = $event.pageX - this.edgeLeft;

          // 鼠标位置是否超出滑竿左边边缘位置
          if ($event.pageX - this.edgeLeft <= 0) {
            offsetX = 0;
          }
          // 超出范围
          if (offsetX - this.trackWidth >= 0) {
            offsetX = this.trackWidth;
          }

          // 计算百分百
          let percen = 0;
          if (offsetX != 0) {
            percen = (offsetX / this.trackWidth).toFixed(3);
          }

          // 赋值
          this.formNumValue(type, percen);
        }
      },
      // 点击 滑竿
      trackClick($event, type) {
        // **** 这里要改成原生写法 计算 元素在屏幕的位置
        this.edgeLeft = $($event.target).offset().left;
        let offsetX = $event.pageX - this.edgeLeft;
        let percen = (offsetX / this.trackWidth).toFixed(1);
        // 赋值
        this.formNumValue(type, percen);
      }
    },
    computed: {
      // 计算 可买入 约
      canBuyNum() {
        let result = '--';
        if (this.buyForm.price && parseFloat(this.buyForm.price) > 0) {
          let canBuy = this.area_over / this.buyForm.price;
          // 保证有足够20位小数
          canBuy = canBuy.toFixed(20);
          canBuy.replace(/[0-9]*(?:\.[0-9]{8})/g, (key) => {
            result = key;
          });
        }
        return result;
      },
      // 计算 可卖出 约
      canSellNum() {
        let result = '--';
        if (this.sellForm.price && parseFloat(this.coin_over) > 0) {
          result = this.coin_over * this.sellForm.price;
        }
        let strRes = result + '';
        if (strRes.indexOf('e') > -1) {
          result = convertNum(strRes);
        }
        //
        strRes = result + '';
        if (strRes.length > 19) {
          strRes = strRes.slice(0, 19);
        }
        if (strRes != '--') {
          strRes = numUseNoDot(strRes);
        }
        return strRes;
      },
      // 买入 交易额 结算
      buySettle() {
        let settle = math.multiply(this.buyForm.price, this.buyForm.number) + '';
        // 是否有e
        if (settle.indexOf('e') > -1) {
          settle = convertNum(settle);
        }
        // 保留指定位小数
        let resSel = toFixedNum(settle);
        return numUseNoDot(resSel);
      },
      // 卖出 交易额 结算
      sellSettle() {
        let settle = this.sellForm.price * this.sellForm.number + '';
        // 是否有e
        if (settle.indexOf('e') > -1) {
          settle = convertNum(settle);
        }
        // 保留指定 (8默认) 位小数
        return toFixedNum(settle);
      },
      // 买入 下单比例 = (买入数量 / 可买入约) * 100;
      buyRatio() {
        let ratio = '0';
        if (this.buyForm.number && this.canBuyNum && this.canBuyNum != '--') {
          ratio = ((this.buyForm.number / this.canBuyNum) * 100).toFixed(1);
        }
        // 去除多余的 0 和 .
        ratio = numUseNoDot(ratio);
        // 超出 100 只显示 100
        if (ratio - 100 > 0) {
          ratio = '100';
        }
        // 不满 100
        if (ratio === '100' && this.canBuyNum - this.buyForm.number > 0) {
          ratio = '99.9';
        }

        if (!ratio) {
          ratio = '0';
        }
        this.buyRang = ratio;
        return ratio;
      },
      // 卖出 下单比例 = (卖出数量 / 当前 币余额 ) * 100
      sellRatio() {
        let ratio = '0';
        if (this.sellForm.number && this.coin_over) {
          ratio = ((this.sellForm.number / this.coin_over) * 100).toFixed(1);
        }
        // 去除多余的 0 和 .
        ratio = numUseNoDot(ratio);
        // 超出 100 只显示 100
        if (ratio - 100 > 0) {
          ratio = '100';
        }
        // 不满 100
        if (ratio === '100' && this.coin_over - this.sellForm.number > 0) {
          ratio = '99.9';
        }

        if (!ratio) {
          ratio = '0';
        }
        this.sellRang = ratio;
        return ratio;
      },
      // buy 滑竿  原点 left 位置
      buyDotLeft() {
        return this.trackWidth * (this.buyRatio / 100) + 'px';
      },
      // sell 滑竿  原点 left 位置
      sellDotLeft() {
        return this.trackWidth * (this.sellRatio / 100) + 'px';
      }
    },
    watch: {
      pwdTrade(newPwd) {
        this.pwdTips = '';
        // 赋值
        this.buyForm.pwdTrade = newPwd;
        this.sellForm.pwdTrade = newPwd;
      },
      // 用于区分下单状态管理
      submitting(newStatus) {
        this[`${this.orderType}Submitting`] = newStatus;
      }
    }
  }).$mount("#app");
};

export default {};
