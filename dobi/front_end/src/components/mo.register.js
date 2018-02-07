import '@/styles/common/mo.register.scss';

const resetReg = () => {
  const winHeight = window.screen.height;
  $('.layer-container').css({height: `${winHeight * window.devicePixelRatio}px`});
}

export default resetReg;
