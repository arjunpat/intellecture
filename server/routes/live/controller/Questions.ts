import { Question } from '../types';

export default class Questions {
  private questions: Question[] = [];
  private upvotes: { [key: string]: Set<string> } = {};
  private dismissed: Set<string> = new Set<string>();

  constructor() {}

  add(q: Question): void {
    this.questions.push(q);
    this.upvotes[q.question_uid] = new Set<string>();
  }

  getAll(): Question[] {
    return this.questions;
  }

  getNondismissed(): Question[] {
    return this.questions.filter(q => !this.dismissed.has(q.question_uid));
  }

  count() {
    return this.questions.length;
  }

  validUpvote(question_uid: string, student_uid: string) {
    return this.upvotes[question_uid] && !this.upvotes[question_uid].has(student_uid);
  }

  upvote(question_uid: string, student_uid: string): number {
    this.upvotes[question_uid].add(student_uid);
    return this.upvotes[question_uid].size;
  }

  getUpvoteCount(question_uid: string) {
    return this.upvotes[question_uid].size;
  }

  getAllUpvotes() {
    return this.upvotes;
  }

  dismiss(question_uid: string) {
    this.dismissed.add(question_uid);
  }
}