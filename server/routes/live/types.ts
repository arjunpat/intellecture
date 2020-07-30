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

  export interface Bulk extends Message {
    messages: Message[]
  }
  
  export interface LectureInfo extends Message {
    uid: string,
    start_time: number,
    class_name: string,
    lecture_name: string,
    creator: BasicAccountInfo,
    join_code: string
  }

  export interface StudentJoin extends Message {
    elapsed: number,
    uid: string,
    email: string,
    first_name: string,
    last_name: string,
    photo: string
  }

  export interface StudentLeave extends Message {
    uid: string
  }

  export interface NewQuestion extends Message {
    question_uid: string,
    creator_uid: string,
    question: string,
    elapsed: number
  }

  export interface QuesCategor extends Message {
    categories: QuestionCategory[]
  }

  export interface QuestionUpdate extends Message {
    question_uid: string,
    upvotes: number
  }

  export interface UsUpdate extends Message {
    score: number
  }

  export interface QuestionDismissed extends Message {
    question_uid: string
  }


  // students only
  export interface KickStudent extends Message {
    to: string
  }
}

