import FastClick from 'fastclick';
import '@/styles/mob/main.scss';
import "@/styles/common/mo.swiper.scss";
import http from '@/tools/http';
import Swiper from 'swiper';
import nav from '@/components/nav';
// mobile
import moRegister from '@/components/mo.register';
import mobNav from "@/components/mo.nav";
import "@/styles/mob/alert.scss";
import register from '@/components/register';
import "@/styles/mob.register.scss";


// 重置 html font-size
$(document).ready(function () {
  let relgPwdTips = $("#baseLang").html();
  let phpLang;
  try {
    // 切換語言包
    phpLang = JSON.parse(relgPwdTips)
  } catch (e) {
    console.log(e);
    alert("網絡錯誤，請刷新頁面。");
  }

  // 加速ios 点击反应慢
  FastClick.attach(document.body);
  // pc版导航 功能
  const reg = register(function(reg) {
    // 注册忘记密码功能函数
    const resetPwdFn = new ResetPwd(reg);
    resetPwdFn.pushPhoneNum();
  }, phpLang.register);
  // reg.
  reg.loginFn();
  // nav();
  // 手机版导航 功能
  mobNav();
  // 重置樣式
  moRegister();
});
