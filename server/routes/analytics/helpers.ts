import { Lecture } from '../../types';

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

export function getIncorrect(events: Event[]): Set<string> {
  let badUids = new Set<string>();
  let inLecture: { [key: string]: boolean } = {};
  
  for (let each of events) {
    if (
      ((<Status>each).status === 'j' && inLecture[each.account_uid]) ||
      ((<Status>each).status === 'l' && !inLecture[each.account_uid]) ||
      (typeof (<Score>each).score === 'number' && !inLecture[each.account_uid])
    )
      badUids.add(each.account_uid);
    
    if (typeof (<Status>each).status === 'string')
      inLecture[each.account_uid] = (<Status>each).status === 'j' ? true : false; 
  }

  for (let each in inLecture)
    if (inLecture[each])
      badUids.add(each);

  return badUids;
}

interface StudentInterval {
  score: number,
  from: number,
  to: number
}

export function genStudentIntervals(events: Event[]): StudentInterval[] {
  /*
   * lots of assumptions made in this code, including
   * 1) all score changes are between join and leaves
   * 2) the first status is a join
   * 3) every join is closed with a leave sometime later before any other joins occur
   * 
   * theses assumptions are assumed because of correctness check above
   * which removes all uids who do not satisfy these assumptions
   */
  let res: StudentInterval[] = [];

  let startTs: number = 0;
  let score: number = 5;
  for (let e of events) {
    if ((<Status>e).status) { // Status
      if ((<Status>e).status === 'j')
        startTs = e.elapsed;
      else
        res.push({
          from: startTs,
          to: e.elapsed,
          score
        });
    } else { // Score
      res.push({
        from: startTs,
        to: e.elapsed,
        score
      });
      startTs = e.elapsed;
      score = (<Score>e).score;
    }
  }

  return res;
}

export function getStats(lecture: Lecture, log: Status[], scoreLog: Score[]) {
  const startTime = <number>lecture.start_time;
  const endTime = <number>lecture.end_time;
  const lectureLength = endTime - startTime;
  let events: Event[] = [...log, ...scoreLog];
  events.sort((a, b) => a.elapsed - b.elapsed);

  let badUids = getIncorrect(events);
  if (badUids.size !== 0) {
    console.error(Date.now(), '(1) present/avg us error for lecture_uid', lecture.uid, 'with uids', badUids);
  }

  // fill map by account_uid
  const map: { [key: string]: Event[] } = {};
  for (let each of events) {
    if (!map[each.account_uid]) map[each.account_uid] = [];
    map[each.account_uid].push(each);
  }

  const first_join: { [key: string]: number } = {};
  for (let each in map) {
    first_join[each] = map[each][0].elapsed + startTime;
  }

  // remove bad uids
  for (let each in badUids) {
    delete map[each];
  }

  const present: { [key: string]: number } = {};
  const avg_us: { [key: string]: number } = {};
  for (let uid in map) {
    let intervals = genStudentIntervals(map[uid]);

    // calculate present and avg_us
    present[uid] = 0;
    avg_us[uid] = 0;
    for (let each of intervals) {
      present[uid] += each.to - each.from;
      avg_us[uid] += (each.to - each.from) * each.score;
    }

    avg_us[uid] = round(avg_us[uid] / present[uid], 2); // gets average us and rounds

    // sanity checks
    if (avg_us[uid] < 0 || avg_us[uid] > 10) {
      console.error(Date.now(), '(2) avg us compute error for lecture_uid', lecture.uid, 'and uid', uid);
      delete avg_us[uid];
    }

    if (present[uid] > lectureLength) {
      console.error(Date.now(), '(3) present parse error for lecture_uid', lecture.uid, 'and uid', uid);
      delete present[uid];
    }
  }

  return { present, avg_us, first_join };
}
