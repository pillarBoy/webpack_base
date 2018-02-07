import http from '@/tools/http';
import Alert from "@/tools/alert/alert"
//
export default () => {
  let myAlert = new Alert();
  let cancelBusy = false;
  $("[data-cancel]").click(function() {
    $(this).addClass("disable-btn");
    let coin = $("#coinList .sel-coin").html().trim();
    let coinId = $(this).parents("tr").find("td").eq(0).html().trim();
    // console.log(coin, coinId);
    if (cancelBusy) return;
    cancelBusy = true;
    http({
      method: "POST",
      url: "/ajax_user/cancelOut",
      data: {
        coin: coin.toLowerCase(),
        id: coinId
      },
      success({ status, data }) {
        // console.log(data);
        if (status && parseInt(status) === 1) {
          myAlert.show(data);
          window.location.reload();
        } else {
          $(this).removeClass("disable-btn");
          cancelBusy = false;
        }
      },
      error(err) {
        $(this).removeClass("disable-btn");
        cancelBusy = false;
      }
    })
  });
}
