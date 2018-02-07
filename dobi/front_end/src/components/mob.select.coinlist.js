export default (selCoin) => {
  // 防止 touchmove 点击
  let isMoveTouch = false;
  // touchstart
  function touchstart(e) {
    e.stopPropagation && e.stopPropagation();
    // 切换币列表显示状态
    let $option = $("#coinList");
    if ($option.is(":visible")) {
      $("#coinList").hide();

    } else {
      $("#coinList").show();
    }
  }
  // touchmove
  function touchmove() {
    isMoveTouch = true;
  }
  // touchend
  function touchend(e) {
    e.stopPropagation && e.stopPropagation();
    // 启动 点击 开关
    isMoveTouch = false;
  }
  // target 元素点击开始时
  function tarTouchStart() {
    isMoveTouch = false;
  }
  // target 元素点击 结束时
  function tarTouchEnd() {
    isMoveTouch = false;
  }
  //
  $("#changeCoin").on("touchstart", touchstart);
  //
  // 判断是否滚动
  $("#coinList").on('touchmove', touchmove);
  $("body").on("touchend", touchend);
  //
  $("#coinList span").on("touchend", function() {
    // 滚动时 不执行 点击事件
    if (isMoveTouch) return;
    //
    let coinName = $(this).html().trim();
    // 设置选择币结果
    $("#changeCoin").html(coinName);
    // 清除之前选择的币的样式
    $(this).siblings(".sel-coin").removeClass("sel-coin");
    $(this).addClass("sel-coin");
    // 切换币源， 刷新页面数据
    if (selCoin && typeof selCoin === 'function') {
      selCoin.call(this);
    }
    // 隐藏币 列表
    $("#coinList").hide();
    // 启动 点击 开关
    tarTouchStart();
    // isMoveTouch = false;
  });

  // 选择 币 切换币来源
  $("#coinOptions p").on("touchstart", function() {
    tarTouchEnd();
    isMoveTouch = false;
  });
  // 列表滚动 事件
  $("[data-sellist='list']").on("touchmove", touchmove);
  $("[data-sellist='list']").on("touchend", touchend);
  // 目标元素点击开始
  $("[data-optdom='targ']").on("tarTouchStart", tarTouchStart);
  $("[data-optdom='targ']").on("tarTouchEnd", tarTouchEnd);
}
