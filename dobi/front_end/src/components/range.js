/* eslint-disable */
import math from '@/tools/math';
import eToNum from '@/tools/eNumToStr';
import mathjs from 'mathjs';
const mathObj = math();
const fixMulti = mathObj.fixMulti;
const cutFixedNum = mathObj.cutFixedNum;

export default function () {
  var rangeO = {};
  var rangeObj = {
    min: 0,
    max: 100,
    step: 10,
    $track: $(".range .track"),
    $dot: $(".range .dot"),
    trackLen: $(".range .track").width(),
    dotLen: $(".range .dot").width(),
  }
  var currentVal = 0;
  var fixedVal = 0;
  const rangeFunc = {
    isDrag : false,
    //鼠标开始按下
    onMouseDown: function(_this){
      const $this = $(_this);
      $this.on('mousedown', function(e){
        e.preventDefault && e.preventDefault();
        rangeFunc.isDrag = true;
        return rangeFunc.isDrag;
      })
    },
    // 开始移动
    onMouseMove: function(_this) {
      const $this = $(_this);
      $(window).on('mousemove', $this, function(e){
        e.preventDefault && e.preventDefault();
        // 鼠标按下，开始拖动
        if(rangeFunc.isDrag) {
          var mouseX = e.pageX,
          mouseY = e.pageY,
          trackLeft = $this.parent().offset().left,
          setLeft = mouseX - trackLeft - rangeObj.dotLen / 2,
          diffWid = rangeObj.trackLen - rangeObj.dotLen / 2;
          $this.css('left', setLeft + 'px');
          if (setLeft <= 0) {
            $this.css('left', -rangeObj.dotLen / 2 + 'px');
          } else if (setLeft > diffWid) {
            $this.css('left', diffWid + 'px');
          }
          currentVal = parseInt((($this.position().left + rangeObj.dotLen / 2) / rangeObj.trackLen) * 100);
          fixedVal = rangeObj.step * Math.round(currentVal / rangeObj.step);

          $this.closest('.track-container').next('p').html(fixedVal + '%');
          $this.parent().css({
            'backgroundSize': (currentVal - rangeObj.min) * 100 / (rangeObj.max - rangeObj.min) + '% 100%'
          });
          rangeFunc.count($this);
        }
      })
    },
    //取消移动
    cancelMove: function(_this){
      const $this = $(_this);
      $this.off('mousemove');
      currentVal = 0;
      fixedVal = 0;
    },
    /**
    * 計算交易額函數
    *
    * @param {任意一个输入框} _this
    * @param {兄弟输入框} siblingsInput
    * @param {放置交易额的DOM} settleHolder
    */
    countSettle: function(_this, siblingsInput, settleHolder){
      // return ;
      var thisVal = $.trim(_this.val());
      var siblingsVal = $.trim(siblingsInput.val());
      if(siblingsVal != ''){
        // var settleVal = fixMulti(thisVal, siblingsVal);
        let settleVal = mathjs.multiply(thisVal, siblingsVal);
        isNaN(settleVal)
        ? settleHolder.text('0.00')
        : settleHolder.text(eToNum(parseFloat(Number(settleVal).toFixed(8))));
        //
        if (window.rmbPrice) {
          settleHolder.attr('data-tormb', mathjs.multiply(window.rmbPrice, settleHolder.text()));
        } else {
          settleHolder.attr('data-tormb', '0');
        }
      }
    },
    /**
     * 将交易额计算结果重新渲染
     */
    count: function(_this){
      const $this = $(_this);
      const $thisForm = $this.closest('form[data-form="trade"]');
      // 可用余额
      const availUse = $thisForm.siblings('.amount-box').find('span[id$="-availUse"]').text();
      // 可买
      const availBuy = $thisForm.siblings('.amount-box').find('span[id$="-availBuy"]').text();
      const $firstInput = $thisForm.find('.input-g:eq(0)').find('input[data-input="trade"]');
      const $lastInput = $thisForm.find('.input-g:eq(1)').find('input[data-input="trade"]');
      const $settleHolder = $thisForm.find('span[id$="settle"]');
      //得出當前比例
      var ratio = $this.closest('.track-container').next('p').text();
      //填充對應比例的下單數量
      var ratioVal = ratio.substring(ratio.indexOf('%'), -1);
      // 买入
      if($thisForm.attr('id') === 'form-buy'){
        // 买入表单价格未输入时不允许滑动下单比例
        // $firstInput.val == '' ? rangeFunc.cancelMove() : true;
        if(!Number(availBuy)) return;
        // 计算买入交易数量不合法
        if(isNaN(fixMulti((ratioVal/100), availBuy))){
          $lastInput.val('');
        }
        //买入数量截取小叔点后8位
        else {
          var lastInputVal = mathjs.eval(`${ratioVal} / 100 * ${availBuy}`);
          // eToNum(fixMulti((ratioVal/100), availBuy));
          // $lastInput.val(cutFixedNum(lastInputVal));
          $lastInput.val(lastInputVal);
        }
      }
      // 卖出
      else{
        if(!Number(availUse)) return;
        // 计算买入交易数量不合法
        if(isNaN(fixMulti((ratioVal/100), availUse))){
          $lastInput.val('');
        }
        // 卖出数量截取小叔点后8位
        else{
          var lastInputVal = mathjs.eval(`${ratioVal} / 100 * ${availUse}`);
          // eToNum(fixMulti((ratioVal/100), availUse));
          // $lastInput.val(cutFixedNum(lastInputVal));
          $lastInput.val(lastInputVal);
        }
      }
      // 計算交易額
      rangeFunc.countSettle($lastInput, $firstInput, $settleHolder);

    // rangeFunc.countSettle($lastInput, $firstInput, $settleHolder);
    }

  }
  //rangeFunc结束
  $('form[data-form="trade"] .dot').on('mousedown', function (e) {
    var $this = $(e.target);
    //按下标记为true才开始响应移动事件
    rangeFunc.isDrag = true;
    rangeFunc.onMouseMove($this);
  });
  $(window).on('mouseup', rangeObj.$dot, function () {
    rangeFunc.cancelMove($(this));
  })
  rangeO.rangeObj = rangeObj;
  rangeO.rangeFunc = rangeFunc;
  return rangeO;
}
