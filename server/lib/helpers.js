
module.exports = {
  genId(len) {
    let options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let id = '';

    for (let i = 0; i < len; i++)
      id += options[Math.floor(Math.random() * options.length)];

    return id;
  },
  genUnderstandingScore(arr) {
    let sum = 0;
    for (let each of arr) sum += each;
    return (sum / arr.length) * 10;
  }
}
