function canSay(say) {
  // console.log('commen js');
  if (say) {
    let n_date = new Date();
    console.log(n_date);
    console.log(`you wan me to say ${say}, ${n_date.getTime()}`);
  }
};

module.exports = canSay;
