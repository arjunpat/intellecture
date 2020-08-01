import { Lecture } from '../../types';

export function sum(arr: number[]) {
  let sum = 0;
  for (let each of arr) sum += each;
  return sum;
}

export function diff(arr: number[]): number[] {
  let res: number[] = [];
  res.length = arr.length - 1;
  for (let i = 0; i < arr.length - 1; i++) res[i] = arr[i + 1] - arr[i];
  return res;
}

export function round(num: number, places: number = 0): number {
  let p = 10 ** places;
  return Math.round((num + Number.EPSILON) * p) / p;
}

interface Event {
  account_uid: string,
  elapsed: number
}

interface Status extends Event {
  status: 'j' | 'l'
}

interface Score extends Event {
  score: number
}

function getIncorrect(log: Status[], scoreLog: Score[]): Set<string> {
  let badUids = new Set<string>();
  let inLecture: { [key: string]: boolean } = {};
  let events: any = [...log, ...scoreLog];
  events.sort((a, b) => a.elapsed - b.elapsed);
  
  for (let each of events) {
    if (
      (each.status === 'j' && inLecture[each.account_uid]) ||
      (each.status === 'l' && !inLecture[each.account_uid]) ||
      (typeof each.score === 'number' && !inLecture[each.account_uid])
    )
      badUids.add(each.account_uid);
    
    if (typeof each.status === 'string')
      inLecture[each.account_uid] = each.status === 'j' ? true : false; 
  }

  for (let each in inLecture)
    if (inLecture[each])
      badUids.add(each);

  return badUids;
}

export function getPresentnessAndUnderstandingScores(lecture: Lecture, log: Status[], scoreLog: Score[]) {
  const lectureLength = <number>lecture.end_time - <number>lecture.start_time;
  log.sort((a, b) => a.elapsed - b.elapsed);
  scoreLog.sort((a, b) => a.elapsed - b.elapsed);

  // perform correctness check (at least for now)
  let badUids = getIncorrect(log, scoreLog);
  if (badUids.size !== 0) {
    console.error(Date.now(), '(1) present/avg us error for lecture_uid', lecture.uid, 'with uids', badUids);
    log = log.filter(e => !badUids.has(e.account_uid));
    scoreLog = scoreLog.filter(e => !badUids.has(e.account_uid));
  }

  const logMap: { [key: string]: Status[] } = {};
  for (let each of log) {
    if (!logMap[each.account_uid]) logMap[each.account_uid] = [];
    logMap[each.account_uid].push(each);
  }

  const scoreLogMap: { [key: string]: Score[] } = {};
  for (let each of scoreLog) {
    if (!scoreLogMap[each.account_uid]) scoreLogMap[each.account_uid] = [];
    scoreLogMap[each.account_uid].push(each);
  }

  const present: { [key: string]: number } = {};
  for (let each in logMap) {
    present[each] = sum(diff(logMap[each].map(e => e.elapsed)));

    if (present[each] > lectureLength) {
      console.error(Date.now(), '(2) present parse error for lecture_uid', lecture.uid, 'and uid', each);
      delete present[each];
    }
  }

  // calculate avg understanding for each

  /*
   * lots of assumptions made in this code, including
   * 1) all score changes are between join and leaves
   * 2) the first status is a join
   * 3) every join is closed with a leave sometime later before any other joins occur
   * 
   * theses assumptions are assumed because of correctness check above
   * which removes all uids who do not satisfy these assumptions
   */
  let avg_us: { [key: string]: number } = {};
  for (let uid in logMap) {
    avg_us[uid] = 0;
    scoreLogMap[uid] = scoreLogMap[uid] || []; // edge case: never changed score
    let arr: any[] = [...logMap[uid], ...scoreLogMap[uid]];
    arr.sort((a, b) => a.elapsed - b.elapsed); // asc order

    let startTs: number = 0;
    let score: number = 5;
    for (let e of arr) {
      if (e.status) { // Status
        if (e.status === 'j')
          startTs = e.elapsed;
        else
          avg_us[uid] += (e.elapsed - startTs) * score;
      } else {
        avg_us[uid] += (e.elapsed - startTs) * score;
        startTs = e.elapsed;
        score = e.score;
      }
    }
  }

  for (let each in avg_us) {
    avg_us[each] = round(avg_us[each] / present[each], 2); // gets average us
    if (avg_us[each] < 0 || avg_us[each] > 10) {
      console.error(Date.now(), '(3) avg us compute error for lecture_uid', lecture.uid, 'and uid', each);
      delete avg_us[each];
    }
  }

  return { present, avg_us };
}
