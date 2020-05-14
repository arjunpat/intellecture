const extract = require('./extract');

/* let questions = [
  'What is a Gaussian surface?',
  'How do you calculate voltage?',
  'How do you make a Gaussian surface??',
  'Is a Gaussian surface a real physical object?',
  'What\'s the formula for flux ?',
  'How do you used a closed surface integral to calculate flux?',
  'What is the relationship between voltage and a Gaussian surfaces?'
] */

let questions = [
  'What is the difference between a force and F = ma?',
  'Why are Newton\'s laws important?',
  'Does this mean that all reactions will have an opposite and equal reaction?',
  'What is the difference between a Newton and weight?',
  'Are kilograms a measure of weight or mass?',
  'What\'s the difference between weight and mass?'
]

questions = questions.map(e => {
  return {
    question: e,
    uid: Math.round(Math.random() * 10e9) + ''
  }
});

extract(questions).then(result => {
  for (let each of result) {
    let lol = [];
    for (let q of each.questions) {
      lol.push(questions.filter(e => e.uid === q)[0].question)
    }
    each.questions = lol;
    console.log(each);
  }
})
