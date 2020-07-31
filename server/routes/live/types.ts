import { BasicAccountInfo } from '../../types';

export interface QuestionCategory {
  type: string,
  value: string,
  questions: string[],
  score: number,
  weight?: number
}

export interface Question {
  question_uid: string,
  creator_uid: string,
  question: string,
  elapsed: number // creation time
}

export interface Student extends BasicAccountInfo {
  uid: string,
  elapsed: number // join time
}

export namespace WS {

  export interface Message {
    type: string
  }
  
  /* -------------------- messages received by both student and teacher -------------------- */

  // As soon as client joins, they get this message from the server.
  // Gives basic info about the lecture.
  // Wait for this message before loading the UI, sending anything, or allowing the student to move the slider around.
  export interface LectureInfo extends Message {
    type: 'lecture_info',
    uid: string,
    start_time: number, // unix timestamp in miliseconds
    class_name: string,
    lecture_name: string,
    creator: BasicAccountInfo,
    join_code: string
  }

  // When a student asks a question, it gets sent like this.
  export interface NewQuestion extends Message {
    type: 'new_question',
    question_uid: string,
    creator_uid: string,
    question: string,
    elapsed: number
  }

  // When teacher dismisses question, everyone will receive this message.
  export interface QuestionDismissed extends Message {
    type: 'question_dismissed',
    question_uid: string
  }

  // When teacher ends lecture, server will send everyone this message.
  export interface EndLecture extends Message {
    type: 'end_lecture'
  }

  /* -------------------- messages ONLY sent to teacher -------------------- */
  // When the server wants to send many messages all at once but in one message for efficiency.
  export interface Bulk extends Message {
    type: 'bulk',
    messages: Message[] // array of normal messages
  }

  // As the lecture progresses, teacher will get this message when student joins.
  export interface StudentJoin extends Message {
    type: 'student_join',
    elapsed: number,
    uid: string,
    email: string,
    first_name: string,
    last_name: string,
    photo: string
  }

  // As lecture progresses, teacher will get this message when student leaves lecture.
  export interface StudentLeave extends Message {
    type: 'student_leave',
    uid: string
  }

  // As the lecture progresses, teacher will get this message at max every 10 seconds.
  export interface QuesCategor extends Message {
    type: 'ques_categor',
    categories: QuestionCategory[]
  }

  // As the lecture progresses, teacher will receive this message when there are new upvotes
  // for a particular question
  export interface QuestionUpdate extends Message {
    type: 'question_update',
    question_uid: string,
    upvotes: number
  }

  // As lecture progresses, teacher will get this message when new understanding score as students move their sliders.
  export interface UsUpdate extends Message {
    type: 'us_update',
    score: number
  }

  /* -------------------- messages ONLY sent to student -------------------- */
  // If student gets this message and "to" has their uid, they have been kicked from the lecture.
  export interface KickStudent extends Message {
    type: 'kick_student',
    to: string
  }
}

