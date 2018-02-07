import "@/styles/userCenter/candy.scss";
import http from '@/tools/http';
import nav from '@/components/nav';
import getLanguagePack from '@/components/tradeLanguagePack';
import chkhttpLang from '@/tools/chgHpLg';
import activeNav from '@/components/userNav.js';
import setTableStyle from '@/components/makeTableHead';
import Alert from '@/tools/alert/alert';
import is from '@/tools/is';
// mobile
import "@/styles/mob/user.candy.scss";
import mobNav from "@/components/mo.nav";
import selCoinList from "@/components/mob.select.coinlist";
import FastClick from 'fastclick';
// import talking from '@/tools/talking/talking';
//
$(document).ready(function() {
  FastClick.attach(document.body);
  chkhttpLang("#baseLang", http);

  const lang = getLanguagePack() || {
    "CANDY_TH_COIN": "幣種",
    "CANDY_TH_START": "開始日期",
    "CANDY_TH_DATA": "截止日期",
    "CANDY_TH_GOT": "已領取",
    "GET_DATA_FAIL": "獲取數據失敗",
    "CANDY_ACTIVE_COIN": "活動贈送幣",
    "CANDY_CANGET": "領取",
    "CANDY_GOT": "恭喜你已經成功領取"
  };
  // 彈框
  const myAlert = new Alert("");
  mobNav();
  nav();
  activeNav();
  const $tab = $("#tableContent");
  const $thead = $('#dataBody').prev('thead');
  const content = $thead.find('tr').html();
  // 初始化
  setTableStyle();
  window.onresize = function() {
    setTableStyle();
  };
  //選擇幣種
  function selCoin() {
    const coinTypes = $(this).attr('data-coincode');
    //清空thead底下存在的表头
    $('#tHead').remove();
    $tab.find('#thead thead').html('');

    if (coinTypes != 'BTC' && coinTypes != 'ETH') {
      //改变表头
      const newTrs = newTr();
      $tab.find('thead').html(newTrs);
    }
    else {
      $tab.find('thead tr').html(content);
    }
    getCoinList(coinTypes);
    //重置表头
    setTableStyle();
  }

  //
  selCoinList(selCoin);


  // 切换新表头
  function newTr () {
    // <td>${lang.CANDY_TH_DATA}</td>
    return `<tr>
      <td>${lang.CANDY_TH_COIN}</td>
      <td>${lang.CANDY_TH_START}</td>
      <td>${lang.CANDY_TH_DATA}</td>
      <td>${lang.CANDY_TH_GOT}</td>
      <td>${lang.CANDY_CANGET}</td>
    </tr>`;
  }

  //列表
  function getCoinList(nums) {
    $('#dataBody').html('');
    $('#tableNoData').hide();
    $('#tableLoading').show();
    let url = '';
    // console.log(nums);
    if (nums == 3) {
      url = '/ajax_user/giftList';
    } else {
      url = '/ajax_user/branchlist';
    }
    http({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: {},
      success(data) {
        let dataList = [];
        let html = '';
        if (nums == "BTC") {
          dataList = data.data.BTC;
        }
        else if (nums == "ETH") {
          dataList = data.data.ETH;
        } else {
          dataList = data.data;
        }
        if (is(dataList, 'Array')) {
          if (dataList.length > 0) {
            //<td class="canGetCoin">${coin.unreceived}</td>
            //${coin.parent}
            if (nums == 3) {
              dataList.forEach((coin) => {
                html += `<tr>
                <td class="getBranch">${coin.coin}</td>
                <td>${coin.begin}</td>
                <td>${coin.end}</td>
                <td>${coin.number}</td>
                <td class='getCoinsTd' data-nums="3" data-parent="${coin.branch}"><a href="javascript:void(0);" class='${coin.number != 0 ? "not_get" : "noraml_get"}'>${lang['CANDY_CANGET']}</a></td>
                </tr>`;
              });
            } else {
              dataList.forEach((coin) => {
                html += `<tr>
                <td class="getBranch">${coin.branch}</td>
                <td>${coin.height}</td>
                <td>${coin.percent}</td>
                <td>${coin.expire}</td>
                <td>${coin.received}</td>
                <u style="display:none;">${coin.unreceived}</u>
                <td class='getCoinsTd' data-nums="${nums}" data-parent="${coin.parent}"><a href="javascript:void(0);" class='${coin.unreceived == 0 ? "not_get" : "noraml_get"}'>${lang['CANDY_CANGET']}</a></td>
                </tr>`;
              });
            }

            $('#dataBody').html(html);
            $('#tableLoading').hide();
            // 重置表頭
            setTableStyle();
          }
          else {
            $('#tableNoData').show();
            $('#tableLoading').hide();
          }
        }
      },
      error(err) {
        if (err)
          myAlert.show(lang['GET_DATA_FAIL']);
      }
    })
  }

  // 獲取表格數據
  function getCoinsAlert(coin) {
    let mus = coin.nums;
    let canGetCoin =''
    if (coin.coinNum) {
      canGetCoin =  coin.coinNum + coin.branch + '';
    } else if (coin.dataNum) {
      canGetCoin =coin.dataNum + coin.branch + '';
    }
    let coinTypes = '';
    // nums == 1 ? coinTypes = 'BTC' : nums == 2 ? coinTypes = 'ETH' : coinTypes = lang['CANDY_ACTIVE_COIN'];
    let htmls = `
                <p class="candy_tips_get">${lang['CANDY_GOT']}</p>
                <p class="candy_green">${canGetCoin}</p>
                `;
    //添加标题
    myAlert.show(htmls);
    //设定点击按钮之后的回调函数
    $('[data-btnsu="sureBtn"]').click(function(event) {
      getCoinList(mus);
    });
  }

  // 领取分叉币
  function getCoins(t, nums) {
    let parent = t.attr('data-parent').toLocaleLowerCase();
    let branch = t.parent('tr').find('.getBranch').text().toLocaleLowerCase();
    const coinNum = t.prevAll('u').text();
    if (nums != 3) {
      http({
        url: '/ajax_user/getBranch',
        type: 'POST',
        dataType: 'json',
        data: {branch:branch, parent:parent},
        success(data) {
          if (data.status == 1) {
            getCoinsAlert({branch, coinNum, nums});
          } else {
            myAlert.show(data.msg);
          }
        },
        error(err) {
          if (err)
          myAlert.show(lang['GET_DATA_FAIL']);
        }
      })
    } else {
      http({
        url: '/ajax_user/coinGift',
        type: 'POST',
        dataType: 'json',
        data: {coin:branch},
        success(data) {
          if (data.status == 1) {
            if (branch === "nano") {
              branch = "Nano";
            }
            let dataNum = data.data;
            getCoinsAlert({branch, dataNum, nums});
          } else {
            myAlert.show(data.msg);
            if (data.data.need_real_auth == 1) {
              $('[data-btnsu="sureBtn"]').click(function(event) {
                window.location.href = '/user/realinfo';
              });
            }
          }
        },
        error(err) {
          if (err)
          myAlert.show(lang['GET_DATA_FAIL']);
        }
      })
    }
  }

  $('body').on('click', '.getCoinsTd', function() {
    const t = $(this);
    if (t.find('a').hasClass('not_get')) {
      return  false;
    }
    else {
      let nums = t.attr('data-nums');
      getCoins(t, nums);
    }
  });

  // 獲取路由參數
  function GetQueryString(name) {
    const reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  let aCoin = GetQueryString('aCoin');
  if (aCoin) {
    $(`#coinList span`).removeClass('sel-coin');
    $(`#coinList span[data-coincode='${aCoin}']`).addClass("sel-coin");
    if (aCoin == 3) {
      getCoinList(3);
      $("#changeCoin").html($(`#coinList span[data-coincode='${aCoin}']`).html().trim());
    }
  } else {
    // 獲取列表 默認
    getCoinList('BTC');
  }

});

// $(document).ready(function() {
//   let url = window.location.href;
//
//   //打開聊天室接受數據功能
//   // talking();
//   chkhttpLang("#baseLang", http);
//   // 获取语言包
//   const lang = getLanguagePack() || {
//     "CANDY_TH_COIN": "幣種",
//     "CANDY_TH_START": "開始日期",
//     "CANDY_TH_DATA": "截止日期",
//     "CANDY_TH_GOT": "已領取",
//     "GET_DATA_FAIL": "獲取數據失敗",
//     "CANDY_ACTIVE_COIN": "活動贈送幣",
//     "CANDY_CANGET": "領取",
//     "CANDY_GOT": "恭喜你你已經成功領取"
//   };
//   nav();
//   activeNav();
//   getCoin(1);
//
//   //从领取奖励部分跳过去
//
//   const myAlert = new Alert("");
//   const $tab = $("#tableContent");
//   const $ul = $('.range_coin li a');
//   const content = $tab.find('thead tr').html();
//   const $bot = $('.header-header-bottom');
//   const $act = $('.range_coin').find('li');
//   // const canGetCoin = 'BTC';
//   // 初始化
//   setTableStyle();
//   window.onresize = function() {
//     setTableStyle();
//   };
//
//   //点击切换
//   $ul.click(function(){
//     const t = $(this);
//     classTab(t, content)
//   })
//
//   if (url.indexOf('?index')) {
//     classTab($('[data-nums="3"]'));
//   } else {
//     getCoinList(1);
//   }
//
//
//   function classTab(t, content) {
//     if (!t.hasClass('active')) {
//       $('.active').removeClass('active');
//       t.addClass('active');
//       if (t.attr('data-nums') === '3') {
//         $tab.find('thead').html('');
//         //清空thead底下存在的表头
//         $('#tHead').remove();
//         //改变表头
//         const newTrs = newTr();
//         $tab.find('thead').html(newTrs);
//         //重置表头
//         setTableStyle();
//
//         $bot.hide();
//       }
//       ///ajax_user/getUserInfo
//       else {
//          $('#tHead').remove();
//          $tab.find('thead tr').html(content);
//          setTableStyle();
//          if (t.attr('data-nums') === '1') {
//            $bot.find('span.coin_type').text('BTC');
//          }
//          else {
//            $bot.find('span.coin_type').text('ETH');
//          }
//          $bot.show();
//       }
//     }
//     //獲取幣數據
//     getCoin(t.attr('data-nums'));
//     //獲取列表數據
//     getCoinList(t.attr('data-nums'));
//   }
//   //切换新表头
//   function newTr () {
//     return `<tr>
//       <td>${lang.CANDY_TH_COIN}</td>
//       <td>${lang.CANDY_TH_START}</td>
//       <td>${lang.CANDY_TH_DATA}</td>
//       <td>${lang.CANDY_TH_GOT}</td>
//       <td>${lang.CANDY_CANGET}</td>
//     </tr>`;
//   }
//   //可用分叉币获取
//   function getCoin(nums) {
//     http({
//       url: '/ajax_user/getUserInfo',
//       type: 'POST',
//       dataType: 'json',
//       data: {},
//       success(data) {
//         if (data.status == 1) {
//           if (nums == 1) {
//             $('.coin_datas').html(data.data.btc_over);
//           }
//           else if (nums == 2) {
//             $('.coin_datas').html(data.data.eth_over);
//           }
//         }
//       },
//       error(err) {
//         if (err)
//           myAlert.show(lang['GET_DATA_FAIL']);
//       }
//     })
//   }
//   function getCoinList(nums) {
//     $('#dataBody').html('');
//     $('#tableNoData').hide();
//     $('#tableLoading').show();
//     let url = '';
//     if (nums == 3) {
//       url = '/ajax_user/giftList';
//     } else {
//       url = '/ajax_user/branchlist';
//     }
//     http({
//       url: url,
//       type: 'POST',
//       dataType: 'json',
//       data: {},
//       success(data) {
//         let dataList = [];
//         let html = '';
//         if (nums == 1) {
//           dataList = data.data.BTC;
//         }
//         else if (nums == 2) {
//           dataList = data.data.ETH;
//         } else {
//           dataList = data.data;
//         }
//         if (is(dataList, 'Array')) {
//           if (dataList.length > 0) {
//             //<td class="canGetCoin">${coin.unreceived}</td>
//             if (nums == 3) {
//               dataList.forEach((coin) => {
//                 html += `<tr>
//                 <td class="getBranch">${coin.coin}</td>
//                 <td>${coin.begin}</td>
//                 <td>${coin.end}</td>
//                 <td>${coin.number}</td>
//                 <td class='getCoinsTd' data-nums="3" data-parent="${coin.branch}"><a href="javascript:void(0);" class='${coin.number != 0 ? "not_get" : "noraml_get"}'>${lang['CANDY_CANGET']}</a></td>
//                 </tr>`;
//               });
//             } else {
//               dataList.forEach((coin) => {
//                 html += `<tr>
//                 <td class="getBranch">${coin.parent}</td>
//                 <td>${coin.height}</td>
//                 <td>${coin.percent}</td>
//                 <td>${coin.expire}</td>
//                 <td>${coin.received}</td>
//                 <u style="display:none;">${coin.unreceived}</u>
//                 <td class='getCoinsTd' data-nums="${nums}" data-parent="${coin.branch}"><a href="javascript:void(0);" class='${coin.unreceived == 0 ? "not_get" : "noraml_get"}'>${lang['CANDY_CANGET']}</a></td>
//                 </tr>`;
//               });
//             }
//
//             $('#dataBody').html(html);
//             $('#tableLoading').hide();
//             // 重置表頭
//             setTableStyle();
//           }
//           else {
//             $('#tableNoData').show();
//             $('#tableLoading').hide();
//           }
//         }
//       },
//       error(err) {
//         if (err)
//           myAlert.show(lang['GET_DATA_FAIL']);
//           $('#tableLoading').hide();
//       }
//     })
//   }
//   $('body').on('click', '.getCoinsTd', function() {
//     const t = $(this);
//     if (t.find('a').hasClass('not_get')) {
//       return  false;
//     }
//     else {
//       let nums = t.attr('data-nums');
//       getCoins(t, nums);
//     }
//   })
//   //弹窗
//   function getCoinsAlert(coin) {
//     let mus = coin.nums;
//     let canGetCoin =''
//     if (coin.coinNum) {
//       canGetCoin =  coin.coinNum + coin.branch + '';
//     } else if (coin.dataNum) {
//       canGetCoin =coin.dataNum + coin.branch + '';
//     }
//     // let nums = $act.find('a.acitve').attr('data-nums');
//     let coinTypes = '';
//     // nums == 1 ? coinTypes = 'BTC' : nums == 2 ? coinTypes = 'ETH' : coinTypes = lang['CANDY_ACTIVE_COIN'];
//     let htmls = `
//                 <p class="candy_tips_get">${lang['CANDY_GOT']}</p>
//                 <p class="candy_green">${canGetCoin}</p>
//                 `;
//     //添加标题
//     myAlert.setTitle('领取甜品');
//     myAlert.show(htmls);
//     //设定弹窗宽
//     myAlert.setBtnWidth('80%');
//     //设定点击按钮之后的回调函数
//     $('[data-btnsu="sureBtn"]').click(function(event) {
//       getCoinList(mus);
//     });
//   }
//   //领取分叉币
//   function getCoins(t, nums) {
//     const parent = t.attr('data-parent').toLocaleLowerCase();
//     const branch = t.parent('tr').find('.getBranch').text().toLocaleLowerCase();
//     const coinNum = t.prevAll('u').text();
//     if (nums != 3) {
//       http({
//         url: '/ajax_user/getBranch',
//         type: 'POST',
//         dataType: 'json',
//         data: {branch:branch, parent:parent},
//         success(data) {
//           if (data.status != 3) {
//             getCoinsAlert({branch, coinNum, nums});
//           } else {
//             myAlert.show(data.msg);
//           }
//         },
//         error(err) {
//           if (err)
//             myAlert.show(lang['GET_DATA_FAIL']);
//         }
//       })
//     } else {
//       http({
//         url: '/ajax_user/coinGift',
//         type: 'POST',
//         dataType: 'json',
//         data: {coin:branch},
//         success(data) {
//           if (data.status == 1) {
//             let dataNum = data.data;
//             getCoinsAlert({branch, dataNum, nums});
//           } else {
//             myAlert.show(data.msg);
//           }
//         },
//         error(err) {
//           if (err)
//             myAlert.show(lang['GET_DATA_FAIL']);
//         }
//       })
//     }
//
//   }
// });
