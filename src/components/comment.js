module.exports = function (say) {
  // console.log('commen js');
  let n_date = new Date();
  console.log(n_date);
  console.log(`you wan me to say ${say}, ${n_date.getTime()}`);
};
