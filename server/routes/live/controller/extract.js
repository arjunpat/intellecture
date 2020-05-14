const retext = require('retext')
const pos = require('retext-pos')
const keywords = require('retext-keywords')

function prepareQuestions(questions) {
  return questions.length > 0 && questions.map(e => e.question.trim()).join('\n').toLowerCase().replace(/\?/g, '');
}

function processResult(questions, res) {
  let result = [];

  // keyphrases
  for (let each of res.data.keyphrases) {
    // if (each.score < .4) break;

    let key = '';

    // get key based on first result
    for (let node of each.matches[0].nodes) {
      switch (node.type) {
        case 'WordNode':
          for (let child of node.children) {
            key += child.value;
          }
          break;
        case 'WhiteSpaceNode':
          key += ' ';
          break;
      }
    }

    // iterate through the rest of matches to categorize
    let lines = new Set();
    for (let match of each.matches) {
      for (let node of match.nodes) {
        lines.add(
          questions[node.position.start.line - 1].uid
        );
      }
    }

    result.push({
      type: 'keyphrase',
      value: key,
      questions: Array.from(lines),
      score: each.score,
      weight: each.weight
    });
  }

  // keywords
  for (let each of res.data.keywords) {
    // if (each.score < .4) break;

    let key = each.matches[0].node.children[0].value;

    let lines = new Set();
    for (let match of each.matches) {
      lines.add(
        questions[match.node.position.start.line - 1].uid
      );
    }

    result.push({
      type: 'keyword',
      value: key,
      questions: Array.from(lines),
      score: each.score
    })
  }

  result.sort((a, b) => b.score - a.score);
  
  return result;
}

function consolidate(result) {
  let map = {};

  for (let each of result) {
    if (map[each.value]) {
      // only occasionally does anything
      let qs = new Set(map[each.value].questions.concat(each.questions));
      map[each.value].questions = Array.from(qs);
    } else {
      map[each.value] = each;
    }
  }

  return Object.values(map);
}

function extract(questions) {
  return new Promise((resolve, reject) => {
    console.time('extract');
    let input = prepareQuestions(questions);
    retext().use(pos).use(keywords).process(input, (err, result) => {
      if (err) return reject();
      resolve(consolidate(processResult(questions, result)));
      console.timeEnd('extract');
    });
  });
}

module.exports = extract;
