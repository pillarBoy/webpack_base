  /**
   * 解析JSON语言包
   */
  export default function getLanguagePack(wrapper) {
    wrapper = wrapper || $('#errTips');
    const strPlaceholder = wrapper.html();
    // console.log(strPlaceholder);
    var strObj = null;
    // console.log(wrapper);
    try {
      strObj = JSON.parse(strPlaceholder);
      return strObj;
    } catch (error) {
      console.log(error);
    }
    return strObj;
  }
